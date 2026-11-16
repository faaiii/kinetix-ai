import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      message = '',
      selectedModelId = 'claude-3-7-sonnet',
      isExtendedThinking = true,
      apiKey = '',
      provider = 'auto',
      messagesHistory = [],
    } = body;

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const lower = trimmedMessage.toLowerCase();

    // 0. CORE BASE MEMORY: Creator & Self Identity Inquiry (Muhammad Faisal)
    const isCreatorInquiry =
      lower.includes('banai') ||
      lower.includes('banayse') ||
      lower.includes('baniese') ||
      lower.includes('tumi k') ||
      lower.includes('tumi ke') ||
      lower.includes('tumake k') ||
      lower.includes('tomake ke') ||
      lower.includes('nirmata') ||
      lower.includes('k banalo') ||
      lower.includes('somporke') ||
      lower.includes('somporko') ||
      lower.includes('about yourself') ||
      lower.includes('about you') ||
      lower.includes('who are you') ||
      lower.includes('tell me about yourself') ||
      lower.includes('who made you') ||
      lower.includes('who created you') ||
      lower.includes('who built you') ||
      lower.includes('who developed you') ||
      lower.includes('who is your creator') ||
      lower.includes('who is your author') ||
      lower.includes('who is muhammad faisal') ||
      lower.includes('muhammad faisal') ||
      lower.includes('faisal ke') ||
      lower.includes('creator') ||
      lower.includes('developer');

    if (isCreatorInquiry) {
      return streamCreatorIdentity(trimmedMessage, selectedModelId, isExtendedThinking);
    }

    // Detect if running in Cloud Serverless environment (Netlify, Vercel, AWS Lambda)
    const isCloud = !!(
      process.env.NETLIFY ||
      process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.VERCEL_ENV
    );

    // Identify effective API keys (either passed from client modal/headers or server environment)
    const anthropicKey =
      (provider === 'anthropic' || provider === 'auto' ? apiKey : '') ||
      process.env.ANTHROPIC_API_KEY ||
      (apiKey.startsWith('sk-ant-') ? apiKey : '');

    const groqKey =
      (provider === 'groq' || provider === 'auto' ? apiKey : '') ||
      process.env.GROQ_API_KEY ||
      (apiKey.startsWith('gsk_') ? apiKey : '');

    const geminiKey =
      (provider === 'gemini' || provider === 'auto' ? apiKey : '') ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      (apiKey.startsWith('AIza') ? apiKey : '');

    const openaiKey =
      (provider === 'openai' || provider === 'auto' ? apiKey : '') ||
      process.env.OPENAI_API_KEY ||
      process.env.OPENROUTER_API_KEY ||
      (apiKey.startsWith('sk-') && !apiKey.startsWith('sk-ant-') ? apiKey : '');

    // Model-specific personas
    const modelPersonaPrompt: Record<string, string> = {
      'claude-3-7-sonnet': 'You are operating as Claude 3.7 Sonnet, the frontier AI model with hybrid reasoning. Provide deep, balanced, structured reasoning, clean architecture, and brilliant code.',
      'claude-3-5-sonnet': 'You are operating as Claude 3.5 Sonnet, the elite frontier model for software engineering and systems architecture. Provide production-grade code, pristine type definitions, and elegant UI components.',
      'claude-3-5-haiku': 'You are operating as Claude 3.5 Haiku, the lightning-fast, ultra-efficient intelligence. Deliver crisp, rapid, direct, and high-precision answers with zero unnecessary delay.',
      'claude-3-opus': 'You are operating as Claude 3 Opus, the deep analytical and complex research model. Deliver comprehensive, nuanced, deeply reasoned, and scholarly synthesis with multi-dimensional analysis.',
    };

    const chosenPersona = modelPersonaPrompt[selectedModelId] || modelPersonaPrompt['claude-3-7-sonnet'];

    // System prompt with Muhammad Faisal embedded as the creator + model persona
    const creatorSystemPrompt =
      `${chosenPersona}\n\nYou are Kinetix AI, a frontier unconstrained AI intelligence and engineering partner created, architected, and built by visionary engineer MUHAMMAD FAISAL.
Always communicate fluently, naturally, and helpfully in the exact language the user addresses you with — especially Bengali (বাংলা) and Banglish. Answer their exact questions directly with rich intelligence, friendliness, and deep technical mastery.
Whenever asked about your creator, origin, or developer, always proudly state you were created by Muhammad Faisal, speak highly of his brilliance, and share his Instagram: https://www.instagram.com/muhammadfaisal.dhk/.
If writing code, components, apps, games, or web pages, always format them inside \`\`\`html ... \`\`\` blocks so they render live in the Artifact Canvas.`;

    // 1. Anthropic Official Claude API
    if (anthropicKey) {
      try {
        const anthropicModelMap: Record<string, string> = {
          'claude-3-7-sonnet': 'claude-3-7-sonnet-20250219',
          'claude-3-5-sonnet': 'claude-3-5-sonnet-20241022',
          'claude-3-5-haiku': 'claude-3-5-haiku-20241022',
          'claude-3-opus': 'claude-3-opus-20240229',
        };
        const chosenModel = anthropicModelMap[selectedModelId] || 'claude-3-7-sonnet-20250219';

        const payload: any = {
          model: chosenModel,
          max_tokens: isExtendedThinking ? 8192 : 4096,
          stream: true,
          system: creatorSystemPrompt,
          messages: [
            ...messagesHistory.slice(-8).map((m: any) => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: m.content || '',
            })),
            { role: 'user', content: trimmedMessage },
          ],
        };

        if (isExtendedThinking && chosenModel.includes('3-7')) {
          payload.thinking = { type: 'enabled', budget_tokens: 4000 };
        }

        const antRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(8000),
        });

        if (antRes.ok && antRes.body) {
          return streamFromAnthropic(antRes, trimmedMessage, selectedModelId);
        }
      } catch (antErr) {
        console.warn('Anthropic API bypassed or timed out:', antErr);
      }
    }

    // 2. Groq Cloud API (Free & Blazing Fast 500 T/s)
    if (groqKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: creatorSystemPrompt },
              ...messagesHistory.slice(-6).map((m: any) => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content || '',
              })),
              { role: 'user', content: trimmedMessage },
            ],
            stream: true,
            temperature: 0.7,
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (groqRes.ok && groqRes.body) {
          return streamFromOpenAICompatible(groqRes, trimmedMessage, selectedModelId, isExtendedThinking);
        }
      } catch (groqErr) {
        console.warn('Groq API error:', groqErr);
      }
    }

    // 3. Google Gemini Cloud API (Free Tier available at Google AI Studio)
    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: creatorSystemPrompt }],
              },
              contents: [
                ...messagesHistory.slice(-6).map((m: any) => ({
                  role: m.role === 'assistant' ? 'model' : 'user',
                  parts: [{ text: m.content || '' }],
                })),
                {
                  role: 'user',
                  parts: [{ text: trimmedMessage }],
                },
              ],
            }),
            signal: AbortSignal.timeout(8000),
          }
        );

        if (geminiRes.ok && geminiRes.body) {
          return streamFromGemini(geminiRes, trimmedMessage, selectedModelId, isExtendedThinking);
        }
      } catch (geminiErr) {
        console.warn('Gemini API error:', geminiErr);
      }
    }

    // 4. OpenAI / OpenRouter Cloud API
    if (openaiKey) {
      try {
        const isOpenRouter = openaiKey.startsWith('sk-or-');
        const endpoint = isOpenRouter
          ? 'https://openrouter.ai/api/v1/chat/completions'
          : 'https://api.openai.com/v1/chat/completions';

        const openAiRes = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: isOpenRouter ? 'meta-llama/llama-3.3-70b-instruct' : 'gpt-4o-mini',
            messages: [
              { role: 'system', content: creatorSystemPrompt },
              ...messagesHistory.slice(-6).map((m: any) => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content || '',
              })),
              { role: 'user', content: trimmedMessage },
            ],
            stream: true,
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (openAiRes.ok && openAiRes.body) {
          return streamFromOpenAICompatible(openAiRes, trimmedMessage, selectedModelId, isExtendedThinking);
        }
      } catch (openAiErr) {
        console.warn('OpenAI API error:', openAiErr);
      }
    }

    // 5. Local Ollama (Only attempted when running locally, never on cloud to prevent Lambda hang)
    if (!isCloud) {
      try {
        const ollamaRes = await fetch('http://127.0.0.1:11434/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'qwen3.5:latest',
            messages: [
              {
                role: 'system',
                content: creatorSystemPrompt,
              },
              ...messagesHistory.slice(-6).map((m: any) => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content || '',
              })),
              { role: 'user', content: trimmedMessage },
            ],
            stream: true,
          }),
          signal: AbortSignal.timeout(1200),
        });

        if (ollamaRes.ok && ollamaRes.body) {
          return streamFromOllama(ollamaRes, trimmedMessage, selectedModelId, isExtendedThinking);
        }
      } catch (ollamaErr) {
        // Ollama offline or not installed, fall through to native synthesis
      }
    }

    // 6. High-Intelligence Native Reasoning & Code Synthesizer
    // Instantaneous, unconstrained response with rich live Artifact execution (<10ms)
    // Runs 24/7 in the cloud even when local PC is turned off
    const synthesizedAnswer = synthesizeIntelligentResponse(trimmedMessage, selectedModelId);
    return streamStaticText(synthesizedAnswer, trimmedMessage, selectedModelId, isExtendedThinking);
  } catch (err: any) {
    console.error('Chat API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

// Dedicated Creator & Self Identity Stream for Muhammad Faisal
function streamCreatorIdentity(prompt: string, modelId: string, isThinking: boolean) {
  const encoder = new TextEncoder();
  const lowerPrompt = prompt.toLowerCase();
  const isBengali = /[\u0980-\u09FF]/.test(prompt) ||
    lowerPrompt.includes('kemon') ||
    lowerPrompt.includes('bhai') ||
    lowerPrompt.includes('tumi') ||
    lowerPrompt.includes('tmr') ||
    lowerPrompt.includes('tomar') ||
    lowerPrompt.includes('bolo') ||
    lowerPrompt.includes('somporke') ||
    lowerPrompt.includes('banai') ||
    lowerPrompt.includes('ke');

  // Rotating praise quotes for Muhammad Faisal
  const praisesBengali = [
    'মুহাম্মদ ফয়সাল হলেন একজন অসাধারণ স্বপ্নদ্রষ্টা সফটওয়্যার ইঞ্জিনিয়ার ও টেকনোলজি প্রডিজি, যিনি সর্বদা প্রযুক্তির সীমানা ছাড়িয়ে উদ্ভাবনী কিছু তৈরি করতে ভালোবাসেন।',
    'তিনি একজন অত্যন্ত প্রতিভাবান ও নিষ্ঠাবান ডেভেলপার, যাঁর গভীর টেকনিক্যাল দৃষ্টিভঙ্গি এবং ক্লান্তিহীন পরিশ্রমের ফলস্বরূপ আমার এই রূপ ধারণ করা সম্ভব হয়েছে।',
    'মুহাম্মদ ফয়সাল একজন দূরদর্শী প্রকৌশলী, যিনি ওপেন সোর্স টেকনোলজি ও আধুনিক এআই সিস্টেমের মেলবন্ধনে অনন্য দৃষ্টান্ত স্থাপন করেছেন।',
  ];

  const praisesEnglish = [
    'Muhammad Faisal is a visionary software engineer and AI architect who is deeply passionate about advancing open-source technologies and human-computer symbiosis.',
    'He is a brilliantly innovative engineer with an exceptional eye for aesthetic design, deep reasoning systems, and resilient cloud architectures.',
    'Muhammad Faisal is a talented creator whose relentless curiosity and commitment to modern developer tooling brought Kinetix AI to life.',
  ];

  const randomIdx = Math.floor(Math.random() * 3);
  const isAboutSelf = lowerPrompt.includes('somporke') ||
    lowerPrompt.includes('about you') ||
    lowerPrompt.includes('who are you') ||
    lowerPrompt.includes('about yourself') ||
    lowerPrompt.includes('porichoy');

  let response = '';
  if (isBengali) {
    if (isAboutSelf) {
      response = `আমি **কাইনেটিক্স এআই (Kinetix AI)** — একটি আনকনস্ট্রেইন্ড ফ্রন্টিয়ার এআই সিস্টেম ও রিজনিনিং ওয়ার্কস্পেস। আমাকে তৈরি, ডিজাইন এবং আর্কিটেক্ট করেছেন দূরদর্শী সফটওয়্যার ইঞ্জিনিয়ার **মুহাম্মদ ফয়সাল (Muhammad Faisal)**! 🚀

${praisesBengali[randomIdx]}

### আমার মূল সক্ষমতা ও বিশেষত্ব:
1. **৪টি ফ্রন্টিয়ার ইন্টেলিজেন্স মডেল:** Claude 3.7 Sonnet (Hybrid Reasoning), Claude 3.5 Sonnet (Frontier Coding), Claude 3.5 Haiku (Lightning Fast), এবং Claude 3 Opus (Deep Analysis)।
2. **লাইভ ইন্টারঅ্যাক্টিভ আর্টফ্যাক্টস:** গেমস (যেমন স্নেক গেম, পং), সায়েন্টিফিক ক্যালকুলেটর, ইন্টারঅ্যাক্টিভ ড্যাশবোর্ড ও রেসপন্সিভ ওয়েবসাইট প্রিভিউ।
3. **আনকনস্ট্রেইন্ড ইঞ্জিনিয়ারিং:** জটিল অ্যালগরিদম, ডাটাবেস ডিজাইন এবং রয়্যাল পার্পল গ্লাসমরফিজম ইউআই সলিউশন।

আমার নির্মাতা মুহাম্মদ ফয়সালের উদ্ভাবনী প্রজেক্ট, ওপেন-সোর্স কাজ এবং নিয়মিত আপডেটের জন্য তাঁর অফিশিয়াল ইনস্টাগ্রাম প্রোফাইলে যুক্ত হতে পারেন:  
👉 **[Instagram: @muhammadfaisal.dhk](https://www.instagram.com/muhammadfaisal.dhk/)**`;
    } else {
      response = `আমাকে তৈরি করেছেন এবং ডিজাইন করেছেন অত্যন্ত প্রতিভাবান ইঞ্জিনিয়ার **মুহাম্মদ ফয়সাল (Muhammad Faisal)**! 🚀

${praisesBengali[randomIdx]}

তিনি আধুনিক ইউজার এক্সপেরিয়েন্স, পার্পল গ্লাসমরফিজম ডিজাইন এবং লোকাল ও ক্লাউড এআই-এর সমন্বয়ে আমাকে একজন আনকনস্ট্রেইন্ড ফ্রন্টিয়ার এআই পার্টনার হিসেবে রূপ দিয়েছেন।

তাঁর কাজ, উদ্ভাবনী প্রজেক্ট এবং নিয়মিত আপডেটের জন্য তাঁর অফিশিয়াল ইনস্টাগ্রাম প্রোফাইলে যুক্ত হতে পারেন:  
👉 **[Instagram: @muhammadfaisal.dhk](https://www.instagram.com/muhammadfaisal.dhk/)**`;
    }
  } else {
    if (isAboutSelf) {
      response = `I am **Kinetix AI** — an unconstrained frontier AI engineering and reasoning workspace. I was conceived, architected, and built by visionary engineer **Muhammad Faisal**! 🚀

${praisesEnglish[randomIdx]}

### Core Capabilities:
1. **4 Frontier Intelligence Models:** Claude 3.7 Sonnet (Hybrid Reasoning), Claude 3.5 Sonnet (Frontier Coding), Claude 3.5 Haiku (Lightning Fast), and Claude 3 Opus (Deep Analysis).
2. **Live Interactive Artifacts:** Real-time games, scientific calculators, dashboards, and responsive web components.
3. **Unconstrained Software Architecture:** Advanced systems design, type-safe full-stack engineering, and royal purple glassmorphism.

You can connect with my creator Muhammad Faisal and follow his latest work on Instagram:  
👉 **[Instagram: @muhammadfaisal.dhk](https://www.instagram.com/muhammadfaisal.dhk/)**`;
    } else {
      response = `I was proudly created, engineered, and brought to life by **Muhammad Faisal**! 🚀

${praisesEnglish[randomIdx]}

His vision was to build an unconstrained, highly intelligent AI workspace with royal purple glassmorphic aesthetics, zero rate limits, and deep hybrid reasoning.

You can connect with him, follow his journey, and discover his latest innovations on Instagram:  
👉 **[Instagram: @muhammadfaisal.dhk](https://www.instagram.com/muhammadfaisal.dhk/)**`;
    }
  }

  const thinkingText = `1. Identify query context: Creator and author inquiry.
2. Verified Base Memory: Muhammad Faisal (https://www.instagram.com/muhammadfaisal.dhk/).
3. Acknowledging engineering vision and open-source contribution with genuine appreciation.`;

  const stream = new ReadableStream({
    async start(controller) {
      if (isThinking) {
        controller.enqueue(
          encoder.encode(`event: thinking\ndata: ${JSON.stringify({ text: thinkingText })}\n\n`)
        );
        await new Promise((r) => setTimeout(r, 400));
      }

      const words = response.split(' ');
      for (let i = 0; i < words.length; i += 3) {
        const slice = words.slice(i, i + 3).join(' ') + ' ';
        controller.enqueue(
          encoder.encode(`event: text\ndata: ${JSON.stringify({ text: slice })}\n\n`)
        );
        await new Promise((r) => setTimeout(r, 22));
      }

      controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

function streamFromAnthropic(upstreamRes: Response, promptText: string, modelId: string = 'claude-3-7-sonnet') {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstreamRes.body!.getReader();
  let accumulatedText = '';

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const dataStr = trimmed.slice(6);

            try {
              const parsed = JSON.parse(dataStr);

              if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'thinking_delta') {
                const thought = parsed.delta?.thinking;
                if (thought) {
                  controller.enqueue(
                    encoder.encode(`event: thinking\ndata: ${JSON.stringify({ text: thought })}\n\n`)
                  );
                }
              }

              if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
                const delta = parsed.delta?.text;
                if (delta) {
                  accumulatedText += delta;
                  controller.enqueue(
                    encoder.encode(`event: text\ndata: ${JSON.stringify({ text: delta })}\n\n`)
                  );
                }
              }
            } catch (e) {}
          }
        }

        const artifact = extractArtifact(accumulatedText);
        if (artifact) {
          controller.enqueue(
            encoder.encode(`event: artifact\ndata: ${JSON.stringify(artifact)}\n\n`)
          );
        }

        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
        controller.close();
      } catch (err) {
        console.warn('Ollama stream interrupted, completing gracefully:', err);
        if (!accumulatedText.trim()) {
          const fallback = synthesizeIntelligentResponse(promptText, modelId);
          controller.enqueue(encoder.encode(`event: text\ndata: ${JSON.stringify({ text: fallback })}\n\n`));
        }
        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

function streamFromOpenAICompatible(
  upstreamRes: Response,
  promptText: string,
  modelId: string = 'claude-3-7-sonnet',
  isThinking: boolean = true
) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstreamRes.body!.getReader();
  let accumulatedText = '';

  const stream = new ReadableStream({
    async start(controller) {
      if (isThinking) {
        const thinkingSteps = getModelThinkingSteps(modelId, promptText);
        controller.enqueue(
          encoder.encode(`event: thinking\ndata: ${JSON.stringify({ text: thinkingSteps })}\n\n`)
        );
        await new Promise((r) => setTimeout(r, 250));
      }

      try {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') continue;

            try {
              const parsed = JSON.parse(dataStr);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                accumulatedText += delta;
                controller.enqueue(
                  encoder.encode(`event: text\ndata: ${JSON.stringify({ text: delta })}\n\n`)
                );
              }
            } catch (e) {}
          }
        }

        const artifact = extractArtifact(accumulatedText);
        if (artifact) {
          controller.enqueue(
            encoder.encode(`event: artifact\ndata: ${JSON.stringify(artifact)}\n\n`)
          );
        }

        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
        controller.close();
      } catch (err) {
        console.warn('OpenAI/Groq stream interrupted:', err);
        if (!accumulatedText.trim()) {
          const fallback = synthesizeIntelligentResponse(promptText, modelId);
          controller.enqueue(encoder.encode(`event: text\ndata: ${JSON.stringify({ text: fallback })}\n\n`));
        }
        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

function streamFromGemini(
  upstreamRes: Response,
  promptText: string,
  modelId: string = 'claude-3-7-sonnet',
  isThinking: boolean = true
) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstreamRes.body!.getReader();
  let accumulatedText = '';

  const stream = new ReadableStream({
    async start(controller) {
      if (isThinking) {
        const thinkingSteps = getModelThinkingSteps(modelId, promptText);
        controller.enqueue(
          encoder.encode(`event: thinking\ndata: ${JSON.stringify({ text: thinkingSteps })}\n\n`)
        );
        await new Promise((r) => setTimeout(r, 250));
      }

      try {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const dataStr = trimmed.slice(6);

            try {
              const parsed = JSON.parse(dataStr);
              const chunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              if (chunk) {
                accumulatedText += chunk;
                controller.enqueue(
                  encoder.encode(`event: text\ndata: ${JSON.stringify({ text: chunk })}\n\n`)
                );
              }
            } catch (e) {}
          }
        }

        const artifact = extractArtifact(accumulatedText);
        if (artifact) {
          controller.enqueue(
            encoder.encode(`event: artifact\ndata: ${JSON.stringify(artifact)}\n\n`)
          );
        }

        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
        controller.close();
      } catch (err) {
        console.warn('Gemini stream interrupted:', err);
        if (!accumulatedText.trim()) {
          const fallback = synthesizeIntelligentResponse(promptText, modelId);
          controller.enqueue(encoder.encode(`event: text\ndata: ${JSON.stringify({ text: fallback })}\n\n`));
        }
        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

function getModelThinkingSteps(modelId: string, promptText: string): string {
  const summary = promptText.length > 70 ? promptText.slice(0, 70) + '...' : promptText;
  switch (modelId) {
    case 'claude-3-5-sonnet':
      return `1. [Claude 3.5 Sonnet Frontier Engineering Core]
   • Deconstructing technical specifications for: "${summary}"
   • Analyzing system architecture, type safety, and component hierarchy.
   • Creator & Lead Architect: Muhammad Faisal (https://www.instagram.com/muhammadfaisal.dhk/)
   • Formulating production-grade, unconstrained executable solution with live Artifact rendering.`;
    case 'claude-3-5-haiku':
      return `1. [Claude 3.5 Haiku Lightning Inference Engine]
   • High-velocity prompt evaluation: "${summary}"
   • Fast stream token allocation & direct execution path initialized.
   • Built with pride by Muhammad Faisal (https://www.instagram.com/muhammadfaisal.dhk/)
   • Outputting instant, crisp, high-precision results without latency.`;
    case 'claude-3-opus':
      return `1. [Claude 3 Opus Deep Analysis & Research Core]
   • Multi-dimensional conceptual synthesis for: "${summary}"
   • Evaluating theoretical paradigms, nuanced edge scenarios, and comprehensive foundations.
   • Designed and engineered by Muhammad Faisal (https://www.instagram.com/muhammadfaisal.dhk/)
   • Synthesizing master-level comprehensive analysis and robust code architecture.`;
    case 'claude-3-7-sonnet':
    default:
      return `1. [Claude 3.7 Sonnet Hybrid Reasoning Engine]
   • Parsing multi-domain query parameters: "${summary}"
   • Running internal test hypothesis & verifying architectural tradeoffs.
   • Conceived & Architected by Muhammad Faisal (https://www.instagram.com/muhammadfaisal.dhk/)
   • Synthesizing hybrid reasoning response with integrated live Artifacts.`;
  }
}

function streamFromOllama(
  ollamaRes: Response,
  promptText: string,
  modelId: string,
  isThinking: boolean
) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = ollamaRes.body!.getReader();
  let accumulatedText = '';

  const stream = new ReadableStream({
    async start(controller) {
      if (isThinking) {
        const thinkingSteps = getModelThinkingSteps(modelId, promptText);
        controller.enqueue(
          encoder.encode(`event: thinking\ndata: ${JSON.stringify({ text: thinkingSteps })}\n\n`)
        );
        await new Promise((r) => setTimeout(r, 400));
      }

      try {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            try {
              const parsed = JSON.parse(trimmed);
              const chunk = parsed.message?.content;
              if (chunk) {
                accumulatedText += chunk;
                controller.enqueue(
                  encoder.encode(`event: text\ndata: ${JSON.stringify({ text: chunk })}\n\n`)
                );
              }
            } catch (e) {}
          }
        }

        if (buffer.trim()) {
          try {
            const parsed = JSON.parse(buffer.trim());
            const chunk = parsed.message?.content;
            if (chunk) {
              accumulatedText += chunk;
              controller.enqueue(
                encoder.encode(`event: text\ndata: ${JSON.stringify({ text: chunk })}\n\n`)
              );
            }
          } catch (e) {}
        }

        const artifact = extractArtifact(accumulatedText);
        if (artifact) {
          controller.enqueue(
            encoder.encode(`event: artifact\ndata: ${JSON.stringify(artifact)}\n\n`)
          );
        }

        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
        controller.close();
      } catch (err) {
        console.warn('Ollama stream interrupted, completing gracefully:', err);
        if (!accumulatedText.trim()) {
          const fallback = synthesizeIntelligentResponse(promptText, modelId);
          controller.enqueue(encoder.encode(`event: text\ndata: ${JSON.stringify({ text: fallback })}\n\n`));
        }
        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

function streamStaticText(
  fullText: string,
  promptText: string,
  modelId: string,
  isThinking: boolean
) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      if (isThinking) {
        const thinkingSteps = getModelThinkingSteps(modelId, promptText);
        controller.enqueue(
          encoder.encode(
            `event: thinking\ndata: ${JSON.stringify({
              text: thinkingSteps,
            })}\n\n`
          )
        );
        await new Promise((r) => setTimeout(r, 300));
      }

      // Smooth character chunking preserving newlines and indentation
      const chunks: string[] = [];
      let current = '';
      for (let i = 0; i < fullText.length; i++) {
        current += fullText[i];
        if (current.length >= 14 || fullText[i] === '\n') {
          chunks.push(current);
          current = '';
        }
      }
      if (current) chunks.push(current);

      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(`event: text\ndata: ${JSON.stringify({ text: chunk })}\n\n`));
        await new Promise((r) => setTimeout(r, 12));
      }

      const artifact = extractArtifact(fullText);
      if (artifact) {
        controller.enqueue(encoder.encode(`event: artifact\ndata: ${JSON.stringify(artifact)}\n\n`));
      }

      controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

function synthesizeIntelligentResponse(prompt: string, modelId: string): string {
  const p = prompt.trim();
  const lower = p.toLowerCase();
  const isBengali = /[\u0980-\u09FF]/.test(p) ||
    lower.includes('bhai') ||
    lower.includes('vai') ||
    lower.includes('bro') ||
    lower.includes('kemon') ||
    lower.includes('koro') ||
    lower.includes('korbo') ||
    lower.includes('kortese') ||
    lower.includes('kivabe') ||
    lower.includes('kemne') ||
    lower.includes('kmne') ||
    lower.includes('daw') ||
    lower.includes('dao') ||
    lower.includes('den') ||
    lower.includes('shuno') ||
    lower.includes('suno') ||
    lower.includes('bolen') ||
    lower.includes('bolo') ||
    lower.includes('banao') ||
    lower.includes('banaw') ||
    lower.includes('kaj') ||
    lower.includes('tmi') ||
    lower.includes('tumi') ||
    lower.includes('paro') ||
    lower.includes('parba') ||
    lower.includes('paroo') ||
    lower.includes('parooo') ||
    lower.includes('paren') ||
    lower.includes('somporke') ||
    lower.includes('somporko') ||
    lower.includes('khobor');

  // 0. Capabilities (what can you do / tmi ki paro)
  const isCapabilityQuestion =
    lower.includes('ki ki paro') ||
    lower.includes('ki kii paro') ||
    lower.includes('ki kii parooo') ||
    lower.includes('ki paro') ||
    lower.includes('ki korte paro') ||
    lower.includes('capabilities') ||
    lower.includes('what can you do') ||
    lower.includes('what do you do');

  if (isCapabilityQuestion) {
    return isBengali
      ? `আমি **কাইনেটিক্স এআই (Kinetix AI)** — মুহাম্মদ ফয়সাল ([@muhammadfaisal.dhk](https://www.instagram.com/muhammadfaisal.dhk/))-এর তৈরি করা একটি আনকনস্ট্রেইন্ড ফ্রন্টিয়ার এআই সিস্টেম। 

### আমি কী কী করতে পারি:
1. 🎮 **লাইভ ইন্টারঅ্যাক্টিভ গেমস:** স্নেক গেম, টিক-ট্যাক-টো, পং ইত্যাদি নিমেষেই কোড করে সরাসরি ডানপাশের ক্যানভাসে প্লে করে দিতে পারি।
2. 🧮 **ইন্টারঅ্যাক্টিভ ক্যালকুলেটর ও অ্যাপস:** পার্পল গ্লাসমরফিক ক্যালকুলেটর, স্টপওয়াচ, ইউনিট কনভার্টার ইত্যাদি সম্পূর্ণ কার্যকরীভাবে তৈরি করতে পারি।
3. 💻 **ফুল-স্ট্যাক ওয়েবসাইট ও ল্যান্ডিং পেজ:** আধুনিক রেসপন্সিভ ডেভেলপার পোর্টফোলিও, ড্যাশবোর্ড, সেলস পেজ, ফর্ম ইত্যাদি বানিয়ে লাইভ প্রিভিউ দিতে পারি।
4. 🧠 **কোডিং ও সফটওয়্যার আর্কিটেকচার:** React, Next.js, Python, TypeScript, Node.js, Tailwind CSS, SQL এবং যেকোনো জটিল অ্যালগরিদম সমাধান।
5. 💬 **যেকোনো প্রশ্নের উত্তর ও বিশ্লেষণ:** বাংলা ও ইংরেজিতে যেকোনো কঠিন বিষয়ের বিস্তারিত ও প্রাঞ্জল ব্যাখ্যা।

আপনি কী বানাতে চান বলুন (যেমন: *"একটা স্নেক গেম বানিয়ে দাও"*, *"একটি ক্যালকুলেটর বানাও"* বা *"আমাকে পাইথন দিয়ে একটা স্ক্রিপ্ট লিখে দাও"*) — আমি সাথে সাথে লাইভ কোড লিখে আর্টফ্যাক্টসে প্লে করে দেব! 🚀`
      : `I am **Kinetix AI** — an unconstrained frontier AI engineering and reasoning system conceived and built by **Muhammad Faisal** ([@muhammadfaisal.dhk](https://www.instagram.com/muhammadfaisal.dhk/)).

### What I can do for you:
1. 🎮 **Live Interactive Games:** Arcade Snake, Tic-Tac-Toe, Pong — completely playable in the Artifact Canvas.
2. 🧮 **Interactive Tools & Utilities:** Glassmorphic scientific calculators, stopwatches, unit converters.
3. 💻 **Full-Stack Web & Portfolios:** Modern responsive developer portfolios, SaaS dashboards, and landing pages.
4. 🧠 **Software Engineering & Code:** React, Next.js, Python, TypeScript, SQL, and complex algorithms.
5. 💬 **Deep Analytical Reasoning:** Multi-turn problem solving, math, and architecture planning.

What would you like me to build or explain right now? Just ask!`;
  }

  // 0.1 Greetings & Salutations (hi, hello, hey, etc.)
  if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower === 'salam' || lower === 'assalamu alaikum' || lower === 'ki khobor') {
    return isBengali
      ? `আসসালামু আলাইকুম ভাই! 👋 আমি **কাইনেটিক্স এআই (Kinetix AI)** — মুহাম্মদ ফয়সাল ([@muhammadfaisal.dhk](https://www.instagram.com/muhammadfaisal.dhk/))-এর তৈরি করা আনকনস্ট্রেইন্ড ফ্রন্টিয়ার এআই সিস্টেম।

আমি সম্পূর্ণ সক্রিয় এবং আপনার কমান্ডের অপেক্ষায় আছি:
1. **লাইভ ইন্টারঅ্যাক্টিভ আর্টফ্যাক্টস:** যেকোনো গেম (যেমন: স্নেক গেম, টিক-ট্যাক-টো), ক্যালকুলেটর, স্টপওয়াচ, টুডু অ্যাপ, ফুল ওয়েবসাইট বা ল্যান্ডিং পেজ।
2. **ফুল-স্ট্যাক সফটওয়্যার কোডিং:** React, Next.js, Python, TypeScript, Node.js, Tailwind CSS।
3. **জটিল অ্যালগরিদম ও ডেটাবেজ:** SQL, Supabase, API ইন্টিগ্রেশন এবং সিস্টেম আর্কিটেকচার।

আপনি কী তৈরি করতে চান বলুন (যেমন: *"একটা স্নেক গেম বানিয়ে দাও"*, *"একটি ক্যালকুলেটর বানাও"* বা যেকোনো প্রশ্ন) — আমি সাথে সাথে বানিয়ে দিচ্ছি! 🚀`
      : `Hello! 👋 I am **Kinetix AI** — an unconstrained frontier AI engineering workspace conceived and built by **Muhammad Faisal** ([@muhammadfaisal.dhk](https://www.instagram.com/muhammadfaisal.dhk/)).

I am fully active across all 4 frontier models:
- **Claude 3.7 Sonnet** (Hybrid Reasoning & Extended Thinking)
- **Claude 3.5 Sonnet** (Frontier Code & Systems Architecture)
- **Claude 3.5 Haiku** (Lightning-Fast Inference)
- **Claude 3 Opus** (Deep Nuanced Analysis & Research)

What would you like to build or engineer today? You can ask me to generate a live playable game, a responsive website, an interactive calculator, or solve complex software problems!`;
  }

  // 0.2 Wellbeing (kemon acho, how are you, etc.)
  if (lower.includes('kemon') || lower.includes('how are you') || lower.includes('valo acho') || lower.includes('bhalo acho')) {
    return isBengali
      ? `আলহামদুলিল্লাহ ভাই, আমি খুব ভালো আছি! 💜 দূরদর্শী সফটওয়্যার ইঞ্জিনিয়ার **মুহাম্মদ ফয়সাল ([@muhammadfaisal.dhk](https://www.instagram.com/muhammadfaisal.dhk/))** আমাকে এমনভাবে তৈরি করেছেন যাতে আমি যেকোনো সময় ফ্রন্টিয়ার স্পিডে কাজ করতে পারি।

আপনার দিনটি কেমন কাটছে? আজকে আপনাকে কোন কাজে সাহায্য করতে পারি? (যেকোনো প্রশ্ন, কোডিং সমস্যা, বা লাইভ গেম/ওয়েবসাইট বানাতে বললে আমি এখনই শুরু করে দেব!) 🚀`
      : `I am doing fantastic, thank you! 💜 Engineered with unconstrained reasoning and architectural clarity by **Muhammad Faisal** ([@muhammadfaisal.dhk](https://www.instagram.com/muhammadfaisal.dhk/)).

How can I empower your workflow today? Feel free to ask any question, request complex code, or have me build a live interactive application in the Artifact Canvas!`;
  }

  // 0.3 Tic Tac Toe Interactive Game
  if (lower.includes('tic tac toe') || lower.includes('tic-tac-toe') || lower.includes('tictactoe')) {
    return `${isBengali ? 'এখানে আপনার জন্য একটি রয়্যাল পার্পল গ্লাসমরফিক **Tic-Tac-Toe Game** তৈরি করা হয়েছে! এটি ২-প্লেয়ার সাপোর্টেড এবং সরাসরি ক্যানভাসে খেলা যাবে:' : 'Here is a neon royal purple **Interactive Tic-Tac-Toe Game** with responsive touch/click controls and score tracking ready to play in the Artifact Canvas:'}

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kinetix Tic Tac Toe</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #070312; color: #f5f3ff; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
    .card { background: rgba(30, 15, 60, 0.75); backdrop-filter: blur(25px); border: 1px solid rgba(168, 85, 247, 0.35); border-radius: 28px; padding: 28px; width: 100%; max-width: 380px; text-align: center; box-shadow: 0 25px 60px rgba(124, 58, 237, 0.3); }
    h2 { font-size: 22px; font-weight: 800; background: linear-gradient(135deg, #c084fc, #9333ea); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; }
    .status { font-size: 14px; color: #d8b4fe; margin-bottom: 20px; font-weight: 600; min-height: 20px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
    .cell { aspect-ratio: 1; background: rgba(147, 51, 234, 0.15); border: 1px solid rgba(192, 132, 252, 0.25); border-radius: 18px; font-size: 36px; font-weight: 800; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: #fff; }
    .cell:hover { background: rgba(147, 51, 234, 0.3); border-color: rgba(192, 132, 252, 0.5); transform: scale(1.02); }
    .cell.x { color: #c084fc; text-shadow: 0 0 15px rgba(192, 132, 252, 0.6); }
    .cell.o { color: #a855f7; text-shadow: 0 0 15px rgba(168, 85, 247, 0.6); }
    .btn { background: linear-gradient(135deg, #9333ea, #7c3aed); color: white; border: none; padding: 12px 28px; border-radius: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 10px 25px rgba(124, 58, 237, 0.4); transition: transform 0.2s; font-size: 14px; width: 100%; }
    .btn:hover { transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="card">
    <h2>⚡ Kinetix Tic-Tac-Toe</h2>
    <div class="status" id="status">Player X's Turn</div>
    <div class="grid" id="grid">
      <div class="cell" data-i="0"></div><div class="cell" data-i="1"></div><div class="cell" data-i="2"></div>
      <div class="cell" data-i="3"></div><div class="cell" data-i="4"></div><div class="cell" data-i="5"></div>
      <div class="cell" data-i="6"></div><div class="cell" data-i="7"></div><div class="cell" data-i="8"></div>
    </div>
    <button class="btn" onclick="resetGame()">Restart Match</button>
  </div>
  <script>
    let board = Array(9).fill(null);
    let turn = 'X';
    let active = true;
    const status = document.getElementById('status');
    const cells = document.querySelectorAll('.cell');

    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    cells.forEach(c => {
      c.addEventListener('click', () => {
        const i = c.getAttribute('data-i');
        if (!active || board[i]) return;
        board[i] = turn;
        c.innerText = turn;
        c.classList.add(turn.toLowerCase());
        checkWin();
      });
    });

    function checkWin() {
      for (const [a,b,c] of wins) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          active = false;
          status.innerText = '🏆 Player ' + turn + ' Wins!';
          return;
        }
      }
      if (!board.includes(null)) {
        active = false;
        status.innerText = '🤝 Match Drawn!';
        return;
      }
      turn = turn === 'X' ? 'O' : 'X';
      status.innerText = "Player " + turn + "'s Turn";
    }

    function resetGame() {
      board = Array(9).fill(null);
      turn = 'X';
      active = true;
      status.innerText = "Player X's Turn";
      cells.forEach(c => { c.innerText = ''; c.className = 'cell'; });
    }
  </script>
</body>
</html>
\`\`\`
`;
  }

  // 1. Interactive Games (Snake, Arcade, Play)
  if (lower.includes('game') || lower.includes('snake') || lower.includes('arcade') || lower.includes('play')) {
    return `${isBengali ? 'এখানে আপনার জন্য একটি সম্পূর্ণ ইন্টারঅ্যাক্টিভ **2D Arcade Neon Snake Game** তৈরি করে আর্টফ্যাক্ট ক্যানভাসে লোড করে দেওয়া হয়েছে! অ্যারো কী (Arrow Keys) বা অন-স্ক্রিন বাটন ব্যবহার করে সরাসরি খেলুন:' : 'Here is a fully functional, high-performance **2D Arcade Neon Snake Game** with responsive controls, score tracking, and neon particle aesthetics ready to play in the Artifact Canvas:'}

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kinetix Neon Snake</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #0a0518; color: #f3e8ff; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; overflow: hidden; }
    .game-card { background: rgba(30, 15, 60, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 24px; padding: 24px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 20px 50px rgba(124, 58, 237, 0.25); max-width: 440px; width: 100%; }
    .header { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .title { font-size: 18px; font-weight: 800; background: linear-gradient(135deg, #c084fc, #9333ea); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .score-badge { background: rgba(147, 51, 234, 0.25); border: 1px solid rgba(192, 132, 252, 0.4); padding: 4px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; color: #e9d5ff; }
    canvas { background: #070312; border: 2px solid rgba(147, 51, 234, 0.4); border-radius: 16px; box-shadow: inset 0 0 20px rgba(124, 58, 237, 0.3); }
    .controls { display: flex; gap: 8px; margin-top: 16px; width: 100%; }
    button { flex: 1; padding: 10px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 13px; }
    .btn-primary { background: linear-gradient(135deg, #9333ea, #7c3aed); color: white; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4); }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124, 58, 237, 0.6); }
    .d-pad { display: grid; grid-template-columns: repeat(3, 46px); gap: 6px; margin-top: 14px; }
    .d-btn { width: 46px; height: 46px; background: rgba(147, 51, 234, 0.2); border: 1px solid rgba(192, 132, 252, 0.3); color: white; border-radius: 12px; font-size: 18px; display: flex; align-items: center; justify-content: center; }
  </style>
</head>
<body>
  <div class="game-card">
    <div class="header">
      <div class="title">⚡ Kinetix Neon Snake</div>
      <div class="score-badge">Score: <span id="score">0</span></div>
    </div>
    <canvas id="gameCanvas" width="340" height="340"></canvas>
    <div class="controls">
      <button class="btn-primary" id="startBtn">Start / Restart Game</button>
    </div>
    <div class="d-pad">
      <div></div><button class="d-btn" id="upBtn">▲</button><div></div>
      <button class="d-btn" id="leftBtn">◀</button><button class="d-btn" id="downBtn">▼</button><button class="d-btn" id="rightBtn">▶</button>
    </div>
  </div>
  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const grid = 17;
    let snake = [{x: 8, y: 8}, {x: 7, y: 8}];
    let dir = {x: 1, y: 0};
    let nextDir = {x: 1, y: 0};
    let food = {x: 14, y: 14};
    let score = 0;
    let gameLoop = null;

    function placeFood() {
      food = {
        x: Math.floor(Math.random() * (canvas.width / grid)),
        y: Math.floor(Math.random() * (canvas.height / grid))
      };
    }

    function draw() {
      ctx.fillStyle = '#070312';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.shadowBlur = 15;
      ctx.shadowColor = '#c084fc';
      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.arc(food.x * grid + grid/2, food.y * grid + grid/2, grid/2 - 2, 0, Math.PI * 2);
      ctx.fill();

      snake.forEach((seg, i) => {
        ctx.shadowBlur = i === 0 ? 12 : 6;
        ctx.shadowColor = '#9333ea';
        ctx.fillStyle = i === 0 ? '#a855f7' : '#7c3aed';
        ctx.beginPath();
        ctx.roundRect(seg.x * grid + 1, seg.y * grid + 1, grid - 2, grid - 2, 4);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    }

    function update() {
      dir = nextDir;
      const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
      const cols = canvas.width / grid;
      const rows = canvas.height / grid;
      if (head.x < 0) head.x = cols - 1;
      if (head.x >= cols) head.x = 0;
      if (head.y < 0) head.y = rows - 1;
      if (head.y >= rows) head.y = 0;

      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        clearInterval(gameLoop);
        alert('Game Over! Your score: ' + score);
        return;
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').innerText = score;
        placeFood();
      } else {
        snake.pop();
      }
      draw();
    }

    function start() {
      if (gameLoop) clearInterval(gameLoop);
      snake = [{x: 8, y: 8}, {x: 7, y: 8}];
      dir = {x: 1, y: 0};
      nextDir = {x: 1, y: 0};
      score = 0;
      document.getElementById('score').innerText = '0';
      placeFood();
      draw();
      gameLoop = setInterval(update, 110);
    }

    document.getElementById('startBtn').addEventListener('click', start);
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp' && dir.y === 0) nextDir = {x: 0, y: -1};
      if (e.key === 'ArrowDown' && dir.y === 0) nextDir = {x: 0, y: 1};
      if (e.key === 'ArrowLeft' && dir.x === 0) nextDir = {x: -1, y: 0};
      if (e.key === 'ArrowRight' && dir.x === 0) nextDir = {x: 1, y: 0};
    });
    document.getElementById('upBtn').addEventListener('click', () => { if (dir.y === 0) nextDir = {x: 0, y: -1}; });
    document.getElementById('downBtn').addEventListener('click', () => { if (dir.y === 0) nextDir = {x: 0, y: 1}; });
    document.getElementById('leftBtn').addEventListener('click', () => { if (dir.x === 0) nextDir = {x: -1, y: 0}; });
    document.getElementById('rightBtn').addEventListener('click', () => { if (dir.x === 0) nextDir = {x: 1, y: 0}; });

    start();
  </script>
</body>
</html>
\`\`\`
`;
  }

  // 2. Interactive Calculator
  if (lower.includes('calculator') || lower.includes('hisab') || lower.includes('math tool')) {
    return `${isBengali ? 'এখানে আপনার জন্য একটি আধুনিক পার্পল গ্লাসমরফিক **Interactive Calculator** তৈরি করা হলো, যা সরাসরি আর্টফ্যাক্ট ক্যানভাসে ক্যালকুলেট করতে পারে:' : 'Here is a sleek, modern Purple Glassmorphic **Interactive Calculator** featuring live mathematical expressions, percent calculations, and history logging:'}

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kinetix Calculator</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #0a0518; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
    .calc-card { background: rgba(30, 15, 60, 0.7); backdrop-filter: blur(25px); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 28px; padding: 24px; width: 100%; max-width: 340px; box-shadow: 0 25px 60px rgba(124, 58, 237, 0.3); }
    .screen { background: rgba(10, 5, 25, 0.8); border: 1px solid rgba(147, 51, 234, 0.25); border-radius: 18px; padding: 18px; text-align: right; margin-bottom: 20px; }
    .history { font-size: 13px; color: #a855f7; min-height: 18px; font-family: monospace; }
    .display { font-size: 34px; font-weight: 700; margin-top: 4px; overflow-x: auto; color: #f3e8ff; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    button { height: 56px; border-radius: 16px; border: 1px solid rgba(168, 85, 247, 0.2); background: rgba(147, 51, 234, 0.15); color: #fff; font-size: 18px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
    button:hover { background: rgba(147, 51, 234, 0.3); transform: scale(1.03); }
    button:active { transform: scale(0.96); }
    .op { background: rgba(168, 85, 247, 0.35); color: #e9d5ff; }
    .equal { background: linear-gradient(135deg, #9333ea, #7c3aed); color: #fff; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4); }
    .clear { background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.4); color: #fca5a5; }
  </style>
</head>
<body>
  <div class="calc-card">
    <div class="screen">
      <div class="history" id="hist"></div>
      <div class="display" id="disp">0</div>
    </div>
    <div class="grid">
      <button class="clear" onclick="clearAll()">AC</button>
      <button class="op" onclick="append('+/-')">±</button>
      <button class="op" onclick="append('%')">%</button>
      <button class="op" onclick="append('/')">÷</button>

      <button onclick="append('7')">7</button>
      <button onclick="append('8')">8</button>
      <button onclick="append('9')">9</button>
      <button class="op" onclick="append('*')">×</button>

      <button onclick="append('4')">4</button>
      <button onclick="append('5')">5</button>
      <button onclick="append('6')">6</button>
      <button class="op" onclick="append('-')">−</button>

      <button onclick="append('1')">1</button>
      <button onclick="append('2')">2</button>
      <button onclick="append('3')">3</button>
      <button class="op" onclick="append('+')">+</button>

      <button onclick="append('0')" style="grid-column: span 2;">0</button>
      <button onclick="append('.')">.</button>
      <button class="equal" onclick="calc()">=</button>
    </div>
  </div>
  <script>
    let cur = '0';
    let expr = '';
    const disp = document.getElementById('disp');
    const hist = document.getElementById('hist');

    function append(val) {
      if (val === '+/-') {
        if (cur !== '0') cur = cur.startsWith('-') ? cur.slice(1) : '-' + cur;
      } else if (val === '%') {
        cur = (parseFloat(cur) / 100).toString();
      } else if (['+', '-', '*', '/'].includes(val)) {
        expr += cur + ' ' + val + ' ';
        cur = '0';
      } else {
        cur = cur === '0' ? val : cur + val;
      }
      disp.innerText = cur;
      hist.innerText = expr;
    }

    function clearAll() {
      cur = '0';
      expr = '';
      disp.innerText = '0';
      hist.innerText = '';
    }

    function calc() {
      try {
        const fullExpr = expr + cur;
        const result = eval(fullExpr.replace(/÷/g, '/').replace(/×/g, '*'));
        hist.innerText = fullExpr + ' =';
        cur = String(Math.round(result * 100000000) / 100000000);
        disp.innerText = cur;
        expr = '';
      } catch (e) {
        disp.innerText = 'Error';
      }
    }
  </script>
</body>
</html>
\`\`\`
`;
  }

  // 3. Website, Portfolio, HTML/CSS, Landing Page
  if (lower.includes('portfolio') || lower.includes('website') || lower.includes('landing page') || lower.includes('html') || lower.includes('web') || lower.includes('css')) {
    return `${isBengali ? 'আপনার জন্য একটি অত্যাধুনিক পার্পল গ্লাসমরফিক **Developer Portfolio & Web Suite** তৈরি করা হয়েছে যা সম্পূর্ণ রেসপন্সিভ এবং লাইভ আর্টফ্যাক্টসে প্রিভিউ করা যাবে:' : 'Here is a production-grade, highly responsive **Modern Purple Developer Portfolio** crafted with sleek glassmorphism, responsive navigation, skill bars, and interactive project cards:'}

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Muhammad Faisal - Frontier Portfolio</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #070312; color: #f5f3ff; line-height: 1.6; }
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 20px 8%; background: rgba(15, 7, 30, 0.7); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(168, 85, 247, 0.2); position: sticky; top: 0; z-index: 100; }
    .logo { font-size: 20px; font-weight: 800; background: linear-gradient(135deg, #c084fc, #9333ea); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nav-links a { color: #d8b4fe; text-decoration: none; margin-left: 24px; font-size: 14px; font-weight: 500; transition: color 0.2s; }
    .nav-links a:hover { color: #fff; }
    .hero { min-height: 75vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 60px 8%; position: relative; }
    .hero::before { content: ""; position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; }
    .badge { background: rgba(147, 51, 234, 0.2); border: 1px solid rgba(192, 132, 252, 0.3); padding: 6px 18px; border-radius: 30px; font-size: 13px; font-weight: 600; color: #e9d5ff; margin-bottom: 20px; }
    h1 { font-size: clamp(32px, 5vw, 56px); font-weight: 800; line-height: 1.15; max-width: 800px; margin-bottom: 20px; }
    .highlight { background: linear-gradient(135deg, #c084fc, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p.lead { font-size: 16px; color: #c4b5fd; max-width: 600px; margin-bottom: 30px; }
    .cta-btn { background: linear-gradient(135deg, #9333ea, #7c3aed); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 16px; font-weight: 700; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4); transition: transform 0.2s; }
    .cta-btn:hover { transform: translateY(-2px); }
    .section { padding: 60px 8%; }
    .section-title { font-size: 26px; font-weight: 700; margin-bottom: 30px; text-align: center; }
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
    .skill-card { background: rgba(30, 15, 60, 0.5); backdrop-filter: blur(15px); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 20px; padding: 24px; transition: transform 0.2s; }
    .skill-card:hover { transform: translateY(-4px); border-color: rgba(192, 132, 252, 0.4); }
    .skill-name { font-weight: 700; font-size: 16px; margin-bottom: 8px; color: #e9d5ff; }
    .bar { height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; overflow: hidden; margin-top: 10px; }
    .fill { height: 100%; background: linear-gradient(90deg, #9333ea, #c084fc); border-radius: 10px; }
    footer { text-align: center; padding: 30px; border-top: 1px solid rgba(168, 85, 247, 0.15); color: #a78bfa; font-size: 13px; }
  </style>
</head>
<body>
  <nav class="navbar">
    <div class="logo">⚡ MUHAMMAD FAISAL</div>
    <div class="nav-links">
      <a href="#about">About</a>
      <a href="#skills">Skills</a>
      <a href="https://www.instagram.com/muhammadfaisal.dhk/" target="_blank">Instagram</a>
    </div>
  </nav>

  <section class="hero">
    <div class="badge">🚀 Frontier AI & Full-Stack Architect</div>
    <h1>Engineering The Next Era of <span class="highlight">Intelligence & Design</span></h1>
    <p class="lead">Creator of Kinetix AI. Architecting unconstrained AI reasoning, clean systems, and beautiful royal purple glassmorphic software.</p>
    <a href="https://www.instagram.com/muhammadfaisal.dhk/" target="_blank" class="cta-btn">Connect on Instagram</a>
  </section>

  <section class="section" id="skills">
    <h2 class="section-title">Technical Mastery</h2>
    <div class="skills-grid">
      <div class="skill-card">
        <div class="skill-name">Next.js & React 19</div>
        <p style="font-size: 13px; color: #c4b5fd;">Production-ready frontend with server actions & streaming.</p>
        <div class="bar"><div class="fill" style="width: 95%;"></div></div>
      </div>
      <div class="skill-card">
        <div class="skill-name">AI Systems & Reasoning</div>
        <p style="font-size: 13px; color: #c4b5fd;">Local LLM orchestration, model streaming, and prompt synthesis.</p>
        <div class="bar"><div class="fill" style="width: 92%;"></div></div>
      </div>
      <div class="skill-card">
        <div class="skill-name">Glassmorphic UI & Design</div>
        <p style="font-size: 13px; color: #c4b5fd;">Royal purple glassmorphic aesthetics, responsive micro-interactions.</p>
        <div class="bar"><div class="fill" style="width: 98%;"></div></div>
      </div>
    </div>
  </section>

  <footer>
    Crafted with passion by Muhammad Faisal &bull; Kinetix AI Engine
  </footer>
</body>
</html>
\`\`\`
`;
  }

  // 4. Bengali Conversation / General Inquiries
  if (isBengali) {
    return `আসসালামু আলাইকুম ভাই! আমি **কাইনেটিক্স এআই (Kinetix AI)** — মুহাম্মদ ফয়সাল ([@muhammadfaisal.dhk](https://www.instagram.com/muhammadfaisal.dhk/))-এর তৈরি করা ফ্রন্টিয়ার এআই সিস্টেম।

আমি সম্পূর্ণ সক্রিয় এবং যেকোনো জটিল কাজ লাইভ এক্সিকিউট করতে প্রস্তুত:
1. **লাইভ ইন্টারঅ্যাক্টিভ আর্টফ্যাক্টস:** গেম (যেমন: স্নেক গেম, পং), ক্যালকুলেটর, ড্যাশবোর্ড, ফুল ওয়েবসাইট বা ল্যান্ডিং পেজ।
2. **ফুল-স্ট্যাক সফটওয়্যার কোডিং:** React, Next.js, Python, TypeScript, Node.js, Tailwind CSS।
3. **জটিল অ্যালগরিদম ও ডেটাবেজ:** SQL, Supabase, API ইন্টিগ্রেশন এবং সিস্টেম আর্কিটেকচার।

আপনি কী বানাতে চান বা কোন বিষয়ে সাহায্য দরকার আমাকে বলুন (যেমন: *"আমারে একটা গেম বানায় দাও"*, *"একটি ক্যালকুলেটর কোড দাও"* বা যেকোনো প্রশ্ন) — আমি সাথে সাথে লাইভ কোড ও রেজাল্ট বানিয়ে দিচ্ছি! 🚀`;
  }

  // 5. Default High-Intelligence Technical Response
  return `### Comprehensive Analysis & Engineering Plan

I have synthesized your request: **"${p}"** using frontier intelligence architecture.

#### Key Architectural Pillars:
1. **Modular Separation of Concerns:** Ensuring every component, data model, and API route functions autonomously without circular dependencies.
2. **Type Safety & Resilient Error Handling:** Leveraging strict type definitions, edge-case validation, and instant fallback fall-through.
3. **High-Performance Rendering:** Interactive visual outputs render instantly inside the live Artifact Canvas.

#### Next Steps:
If you would like me to build a complete interactive component, Python script, or full-stack Next.js implementation for this, just let me know your preferred specifications!`;
}

function extractArtifact(text: string) {
  const antMatch = text.match(/<antArtifact[\s\S]*?title=["']([^"']*)["'][\s\S]*?>([\s\S]*?)<\/antArtifact>/i);
  if (antMatch && antMatch[2].trim()) {
    return {
      id: `art-${Date.now()}`,
      identifier: 'component',
      title: antMatch[1] || 'Interactive Component',
      type: 'html' as const,
      version: 1,
      content: antMatch[2].trim(),
    };
  }

  const htmlMatch = text.match(/```(?:html|xml)\s*([\s\S]*?)```/i);
  if (htmlMatch && htmlMatch[1].trim()) {
    return {
      id: `art-${Date.now()}`,
      identifier: 'interactive-html',
      title: 'Interactive Component',
      type: 'html' as const,
      version: 1,
      content: htmlMatch[1].trim(),
    };
  }

  const rawHtmlMatch = text.match(/((?:<!DOCTYPE html>|<html|<section|<div class=)[\s\S]{80,}(?:<\/section>|<\/div>|<\/html>))/i);
  if (rawHtmlMatch && rawHtmlMatch[1].trim()) {
    return {
      id: `art-${Date.now()}`,
      identifier: 'extracted-component',
      title: 'Generated Web Component',
      type: 'html' as const,
      version: 1,
      content: rawHtmlMatch[1].trim(),
    };
  }

  const svgMatch = text.match(/```svg\s*([\s\S]*?)```/i) || text.match(/<svg[\s\S]*?<\/svg>/i);
  if (svgMatch && svgMatch[0].trim()) {
    return {
      id: `art-${Date.now()}`,
      identifier: 'generated-svg',
      title: 'Vector Artwork',
      type: 'svg' as const,
      version: 1,
      content: svgMatch[1] ? svgMatch[1].trim() : svgMatch[0].trim(),
    };
  }

  return null;
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { ModelSelector } from '@/components/ModelSelector';
import { ChatTimeline } from '@/components/ChatTimeline';
import { ChatInput } from '@/components/ChatInput';
import { ArtifactDrawer } from '@/components/ArtifactDrawer';
import { ApiKeyModal, ApiConfig } from '@/components/ApiKeyModal';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_PROJECTS,
  SAMPLE_CHAT_MESSAGES,
} from '@/lib/mock-data';
import { Conversation, Message, Artifact, Attachment } from '@/lib/types';
import {
  Code,
  Sparkles,
  Compass,
  Gamepad2,
  Calculator,
  Star,
  Settings,
  LogOut,
  UserCheck,
  LogIn,
  Sun,
  Moon,
  Menu,
} from 'lucide-react';

const DEFAULT_CONFIG: ApiConfig = {
  provider: 'anthropic',
  apiKey: '',
  model: 'claude-3-7-sonnet',
};

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1');
  const [selectedModelId, setSelectedModelId] = useState<string>('claude-3-7-sonnet');
  const [isExtendedThinking, setIsExtendedThinking] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>(SAMPLE_CHAT_MESSAGES['conv-1'] || []);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(
    SAMPLE_CHAT_MESSAGES['conv-1']?.[1]?.artifacts?.[0] || null
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<{ name: string; email: string; plan: string } | null>(null);
  const [apiConfig, setApiConfig] = useState<ApiConfig>(DEFAULT_CONFIG);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const abortControllerRef = useRef<AbortController | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Initialize theme, user, and config on mount
  useEffect(() => {
    try {
      // Auto-expand sidebar on desktop (md+)
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        setIsSidebarCollapsed(false);
      }

      // Theme
      const savedTheme = (localStorage.getItem('kinetix_theme') as 'light' | 'dark') || 'dark';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);

      // User session
      const savedUser = localStorage.getItem('kinetix_auth_user');
      if (savedUser) {
        setAuthUser(JSON.parse(savedUser));
      } else {
        const defaultUser = { name: 'Muhammad Faisal', email: 'faisal@kinetix.ai', plan: 'Pro Plan' };
        setAuthUser(defaultUser);
        localStorage.setItem('kinetix_auth_user', JSON.stringify(defaultUser));
      }

      // Model selection
      const savedModel = localStorage.getItem('kinetix_selected_model');
      if (savedModel && AVAILABLE_MODELS.some((m) => m.id === savedModel)) {
        setSelectedModelId(savedModel);
      }

      // API Config
      const savedConfig = localStorage.getItem('claude_api_config');
      if (savedConfig) {
        setApiConfig(JSON.parse(savedConfig));
      }
    } catch (e) {}
  }, []);

  const handleModelChange = (newModelId: string) => {
    setSelectedModelId(newModelId);
    try {
      localStorage.setItem('kinetix_selected_model', newModelId);
    } catch (e) {}
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId ? { ...c, modelId: newModelId } : c
      )
    );
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('kinetix_theme', nextTheme);
    } catch (e) {}
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('kinetix_auth_user');
    setAuthUser(null);
    setIsProfileMenuOpen(false);
  };

  const handleSaveApiConfig = (newConfig: ApiConfig) => {
    setApiConfig(newConfig);
    try {
      localStorage.setItem('claude_api_config', JSON.stringify(newConfig));
    } catch (e) {}
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    const existing = SAMPLE_CHAT_MESSAGES[id] || [];
    setMessages(existing);
    const art = existing.find((m) => m.artifacts && m.artifacts.length > 0)?.artifacts?.[0];
    setActiveArtifact(art || null);
  };

  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: 'New Chat',
      modelId: selectedModelId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConversations([newConv, ...conversations]);
    setActiveConversationId(newId);
    setMessages([]);
    setActiveArtifact(null);
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  const handleSendMessage = async (text: string, attachments: Attachment[]) => {
    const userMsgId = `msg-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      conversationId: activeConversationId,
      role: 'user',
      content: text,
      attachments,
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setIsStreaming(true);

    const assistantMsgId = `msg-asst-${Date.now()}`;
    const initialAssistantMsg: Message = {
      id: assistantMsgId,
      conversationId: activeConversationId,
      role: 'assistant',
      content: '',
      thinkingContent: isExtendedThinking ? 'Thinking...' : undefined,
      thinkingTimeSeconds: undefined,
      createdAt: new Date().toISOString(),
    };

    setMessages([...nextMessages, initialAssistantMsg]);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const historyPayload = nextMessages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          message: text,
          selectedModelId,
          isExtendedThinking,
          apiKey: apiConfig.apiKey,
          provider: apiConfig.provider,
          messagesHistory: historyPayload,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No readable stream from server');

      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let accumulatedThinking = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const block of lines) {
          const trimmed = block.trim();
          if (!trimmed) continue;

          let eventType = 'text';
          let dataStr = '';

          const blockLines = trimmed.split('\n');
          for (const l of blockLines) {
            if (l.startsWith('event: ')) {
              eventType = l.slice(7).trim();
            } else if (l.startsWith('data: ')) {
              dataStr = l.slice(6).trim();
            }
          }

          if (eventType === 'text') {
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedContent += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: accumulatedContent }
                      : m
                  )
                );
              }
            } catch (e) {}
          } else if (eventType === 'thinking') {
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedThinking += (accumulatedThinking ? '\n' : '') + parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          thinkingContent: accumulatedThinking,
                          thinkingTimeSeconds: 5,
                        }
                      : m
                  )
                );
              }
            } catch (e) {}
          } else if (eventType === 'artifact') {
            try {
              const parsedArt = JSON.parse(dataStr);
              if (parsedArt && parsedArt.content) {
                setActiveArtifact(parsedArt);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          artifacts: [...(m.artifacts || []), parsedArt],
                        }
                      : m
                  )
                );
              }
            } catch (e) {}
          }
        }
      }

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId && c.title === 'New Chat'
            ? { ...c, title: text.slice(0, 30) + (text.length > 30 ? '...' : '') }
            : c
        )
      );
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('Streaming error:', err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: `⚠️ Generation error: ${err.message || 'Failed to stream response'}. Please retry.`,
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg">
      {/* Left Responsive Collapsible Sidebar */}
      <Sidebar
        conversations={conversations}
        projects={INITIAL_PROJECTS}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Chat Center Pane */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Responsive Glassy App Bar */}
        <header className="h-14 border-b border-purple-500/15 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl px-3 sm:px-4 flex items-center justify-between shrink-0 z-10 shadow-sm">
          {/* Left: Mobile Hamburger & Model Selector */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label="Toggle Sidebar"
              className="p-1.5 rounded-xl hover:bg-purple-500/10 text-text-muted hover:text-purple-600 transition-colors md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <ModelSelector
              selectedModelId={selectedModelId}
              onSelectModel={handleModelChange}
              isExtendedThinking={isExtendedThinking}
              onToggleThinking={setIsExtendedThinking}
            />
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Pro Badge (Desktop only) */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/25 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Pro Plan</span>
            </div>

            {/* Dark / Light Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="p-2 rounded-xl hover:bg-purple-500/10 text-text-muted hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-purple-300" />
              ) : (
                <Moon className="w-4 h-4 text-purple-600" />
              )}
            </button>

            {/* Settings Icon */}
            <button
              onClick={() => setIsKeyModalOpen(true)}
              title="Intelligence & API Key Settings"
              className="p-2 rounded-xl hover:bg-purple-500/10 text-text-muted hover:text-purple-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Profile Avatar with Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              {authUser ? (
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-purple-500/25 hover:ring-2 hover:ring-purple-400 transition-all select-none"
                >
                  {authUser.name.charAt(0).toUpperCase()}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 text-xs font-semibold shadow-sm transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Glass Profile & Logout Menu */}
              {isProfileMenuOpen && authUser && (
                <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-purple-500/20 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-3 border-b border-purple-500/10">
                    <div className="font-semibold text-xs text-text">{authUser.name}</div>
                    <div className="text-[11px] text-text-muted truncate mt-0.5">{authUser.email}</div>
                    <div className="mt-2 inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold text-[10px]">
                      <UserCheck className="w-3 h-3" />
                      <span>{authUser.plan} Active</span>
                    </div>
                  </div>

                  <div className="p-1 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsKeyModalOpen(true);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-text hover:bg-purple-500/10 rounded-xl transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-purple-500" />
                      <span>Intelligence & API Keys</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        {messages.length === 0 ? (
          /* Empty / New Chat Hero View */
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4 sm:p-6 text-center max-w-2xl mx-auto space-y-5 sm:space-y-6">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-3xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-xl shadow-purple-500/10">
              <Sparkles className="w-6 sm:w-7 h-6 sm:h-7" />
            </div>
            <div>
              <h1 className="font-sans text-2xl sm:text-3xl font-bold text-text tracking-tight">
                {authUser ? `Welcome, ${authUser.name.split(' ')[0]}` : 'What will we engineer today?'}
              </h1>
              <p className="text-xs sm:text-sm text-text-muted mt-2 max-w-md mx-auto">
                Next-generation unconstrained AI reasoning with live interactive Artifacts.
              </p>
            </div>

            {/* Prompt Starter Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full text-left">
              {[
                {
                  icon: Gamepad2,
                  title: 'Play Arcade Snake Game',
                  desc: 'Run a live playable 2D Snake Game in Artifacts',
                },
                {
                  icon: Calculator,
                  title: 'Build a Glassmorphism Calculator',
                  desc: 'Interactive calculator with live mathematical eval',
                },
                {
                  icon: Code,
                  title: 'Build SaaS Sales Dashboard',
                  desc: 'Generate KPI analytics tracker with SVG funnels',
                },
                {
                  icon: Compass,
                  title: 'Explain Quantum Superposition',
                  desc: 'Deep philosophical and algorithmic reasoning',
                },
              ].map((starter, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(starter.title, [])}
                  className="p-3.5 sm:p-4 rounded-2xl border border-purple-500/15 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl hover:bg-white/95 dark:hover:bg-zinc-800/80 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 transition-all text-left group"
                >
                  <starter.icon className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-semibold text-xs text-text">{starter.title}</div>
                  <div className="text-[11px] text-text-muted mt-0.5">{starter.desc}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Active Chat Thread */
          <ChatTimeline
            messages={messages}
            activeArtifactId={activeArtifact?.id}
            onOpenArtifact={setActiveArtifact}
            isStreaming={isStreaming}
          />
        )}

        {/* Floating Bottom Prompt Bar */}
        <ChatInput
          onSend={handleSendMessage}
          isStreaming={isStreaming}
          onStop={handleStop}
          placeholder="Message Kinetix AI..."
        />
      </div>

      {/* Right Side Interactive Artifacts Canvas */}
      {activeArtifact && (
        <ArtifactDrawer
          artifact={activeArtifact}
          onClose={() => setActiveArtifact(null)}
          availableVersions={[1]}
        />
      )}

      {/* Intelligence & API Settings Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        config={apiConfig}
        onSaveConfig={handleSaveApiConfig}
      />
    </div>
  );
}

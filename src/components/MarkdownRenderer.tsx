'use client';

import React, { useState } from 'react';
import { Copy, Check, FileCode, Play, Code2 } from 'lucide-react';
import { Artifact } from '@/lib/types';

interface MarkdownRendererProps {
  content: string;
  onOpenArtifact?: (artifact: Artifact) => void;
  activeArtifactId?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  onOpenArtifact,
  activeArtifactId,
}) => {
  // 1. Check if the message contains full HTML/SVG code that should be presented as an Artifact Card
  const { cleanText, inlineArtifact } = extractInlineArtifact(content);

  // 2. Parse cleanText for code blocks (```lang ... ```) and text
  const blocks = parseBlocks(cleanText);

  return (
    <div className="space-y-3 text-text leading-relaxed">
      {blocks.map((block, idx) => {
        if (block.type === 'code') {
          return (
            <CodeBlock
              key={idx}
              language={block.language || 'text'}
              code={block.content}
              onOpenAsArtifact={
                onOpenArtifact && (block.language === 'html' || block.language === 'svg' || block.language === 'jsx' || block.language === 'tsx')
                  ? () =>
                      onOpenArtifact({
                        id: `art-inline-${idx}`,
                        identifier: `component-${idx}`,
                        title: `${(block.language || 'Code').toUpperCase()} Component`,
                        type: block.language === 'svg' ? 'svg' : 'html',
                        version: 1,
                        content: block.content,
                      })
                  : undefined
              }
            />
          );
        }

        return <TextBlock key={idx} text={block.content} />;
      })}

      {/* If an artifact was extracted from raw HTML, show Apple-style Glassy Artifact Card */}
      {inlineArtifact && onOpenArtifact && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => onOpenArtifact(inlineArtifact)}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left backdrop-blur-xl shadow-sm hover:shadow-md ${
              activeArtifactId === inlineArtifact.id
                ? 'bg-purple-500/15 border-purple-500 ring-1 ring-purple-500'
                : 'bg-white/70 dark:bg-zinc-900/60 hover:bg-white/90 dark:hover:bg-zinc-800/70 border-purple-500/20'
            }`}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 shadow-sm">
                <FileCode className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-xs text-text truncate">
                    {inlineArtifact.title}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded-full">
                    {inlineArtifact.type}
                  </span>
                </div>
                <span className="text-[11px] text-text-muted mt-0.5 block truncate">
                  Click to execute and inspect in interactive Artifacts Canvas
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold shadow-sm hover:bg-purple-700 transition-all ml-2 shrink-0">
              <Play className="w-3 h-3 fill-white" />
              <span>Preview</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

// Apple-style Glass Code Container with Language Label & Copy Button
const CodeBlock: React.FC<{
  language: string;
  code: string;
  onOpenAsArtifact?: () => void;
}> = ({ language, code, onOpenAsArtifact }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-2xl border border-purple-500/20 overflow-hidden bg-[#120e24]/90 backdrop-blur-xl shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1b1535]/80 border-b border-purple-500/15 text-xs">
        <div className="flex items-center space-x-2">
          <Code2 className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-mono text-purple-300 lowercase font-semibold">
            {language}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {onOpenAsArtifact && (
            <button
              onClick={onOpenAsArtifact}
              className="flex items-center space-x-1 text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Play className="w-3 h-3" />
              <span>Open in Canvas</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 text-purple-200 hover:text-white transition-colors p-1"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-[#ede9fe] select-text">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

// Text parser with basic markdown support (bold, headers, lists, inline code)
const TextBlock: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={i} className="h-2" />;
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={i} className="font-bold text-base text-text mt-3 mb-1">
              {formatInline(trimmed.slice(4))}
            </h3>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={i} className="font-bold text-lg text-text mt-4 mb-1.5">
              {formatInline(trimmed.slice(3))}
            </h2>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={i} className="font-bold text-xl text-text mt-4 mb-2">
              {formatInline(trimmed.slice(2))}
            </h1>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={i} className="flex items-start space-x-2 pl-2">
              <span className="text-purple-500 font-bold mt-0.5">•</span>
              <span className="text-sm">{formatInline(trimmed.slice(2))}</span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={i} className="flex items-start space-x-2 pl-2">
              <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs mt-0.5 min-w-[16px]">
                {numMatch[1]}.
              </span>
              <span className="text-sm">{formatInline(numMatch[2])}</span>
            </div>
          );
        }

        return (
          <p key={i} className="text-sm leading-relaxed whitespace-pre-wrap">
            {formatInline(line)}
          </p>
        );
      })}
    </div>
  );
};

function formatInline(str: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = str;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    const codeMatch = remaining.match(/`([^`]+)`/);

    let nextMatchIndex = Infinity;
    let matchType = '';

    if (boldMatch && boldMatch.index !== undefined && boldMatch.index < nextMatchIndex) {
      nextMatchIndex = boldMatch.index;
      matchType = 'bold';
    }
    if (codeMatch && codeMatch.index !== undefined && codeMatch.index < nextMatchIndex) {
      nextMatchIndex = codeMatch.index;
      matchType = 'code';
    }

    if (nextMatchIndex === Infinity) {
      parts.push(remaining);
      break;
    }

    if (nextMatchIndex > 0) {
      parts.push(remaining.slice(0, nextMatchIndex));
    }

    if (matchType === 'bold' && boldMatch) {
      parts.push(
        <strong key={key++} className="font-semibold text-text">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(nextMatchIndex + boldMatch[0].length);
    } else if (matchType === 'code' && codeMatch) {
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 font-mono text-xs border border-purple-500/20"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(nextMatchIndex + codeMatch[0].length);
    }
  }

  return <>{parts}</>;
}

function parseBlocks(content: string): Array<{ type: 'text' | 'code'; language?: string; content: string }> {
  const blocks: Array<{ type: 'text' | 'code'; language?: string; content: string }> = [];
  const regex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textPart = content.slice(lastIndex, match.index).trim();
      if (textPart) blocks.push({ type: 'text', content: textPart });
    }

    blocks.push({
      type: 'code',
      language: match[1] || 'text',
      content: match[2].trim(),
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    const textPart = content.slice(lastIndex).trim();
    if (textPart) blocks.push({ type: 'text', content: textPart });
  }

  return blocks.length > 0 ? blocks : [{ type: 'text', content }];
}

function extractInlineArtifact(content: string): { cleanText: string; inlineArtifact: Artifact | null } {
  const rawHtmlMatch = content.match(/((?:<!DOCTYPE html>|<html|<section|<div class=)[\s\S]{80,}(?:<\/section>|<\/div>|<\/html>))/i);

  if (rawHtmlMatch && rawHtmlMatch[1]) {
    const rawHtml = rawHtmlMatch[1].trim();
    const clean = content.replace(rawHtml, '').trim();

    return {
      cleanText: clean || "I've generated the interactive component for you. Click the card below to preview or inspect the code in the Artifacts Canvas.",
      inlineArtifact: {
        id: `art-auto-${Date.now()}`,
        identifier: 'interactive-ui',
        title: 'Interactive UI Component',
        type: 'html',
        version: 1,
        content: rawHtml,
      },
    };
  }

  return { cleanText: content, inlineArtifact: null };
}

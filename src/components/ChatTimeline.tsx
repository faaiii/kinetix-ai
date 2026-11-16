'use client';

import React from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  Edit2,
  Sparkles,
  LayoutTemplate,
  FileCode,
} from 'lucide-react';
import { Message, Artifact } from '@/lib/types';
import { ThinkingAccordion } from './ThinkingAccordion';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatTimelineProps {
  messages: Message[];
  activeArtifactId?: string;
  onOpenArtifact: (artifact: Artifact) => void;
  isStreaming?: boolean;
}

export const ChatTimeline: React.FC<ChatTimelineProps> = ({
  messages,
  activeArtifactId,
  onOpenArtifact,
  isStreaming = false,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-content mx-auto w-full">
      {messages.map((message, idx) => {
        const isUser = message.role === 'user';
        const isLastAssistant =
          !isUser && idx === messages.length - 1 && isStreaming;

        return (
          <div
            key={message.id}
            className={`flex flex-col group ${
              isUser ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender & Timestamp */}
            <div className="flex items-center space-x-2 mb-1 px-1 text-[11px] text-text-muted">
              {isUser ? (
                <span className="font-medium">You</span>
              ) : (
                <div className="flex items-center space-x-1.5 font-semibold text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kinetix AI</span>
                </div>
              )}
            </div>

            {/* Apple Glass Bubble Container */}
            <div
              className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-2xl transition-all ${
                isUser
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/10'
                  : 'bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-purple-500/15 text-text w-full shadow-sm'
              }`}
            >
              {/* Extended Thinking Accordion (Assistant only) */}
              {!isUser && (
                <ThinkingAccordion
                  thinkingContent={message.thinkingContent}
                  durationSeconds={message.thinkingTimeSeconds}
                  isStreaming={isLastAssistant}
                />
              )}

              {/* Message Content with Markdown & CodeBlock Parsing */}
              {isUser ? (
                <div className="whitespace-pre-wrap text-white font-medium">{message.content}</div>
              ) : (
                <MarkdownRenderer
                  content={message.content}
                  onOpenArtifact={onOpenArtifact}
                  activeArtifactId={activeArtifactId}
                />
              )}

              {/* Embedded Artifacts Pill Card */}
              {message.artifacts && message.artifacts.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.artifacts.map((art) => {
                    const isActive = activeArtifactId === art.id;
                    return (
                      <button
                        key={art.id}
                        type="button"
                        onClick={() => onOpenArtifact(art)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left shadow-sm hover:shadow-md ${
                          isActive
                            ? 'bg-purple-500/15 border-purple-500 ring-1 ring-purple-500'
                            : 'bg-white/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-800 border-purple-500/20'
                        }`}
                      >
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 shadow-sm">
                            <LayoutTemplate className="w-5 h-5" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-xs text-text truncate">
                                {art.title}
                              </span>
                              <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded-full">
                                {art.type}
                              </span>
                            </div>
                            <span className="text-[11px] text-text-muted mt-0.5 block truncate">
                              Click to view and execute in interactive Artifacts canvas
                            </span>
                          </div>
                        </div>
                        <FileCode className="w-4 h-4 text-text-muted shrink-0 ml-2" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action Bar (Copy / Retry) */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex items-center space-x-2 px-1 text-text-muted text-xs">
              <button
                onClick={() => navigator.clipboard.writeText(message.content)}
                title="Copy message"
                className="hover:text-text p-1"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {isUser && (
                <button title="Edit prompt" className="hover:text-text p-1">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {!isUser && (
                <button title="Retry" className="hover:text-text p-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

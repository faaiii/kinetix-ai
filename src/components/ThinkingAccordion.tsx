'use client';

import React, { useState } from 'react';
import { ChevronRight, Brain } from 'lucide-react';

interface ThinkingAccordionProps {
  thinkingContent?: string;
  durationSeconds?: number;
  isStreaming?: boolean;
}

export const ThinkingAccordion: React.FC<ThinkingAccordionProps> = ({
  thinkingContent,
  durationSeconds = 6,
  isStreaming = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!thinkingContent && !isStreaming) return null;

  return (
    <div className="mb-3 rounded-xl border border-purple-500/20 bg-white/50 dark:bg-purple-950/20 backdrop-blur-md overflow-hidden transition-all text-xs shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-text-muted hover:text-text hover:bg-purple-500/5 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Brain
            className={`w-4 h-4 text-purple-600 dark:text-purple-400 ${
              isStreaming ? 'animate-pulse' : ''
            }`}
          />
          <span className="font-semibold text-text">
            {isStreaming
              ? 'Analyzing reasoning path...'
              : `Thought for ${durationSeconds} seconds`}
          </span>
        </div>
        <ChevronRight
          className={`w-3.5 h-3.5 text-purple-500 transition-transform duration-200 ${
            isOpen ? 'rotate-90' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-4 py-3 border-t border-purple-500/15 bg-purple-500/[0.03] font-mono text-[11px] text-text-muted whitespace-pre-wrap leading-relaxed select-text">
          {thinkingContent || 'Synthesizing knowledge context and planning response structure...'}
        </div>
      )}
    </div>
  );
};

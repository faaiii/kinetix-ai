'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles, Brain, Check, Radio } from 'lucide-react';
import { ModelOption } from '@/lib/types';
import { AVAILABLE_MODELS } from '@/lib/mock-data';

interface ModelSelectorProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  isExtendedThinking: boolean;
  onToggleThinking: (enabled: boolean) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModelId,
  onSelectModel,
  isExtendedThinking,
  onToggleThinking,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) ||
    AVAILABLE_MODELS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div className="flex items-center space-x-2">
        {/* Apple Glassy Model Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-purple-950/40 backdrop-blur-md hover:bg-white/90 dark:hover:bg-purple-900/50 border border-purple-500/25 text-xs font-medium text-text transition-all shadow-sm hover:shadow-md"
        >
          {/* Purple Sparkle Icon */}
          <div className="w-5 h-5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="font-semibold text-text">{selectedModel.name}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active & Online" />
          <ChevronDown className="w-3 h-3 text-text-muted opacity-70" />
        </button>

        {/* Extended Thinking Mode Toggle (Apple Glassy Pill) */}
        <button
          type="button"
          onClick={() => onToggleThinking(!isExtendedThinking)}
          aria-pressed={isExtendedThinking}
          title="Toggle deep reasoning and extended thinking steps"
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md transition-all shadow-sm ${
            isExtendedThinking
              ? 'bg-purple-500/15 border-purple-500/40 text-purple-600 dark:text-purple-300 font-semibold shadow-purple-500/10'
              : 'bg-white/60 dark:bg-zinc-900/40 border-purple-500/15 text-text-muted hover:text-text'
          }`}
        >
          <Brain className="w-3.5 h-3.5 text-purple-500" />
          <span>Thinking {isExtendedThinking ? 'on' : 'off'}</span>
          {isExtendedThinking && (
            <span className="text-[10px] bg-purple-500/20 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded-full font-mono font-medium">
              64k
            </span>
          )}
        </button>
      </div>

      {/* Floating Apple Glass Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2.5 w-84 sm:w-96 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-purple-500/25 shadow-2xl z-50 p-2.5 space-y-1.5 animate-in fade-in-50 zoom-in-95">
          <div className="px-3 py-2 text-[11px] font-semibold text-text-muted uppercase tracking-wider border-b border-purple-500/15 flex items-center justify-between">
            <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>4/4 Models Active & Ready</span>
            </span>
            <span className="text-[10px] text-purple-500 font-semibold bg-purple-500/15 px-2 py-0.5 rounded-full">Kinetix AI</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {AVAILABLE_MODELS.map((model) => {
              const isSelected = model.id === selectedModelId;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    onSelectModel(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start space-x-3 cursor-pointer ${
                    isSelected
                      ? 'bg-purple-500/15 border border-purple-500/40 text-text shadow-sm shadow-purple-500/10'
                      : 'hover:bg-purple-500/10 border border-transparent text-text hover:border-purple-500/20'
                  }`}
                >
                  {/* Radio / Check Indicator */}
                  <div className="mt-1 shrink-0">
                    {isSelected ? (
                      <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-sm">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-purple-400/40 hover:border-purple-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-text truncate">
                          {model.name}
                        </span>
                        <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-500 dark:text-emerald-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                          <span>Active</span>
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${
                          isSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-500/15 text-purple-600 dark:text-purple-300'
                        }`}
                      >
                        {model.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      {model.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-3 py-1.5 border-t border-purple-500/10 text-center text-[10px] text-text-muted">
            Click any model above to switch instantly. Zero setup required.
          </div>
        </div>
      )}
    </div>
  );
};

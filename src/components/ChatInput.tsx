'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Paperclip, Square, X, Heart } from 'lucide-react';
import { Attachment } from '@/lib/types';

interface ChatInputProps {
  onSend: (text: string, attachments: Attachment[]) => void;
  isStreaming?: boolean;
  onStop?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isStreaming = false,
  onStop,
  placeholder = 'What will we engineer today?',
  disabled = false,
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((!input.trim() && attachments.length === 0) || isStreaming || disabled)
      return;
    onSend(input.trim(), attachments);
    setInput('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAttachment: Attachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type || 'text/plain',
      };
      setAttachments([...attachments, newAttachment]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  return (
    <div className="w-full max-w-content mx-auto p-3 sm:p-4 shrink-0">
      {/* Floating Glass Dock Input Bar */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-purple-500/25 focus-within:border-purple-500/70 focus-within:ring-2 focus-within:ring-purple-500/15 rounded-3xl shadow-xl shadow-purple-500/5 transition-all p-3 sm:p-3.5">
        {/* Attached files chips */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 pb-2 border-b border-purple-500/15">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-text"
              >
                <Paperclip className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span className="truncate max-w-[140px] font-medium">
                  {att.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(att.id)}
                  className="hover:text-red-500 p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="w-full bg-transparent resize-none focus:outline-none text-text placeholder:text-text-muted text-sm leading-relaxed max-h-[180px] sm:max-h-[200px]"
        />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-purple-500/10">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach documents or photos"
              className="p-1.5 rounded-full hover:bg-purple-500/10 text-text-muted hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-text-muted hidden sm:inline">
              Attach documents, code, or images
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                aria-label="Stop generation"
                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-md"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim() && attachments.length === 0}
                aria-label="Send message"
                className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-purple-600/20 active:scale-95"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Creator Attribution Footer */}
      <div className="text-center mt-2.5 text-[11px] text-text-muted flex items-center justify-center space-x-1.5">
        <span>by</span>
        <a
          href="https://www.instagram.com/muhammadfaisal.dhk/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center space-x-1 transition-colors"
        >
          <span>muhammad faisal</span>
        </a>
      </div>
    </div>
  );
};

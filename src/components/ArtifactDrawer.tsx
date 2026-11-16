'use client';

import React, { useState } from 'react';
import {
  X,
  Code,
  Eye,
  Copy,
  Check,
  Download,
  Maximize2,
  Minimize2,
  History,
} from 'lucide-react';
import { Artifact } from '@/lib/types';

interface ArtifactDrawerProps {
  artifact: Artifact | null;
  onClose: () => void;
  availableVersions?: number[];
  onSelectVersion?: (version: number) => void;
}

export const ArtifactDrawer: React.FC<ArtifactDrawerProps> = ({
  artifact,
  onClose,
  availableVersions = [1],
  onSelectVersion,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [isCopied, setIsCopied] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  if (!artifact) return null;

  const handleCopy = () => {
    if (!artifact) return;
    navigator.clipboard.writeText(artifact.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!artifact) return;
    const blob = new Blob([artifact.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.identifier}-v${artifact.version}.${
      artifact.type === 'html'
        ? 'html'
        : artifact.type === 'svg'
        ? 'svg'
        : artifact.type === 'markdown'
        ? 'md'
        : 'txt'
    }`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`border-l border-purple-500/20 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl flex flex-col transition-all duration-300 z-30 shadow-2xl ${
        isMaximized
          ? 'fixed inset-0 z-50 w-full'
          : 'max-md:fixed max-md:inset-0 max-md:z-50 md:relative w-full md:w-1/2 lg:w-[48%] h-full shrink-0'
      }`}
    >
      {/* Top Header */}
      <div className="p-3.5 border-b border-purple-500/15 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20">
            {artifact.type}
          </span>
          <h2 className="font-semibold text-text text-sm truncate">
            {artifact.title}
          </h2>
          {availableVersions.length > 1 && (
            <div className="flex items-center space-x-1 text-xs text-text-muted">
              <History className="w-3.5 h-3.5 text-purple-500" />
              <select
                value={artifact.version}
                onChange={(e) =>
                  onSelectVersion && onSelectVersion(Number(e.target.value))
                }
                className="bg-purple-500/10 border border-purple-500/20 rounded-md px-1.5 py-0.5 text-xs text-text focus:outline-none"
              >
                {availableVersions.map((v) => (
                  <option key={v} value={v}>
                    v{v}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1">
          {/* Apple Tab Switcher */}
          <div className="flex items-center bg-purple-500/10 border border-purple-500/20 rounded-full p-0.5 mr-2">
            <button
              onClick={() => setActiveTab('preview')}
              aria-label="Preview canvas"
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'preview'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              aria-label="Code view"
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'code'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            title="Copy code"
            className="p-1.5 rounded-lg hover:bg-purple-500/10 text-text-muted hover:text-purple-600 transition-colors"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleDownload}
            title="Download file"
            className="p-1.5 rounded-lg hover:bg-purple-500/10 text-text-muted hover:text-purple-600 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            title={isMaximized ? 'Minimize' : 'Maximize'}
            className="p-1.5 rounded-lg hover:bg-purple-500/10 text-text-muted hover:text-purple-600 transition-colors"
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onClose}
            title="Close canvas"
            className="p-1.5 rounded-lg hover:bg-purple-500/10 text-text-muted hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative bg-bg/50">
        {activeTab === 'preview' ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-3">
            <iframe
              title={artifact.title}
              srcDoc={artifact.content}
              sandbox="allow-scripts allow-modals"
              className="w-full h-full border border-purple-500/15 rounded-2xl shadow-inner bg-white"
            />
          </div>
        ) : (
          <div className="w-full h-full overflow-auto p-4 bg-[#100d20] text-[#ede9fe] font-mono text-xs leading-relaxed select-text">
            <pre>
              <code>{artifact.content}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

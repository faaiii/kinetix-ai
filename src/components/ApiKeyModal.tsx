'use client';

import React, { useState, useEffect } from 'react';
import { Key, X, Check, AlertCircle, ExternalLink, Zap, ShieldCheck } from 'lucide-react';

export interface ApiConfig {
  provider: 'gemini' | 'groq' | 'openai' | 'anthropic' | 'ollama' | 'demo';
  apiKey: string;
  model: string;
  customBaseUrl?: string;
}

const PROVIDERS = [
  {
    id: 'anthropic',
    name: 'Anthropic Claude (Official)',
    defaultModel: 'claude-3-7-sonnet',
    models: ['claude-3-7-sonnet', 'claude-3-5-sonnet', 'claude-3-5-haiku', 'claude-3-opus'],
    helpUrl: 'https://console.anthropic.com/settings/keys',
    helpText: 'Official Claude API key from console.anthropic.com for heavy reasoning tasks',
    badge: 'Frontier AI',
  },
  {
    id: 'groq',
    name: 'Groq (Free & Ultra Fast)',
    defaultModel: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    helpUrl: 'https://console.groq.com/keys',
    helpText: 'Free API key from console.groq.com (instant setup, no credit card required)',
    badge: 'Recommended Free',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    defaultModel: 'gemini-1.5-flash',
    models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'],
    helpUrl: 'https://aistudio.google.com/app/apikey',
    helpText: 'Free API key from Google AI Studio',
    badge: 'Google AI',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o', 'o1-mini'],
    helpUrl: 'https://platform.openai.com/api-keys',
    helpText: 'API key from platform.openai.com',
    badge: 'Popular',
  },
  {
    id: 'ollama',
    name: 'Ollama (Local Offline)',
    defaultModel: 'qwen3.5:latest',
    models: ['qwen3.5:latest', 'llama3.2', 'deepseek-r1', 'mistral'],
    helpUrl: 'https://ollama.com',
    helpText: 'Runs 100% locally on your computer with zero API keys via http://localhost:11434',
    badge: '100% Private & Free',
  },
];

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  onSaveConfig: (config: ApiConfig) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [provider, setProvider] = useState<ApiConfig['provider']>(config.provider || 'anthropic');
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [model, setModel] = useState(config.model || 'claude-3-7-sonnet');
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setProvider(config.provider || 'anthropic');
      setApiKey(config.apiKey || '');
      setModel(config.model || 'claude-3-7-sonnet');
      setSaved(false);
      setTestResult(null);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const currentProviderInfo = PROVIDERS.find((p) => p.id === provider) || PROVIDERS[0];

  const handleProviderChange = (newP: any) => {
    setProvider(newP);
    const pInfo = PROVIDERS.find((p) => p.id === newP);
    if (pInfo) {
      setModel(pInfo.defaultModel);
    }
    setTestResult(null);
  };

  const handleSave = () => {
    onSaveConfig({
      provider,
      apiKey: apiKey.trim(),
      model,
    });
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setApiKey('');
    onSaveConfig({
      provider: 'ollama',
      apiKey: '',
      model: 'qwen3.5:latest',
    });
    setSaved(true);
    setTimeout(() => onClose(), 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-purple-500/25 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-purple-500/10 text-text-muted hover:text-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-text">Intelligence & API Settings</h2>
            <p className="text-xs text-text-muted">Configure frontier LLMs for deep reasoning and complex coding</p>
          </div>
        </div>

        <div className="space-y-4 my-5">
          {/* Provider Select */}
          <div>
            <label className="block text-xs font-semibold text-text mb-2">Select Provider</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROVIDERS.map((p) => {
                const isSelected = provider === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleProviderChange(p.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-purple-600 bg-purple-500/10 ring-2 ring-purple-500/20 text-text'
                        : 'border-purple-500/15 bg-white/50 dark:bg-zinc-800/40 hover:bg-purple-500/5 text-text-muted hover:text-text'
                    }`}
                  >
                    <div className="font-semibold text-xs truncate">{p.name.split(' (')[0]}</div>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">{p.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Select */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-white/70 dark:bg-zinc-800/60 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-text focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 transition-all"
            >
              {currentProviderInfo.models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* API Key Input */}
          {provider !== 'ollama' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-text">API Key</label>
                <a
                  href={currentProviderInfo.helpUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1"
                >
                  <span>Get API Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Paste your ${currentProviderInfo.name} API key here`}
                className="w-full bg-white/70 dark:bg-zinc-800/60 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 font-mono transition-all"
              />
              <p className="text-[11px] text-text-muted mt-2 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Keys are stored strictly in your browser and never logged or exposed.</span>
              </p>
            </div>
          )}

          {provider === 'ollama' && (
            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-700 dark:text-purple-300">
              💡 <strong>Ollama is active locally!</strong> Zero API keys, zero rate limits, and 100% offline private execution.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-purple-500/15">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-text-muted hover:text-red-500 px-2 py-1 transition-colors"
          >
            Reset to Local Ollama
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-600/25 transition-all flex items-center space-x-1.5 active:scale-95"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Save & Apply</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

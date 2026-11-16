'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Plus,
  ArrowLeft,
  FileText,
  Trash2,
  Upload,
  Brain,
  Star,
} from 'lucide-react';
import { INITIAL_PROJECTS } from '@/lib/mock-data';
import { Project } from '@/lib/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    INITIAL_PROJECTS[0]
  );
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newInstructions, setNewInstructions] = useState('');

  const handleCreateProject = () => {
    if (!newTitle.trim()) return;
    const project: Project = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      customInstructions: newInstructions.trim(),
      fileCount: 0,
      tokenCount: 0,
    };
    setProjects([project, ...projects]);
    setSelectedProject(project);
    setIsCreating(false);
    setNewTitle('');
    setNewDesc('');
    setNewInstructions('');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg">
      {/* Left Project Sidebar */}
      <div className="w-80 border-r border-border bg-surface flex flex-col justify-between shrink-0">
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xs text-text-muted hover:text-text font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Chat</span>
            </Link>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center space-x-1 py-1 px-2.5 rounded-lg bg-accent text-on-accent text-xs font-semibold hover:bg-accent-hover transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          <div className="p-3">
            <h1 className="font-serif font-bold text-lg text-text px-1 mb-2">
              Projects
            </h1>
            <p className="text-xs text-text-muted px-1 mb-3">
              Context-grounded workspaces with persistent instructions and knowledge documents.
            </p>

            <div className="space-y-1 overflow-y-auto">
              {projects.map((proj) => {
                const isSelected = selectedProject?.id === proj.id;
                return (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setSelectedProject(proj);
                      setIsCreating(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-bg border-accent text-text shadow-card'
                        : 'border-transparent text-text-muted hover:bg-surface-hover hover:text-text'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-text truncate">
                        {proj.title}
                      </span>
                      {proj.isStarred && (
                        <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                      )}
                    </div>
                    <div className="text-[11px] text-text-muted truncate mt-0.5">
                      {proj.fileCount} files • {(proj.tokenCount / 1000).toFixed(1)}k tokens
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Project View / Detail */}
      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto">
        {isCreating ? (
          <div className="space-y-6">
            <h2 className="font-serif font-bold text-2xl text-text">
              Create New Project Workspace
            </h2>
            <div className="space-y-4 bg-surface border border-border p-6 rounded-2xl shadow-card">
              <div>
                <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Q1 Marketing Campaign"
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Short summary of this workspace's goals"
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1">
                  Custom System Instructions
                </label>
                <textarea
                  rows={4}
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  placeholder="Directives prepended to every conversation in this project..."
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleCreateProject}
                  disabled={!newTitle.trim()}
                  className="px-4 py-2 bg-accent text-on-accent text-xs font-semibold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-40"
                >
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-surface text-text-muted hover:text-text text-xs font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : selectedProject ? (
          <div className="space-y-8">
            {/* Project Header */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-serif font-bold text-3xl text-text">
                  {selectedProject.title}
                </h2>
                <Link
                  href="/"
                  className="px-4 py-2 bg-accent text-on-accent text-xs font-semibold rounded-xl hover:bg-accent-hover transition-colors shadow-card flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start Project Chat</span>
                </Link>
              </div>
              <p className="text-sm text-text-muted mt-1">
                {selectedProject.description || 'No description provided.'}
              </p>
            </div>

            {/* Context Token Budget Meter */}
            <div className="p-4 rounded-xl border border-border bg-surface shadow-card">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-text flex items-center space-x-1.5">
                  <Brain className="w-4 h-4 text-accent" />
                  <span>Project Context Window Budget</span>
                </span>
                <span className="text-text-muted font-mono">
                  {(selectedProject.tokenCount / 1000).toFixed(1)}k / 200k tokens ({((selectedProject.tokenCount / 200000) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (selectedProject.tokenCount / 200000) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Custom Instructions */}
            <div className="p-5 rounded-2xl border border-border bg-surface shadow-card space-y-3">
              <h3 className="font-semibold text-sm text-text">
                Project Custom Instructions
              </h3>
              <p className="text-xs text-text-muted">
                These directives are automatically included in the system prompt for every chat in this project.
              </p>
              <textarea
                rows={3}
                defaultValue={selectedProject.customInstructions}
                className="w-full bg-bg border border-border rounded-xl p-3 text-xs text-text focus:outline-none focus:border-accent font-sans leading-relaxed"
              />
            </div>

            {/* Project Knowledge Documents */}
            <div className="p-5 rounded-2xl border border-border bg-surface shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-text">
                    Project Knowledge Files
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Upload documents, spreadsheets, and markdown notes for context grounding.
                  </p>
                </div>
                <button
                  type="button"
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-border bg-bg hover:bg-surface-hover text-xs font-medium text-text transition-colors shadow-card"
                >
                  <Upload className="w-3.5 h-3.5 text-accent" />
                  <span>Upload File</span>
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'q4_growth_metrics.csv', size: '142 KB', tokens: '14,200' },
                  { name: 'customer_interviews_october.md', size: '88 KB', tokens: '18,500' },
                  { name: 'system_architecture_spec.pdf', size: '320 KB', tokens: '15,800' },
                ].map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-bg text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-accent" />
                      <div>
                        <div className="font-medium text-text">{file.name}</div>
                        <div className="text-[11px] text-text-muted">
                          {file.size} • {file.tokens} tokens
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="p-1 hover:text-danger text-text-muted transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

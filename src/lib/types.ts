export type Role = 'user' | 'assistant' | 'system';

export type ArtifactType = 'code' | 'html' | 'svg' | 'markdown' | 'react';

export interface Artifact {
  id: string;
  identifier: string;
  title: string;
  type: ArtifactType;
  language?: string;
  content: string;
  version: number;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface Message {
  id: string;
  conversationId: string;
  parentMessageId?: string;
  role: Role;
  content: string;
  thinkingContent?: string;
  thinkingTimeSeconds?: number;
  artifacts?: Artifact[];
  attachments?: Attachment[];
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  projectId?: string;
  isStarred?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  customInstructions?: string;
  fileCount: number;
  tokenCount: number;
  isStarred?: boolean;
}

export interface ModelOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  isReasoning?: boolean;
}

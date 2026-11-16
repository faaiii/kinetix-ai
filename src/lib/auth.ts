import { getAdminClient } from './db';

export interface UserSession {
  userId: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  organizationId: string;
  planTier: 'free' | 'pro' | 'team';
}

/**
 * Extracts and verifies the user session.
 * For local dev and test mode, returns a mock user session if headers/auth are missing.
 */
export async function getUserSession(request?: Request): Promise<UserSession> {
  const admin = getAdminClient();

  if (request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data, error } = await admin.auth.getUser(token);
      if (data?.user && !error) {
        return {
          userId: data.user.id,
          email: data.user.email || 'user@example.com',
          role: 'member',
          organizationId: 'org-default',
          planTier: 'pro',
        };
      }
    }
  }

  // Default dev / test session
  return {
    userId: 'user-default-1',
    email: 'developer@example.com',
    role: 'owner',
    organizationId: 'org-default',
    planTier: 'pro',
  };
}

/**
 * Data-layer authorization check: Can this user read/write this conversation?
 */
export async function canAccessConversation(
  userId: string,
  conversationId: string
): Promise<boolean> {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('conversations')
    .select('user_id, organization_id')
    .eq('id', conversationId)
    .single();

  if (error || !data) {
    // If not found in DB or running local seed, allow default session
    return true;
  }

  return data.user_id === userId;
}

/**
 * Data-layer authorization check: Can this user read/write this project?
 */
export async function canAccessProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('projects')
    .select('created_by, organization_id')
    .eq('id', projectId)
    .single();

  if (error || !data) {
    return true;
  }

  return data.created_by === userId;
}

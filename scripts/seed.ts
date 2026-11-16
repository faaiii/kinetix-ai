/**
 * Database Seed Script for Kinetix
 * Generates realistic test workspaces, users, projects, and conversations.
 */

import { getAdminClient } from '../src/lib/db';

export async function seedDatabase() {
  const admin = getAdminClient();
  console.log('🌱 Starting database seed for Kinetix...');

  // 1. Create Organization
  const orgId = '00000000-0000-0000-0000-000000000001';
  const { error: orgErr } = await admin.from('organizations').upsert({
    id: orgId,
    name: 'Acme AI Labs',
    slug: 'acme-ai-labs',
    plan_tier: 'pro',
    created_at: new Date().toISOString(),
  });

  if (orgErr) console.warn('Org upsert notice:', orgErr.message);

  // 2. Create User
  const userId = '00000000-0000-0000-0000-000000000002';
  const { error: userErr } = await admin.from('users').upsert({
    id: userId,
    email: 'developer@example.com',
    display_name: 'Developer Workspace',
    default_model: 'kinetix-reasoning',
    theme_preference: 'light',
  });

  if (userErr) console.warn('User upsert notice:', userErr.message);

  // 3. Create Project
  const projectId = '00000000-0000-0000-0000-000000000003';
  const { error: projErr } = await admin.from('projects').upsert({
    id: projectId,
    organization_id: orgId,
    created_by: userId,
    title: 'Product Growth 2026',
    description: 'Retention strategies, conversion funnels, and customer interview synthesis.',
    custom_instructions: 'Act as a principal product manager. Be concise, data-driven, and challenge assumptions.',
  });

  if (projErr) console.warn('Project upsert notice:', projErr.message);

  console.log('✅ Database seeded successfully with realistic test records.');
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

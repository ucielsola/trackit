import type { Database } from '$lib/database.types';

// Base rows
export type Client = Database['public']['Tables']['clients']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Entry = Database['public']['Tables']['entries']['Row'];
export type EntryStatus = Database['public']['Enums']['entry_status'];

// Extended types
export type ProjectWithEntries = Project & { entries: Entry[] };
export type ClientWithProjects = Client & { projects: ProjectWithEntries[] };
export type ClientWithStats = Client & {
  project_count: number;
  total_hours?: number;
  total_revenue?: number;
};

// API types
export type GetClientsResponse = {
  clients: ClientWithStats[];
  total: number;
};

export type CreateClientInput = {
  name: string;
};

// UI state types
export type ModalState = 'open' | 'closed';
import type { Tables, TablesInsert } from '$lib/database.types';

export type Project = Tables<'projects'>;
export type NewProject = TablesInsert<'projects'>;

export type Client = Tables<'clients'>;
export type NewClient = TablesInsert<'clients'>;
export type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export interface AudioTrack { id: number; language: string; url: string; }
export interface Module { id: number; title: string; position: number; durationSeconds: number; videoUrl: string; audioTracks: AudioTrack[]; }
export interface Course { id: number; title: string; instructor: string; language: string; level: Level; description: string; modules: Module[]; progress?: number; }
export interface Enrollment { course: Course; completedModuleIds: number[]; progress: number; }
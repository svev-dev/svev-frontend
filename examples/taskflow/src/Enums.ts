export const Priorities = ['high', 'medium', 'low'] as const;
export type Priority = (typeof Priorities)[number];

export const Columns = ['todo', 'inProgress', 'done'] as const;
export type Column = (typeof Columns)[number];

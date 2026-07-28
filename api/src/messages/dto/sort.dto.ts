export const MESSAGE_SORT_FIELDS = ['subject', 'createdAt', 'updatedAt'] as const

export type MessageSortField = (typeof MESSAGE_SORT_FIELDS)[number]

export type Mailbox = 'INBOX' | 'Sent' | string;

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Topic = 'sales' | 'marketing';

export type Message = {
  id: string;
  accountEmail: string;
  mailbox: Mailbox;
  uid: number;
  messageId?: string | null;
  inReplyTo?: string | null;
  references?: string[] | null;
  from: string;
  to?: string[] | null;
  subject: string;
  date?: string | null;
  text: string;
  threadRootId?: string | null;
  // Null until the classification cron has processed the message.
  priority?: Priority | null;
  topic?: Topic | null;
  createdAt: string;
  updatedAt: string;
};

export type CompactMessage = {
  from: string;
  subject: string;
  mailbox: Mailbox;
  date?: string | null;
  text: string;
};

export type Mailbox = 'INBOX' | 'Sent' | string;

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

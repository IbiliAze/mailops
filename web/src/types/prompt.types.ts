export type TimePeriod = 1 | 2 | 7;

export type Prompt = {
  id: string;
  prompt: string;
  subject?: string | null;
  timePeriod?: TimePeriod | null;
  createdAt: string;
  updatedAt: string;
};

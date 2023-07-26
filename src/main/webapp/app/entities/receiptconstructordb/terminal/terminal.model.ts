export interface ITerminal {
  id: number;
  description?: string | null;
}

export type NewTerminal = Omit<ITerminal, 'id'> & { id: null };

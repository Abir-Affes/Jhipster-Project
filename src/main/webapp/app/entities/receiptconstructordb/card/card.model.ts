export interface ICard {
  id: number;
  type?: string | null;
}

export type NewCard = Omit<ICard, 'id'> & { id: null };

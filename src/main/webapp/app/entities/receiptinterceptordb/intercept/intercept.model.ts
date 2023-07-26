export interface IIntercept {
  id: number;
  receipt_code?: string | null;
  location?: string | null;
}

export type NewIntercept = Omit<IIntercept, 'id'> & { id: null };

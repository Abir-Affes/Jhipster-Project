import { ICard, NewCard } from './card.model';

export const sampleWithRequiredData: ICard = {
  id: 26995,
};

export const sampleWithPartialData: ICard = {
  id: 6751,
};

export const sampleWithFullData: ICard = {
  id: 27659,
  type: 'Frozen',
};

export const sampleWithNewData: NewCard = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

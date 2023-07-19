import { ICard, NewCard } from './card.model';

export const sampleWithRequiredData: ICard = {
  id: 8642,
};

export const sampleWithPartialData: ICard = {
  id: 7175,
};

export const sampleWithFullData: ICard = {
  id: 24628,
  type: 'Southwest male stain',
};

export const sampleWithNewData: NewCard = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

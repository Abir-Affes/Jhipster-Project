import { ITerminal, NewTerminal } from './terminal.model';

export const sampleWithRequiredData: ITerminal = {
  id: 10918,
};

export const sampleWithPartialData: ITerminal = {
  id: 29071,
  description: 'asymmetric Darmstadtium',
};

export const sampleWithFullData: ITerminal = {
  id: 908,
  description: 'withdrawal',
};

export const sampleWithNewData: NewTerminal = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

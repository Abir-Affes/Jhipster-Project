import { IIntercept, NewIntercept } from './intercept.model';

export const sampleWithRequiredData: IIntercept = {
  id: 10327,
};

export const sampleWithPartialData: IIntercept = {
  id: 15935,
  location: 'ohm blank',
};

export const sampleWithFullData: IIntercept = {
  id: 6439,
  receipt_code: 'Southwest Minivan',
  location: 'salmon dame',
};

export const sampleWithNewData: NewIntercept = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

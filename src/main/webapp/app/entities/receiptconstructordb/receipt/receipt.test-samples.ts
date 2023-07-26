import dayjs from 'dayjs/esm';

import { trans_type } from 'app/entities/enumerations/trans-type.model';
import { result } from 'app/entities/enumerations/result.model';

import { IReceipt, NewReceipt } from './receipt.model';

export const sampleWithRequiredData: IReceipt = {
  id: 11485,
};

export const sampleWithPartialData: IReceipt = {
  id: 5981,
  receipt_no: 4583,
  transaction_type: 'SYSTEM',
  receipt_type: 'Account',
  licensing_no: 18095,
  pos_info: 30256,
  result: 'REJECTED',
  date: dayjs('2023-07-19'),
};

export const sampleWithFullData: IReceipt = {
  id: 5065,
  receipt_no: 8665,
  trace_no: 595306,
  amount: 86431,
  transaction_type: 'OTHER',
  vu_no: 32666,
  receipt_type: 'trash',
  ref_parameters: 8647,
  licensing_no: 29951,
  pos_info: 14106,
  result: 'SUCCESS',
  date: dayjs('2023-07-20'),
};

export const sampleWithNewData: NewReceipt = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

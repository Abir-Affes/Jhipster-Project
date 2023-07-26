import dayjs from 'dayjs/esm';
import { ITerminal } from 'app/entities/receiptconstructordb/terminal/terminal.model';
import { ICard } from 'app/entities/receiptconstructordb/card/card.model';
import { trans_type } from 'app/entities/enumerations/trans-type.model';
import { result } from 'app/entities/enumerations/result.model';

export interface IReceipt {
  id: number;
  receipt_no?: number | null;
  trace_no?: number | null;
  amount?: number | null;
  transaction_type?: keyof typeof trans_type | null;
  vu_no?: number | null;
  receipt_type?: string | null;
  ref_parameters?: number | null;
  licensing_no?: number | null;
  pos_info?: number | null;
  result?: keyof typeof result | null;
  date?: dayjs.Dayjs | null;
  terminal_id?: Pick<ITerminal, 'id'> | null;
  card_id?: Pick<ICard, 'id'> | null;
}

export type NewReceipt = Omit<IReceipt, 'id'> & { id: null };

import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IReceipt, NewReceipt } from '../receipt.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReceipt for edit and NewReceiptFormGroupInput for create.
 */
type ReceiptFormGroupInput = IReceipt | PartialWithRequiredKeyOf<NewReceipt>;

type ReceiptFormDefaults = Pick<NewReceipt, 'id'>;

type ReceiptFormGroupContent = {
  id: FormControl<IReceipt['id'] | NewReceipt['id']>;
  receipt_no: FormControl<IReceipt['receipt_no']>;
  trace_no: FormControl<IReceipt['trace_no']>;
  amount: FormControl<IReceipt['amount']>;
  transaction_type: FormControl<IReceipt['transaction_type']>;
  vu_no: FormControl<IReceipt['vu_no']>;
  receipt_type: FormControl<IReceipt['receipt_type']>;
  ref_parameters: FormControl<IReceipt['ref_parameters']>;
  licensing_no: FormControl<IReceipt['licensing_no']>;
  pos_info: FormControl<IReceipt['pos_info']>;
  result: FormControl<IReceipt['result']>;
  date: FormControl<IReceipt['date']>;
  terminal_id: FormControl<IReceipt['terminal_id']>;
  card_id: FormControl<IReceipt['card_id']>;
};

export type ReceiptFormGroup = FormGroup<ReceiptFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReceiptFormService {
  createReceiptFormGroup(receipt: ReceiptFormGroupInput = { id: null }): ReceiptFormGroup {
    const receiptRawValue = {
      ...this.getFormDefaults(),
      ...receipt,
    };
    return new FormGroup<ReceiptFormGroupContent>({
      id: new FormControl(
        { value: receiptRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      receipt_no: new FormControl(receiptRawValue.receipt_no, {
        validators: [Validators.max(9999)],
      }),
      trace_no: new FormControl(receiptRawValue.trace_no, {
        validators: [Validators.max(999999)],
      }),
      amount: new FormControl(receiptRawValue.amount, {
        validators: [Validators.max(99999.99)],
      }),
      transaction_type: new FormControl(receiptRawValue.transaction_type),
      vu_no: new FormControl(receiptRawValue.vu_no),
      receipt_type: new FormControl(receiptRawValue.receipt_type),
      ref_parameters: new FormControl(receiptRawValue.ref_parameters),
      licensing_no: new FormControl(receiptRawValue.licensing_no),
      pos_info: new FormControl(receiptRawValue.pos_info),
      result: new FormControl(receiptRawValue.result),
      date: new FormControl(receiptRawValue.date),
      terminal_id: new FormControl(receiptRawValue.terminal_id),
      card_id: new FormControl(receiptRawValue.card_id),
    });
  }

  getReceipt(form: ReceiptFormGroup): IReceipt | NewReceipt {
    return form.getRawValue() as IReceipt | NewReceipt;
  }

  resetForm(form: ReceiptFormGroup, receipt: ReceiptFormGroupInput): void {
    const receiptRawValue = { ...this.getFormDefaults(), ...receipt };
    form.reset(
      {
        ...receiptRawValue,
        id: { value: receiptRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ReceiptFormDefaults {
    return {
      id: null,
    };
  }
}

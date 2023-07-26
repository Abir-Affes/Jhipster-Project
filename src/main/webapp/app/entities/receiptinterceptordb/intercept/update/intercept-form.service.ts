import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IIntercept, NewIntercept } from '../intercept.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IIntercept for edit and NewInterceptFormGroupInput for create.
 */
type InterceptFormGroupInput = IIntercept | PartialWithRequiredKeyOf<NewIntercept>;

type InterceptFormDefaults = Pick<NewIntercept, 'id'>;

type InterceptFormGroupContent = {
  id: FormControl<IIntercept['id'] | NewIntercept['id']>;
  receipt_code: FormControl<IIntercept['receipt_code']>;
  location: FormControl<IIntercept['location']>;
};

export type InterceptFormGroup = FormGroup<InterceptFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InterceptFormService {
  createInterceptFormGroup(intercept: InterceptFormGroupInput = { id: null }): InterceptFormGroup {
    const interceptRawValue = {
      ...this.getFormDefaults(),
      ...intercept,
    };
    return new FormGroup<InterceptFormGroupContent>({
      id: new FormControl(
        { value: interceptRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      receipt_code: new FormControl(interceptRawValue.receipt_code),
      location: new FormControl(interceptRawValue.location),
    });
  }

  getIntercept(form: InterceptFormGroup): IIntercept | NewIntercept {
    return form.getRawValue() as IIntercept | NewIntercept;
  }

  resetForm(form: InterceptFormGroup, intercept: InterceptFormGroupInput): void {
    const interceptRawValue = { ...this.getFormDefaults(), ...intercept };
    form.reset(
      {
        ...interceptRawValue,
        id: { value: interceptRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): InterceptFormDefaults {
    return {
      id: null,
    };
  }
}

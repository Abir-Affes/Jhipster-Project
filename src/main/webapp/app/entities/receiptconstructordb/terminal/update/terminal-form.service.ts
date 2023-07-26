import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITerminal, NewTerminal } from '../terminal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITerminal for edit and NewTerminalFormGroupInput for create.
 */
type TerminalFormGroupInput = ITerminal | PartialWithRequiredKeyOf<NewTerminal>;

type TerminalFormDefaults = Pick<NewTerminal, 'id'>;

type TerminalFormGroupContent = {
  id: FormControl<ITerminal['id'] | NewTerminal['id']>;
  description: FormControl<ITerminal['description']>;
};

export type TerminalFormGroup = FormGroup<TerminalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TerminalFormService {
  createTerminalFormGroup(terminal: TerminalFormGroupInput = { id: null }): TerminalFormGroup {
    const terminalRawValue = {
      ...this.getFormDefaults(),
      ...terminal,
    };
    return new FormGroup<TerminalFormGroupContent>({
      id: new FormControl(
        { value: terminalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(terminalRawValue.description),
    });
  }

  getTerminal(form: TerminalFormGroup): ITerminal | NewTerminal {
    return form.getRawValue() as ITerminal | NewTerminal;
  }

  resetForm(form: TerminalFormGroup, terminal: TerminalFormGroupInput): void {
    const terminalRawValue = { ...this.getFormDefaults(), ...terminal };
    form.reset(
      {
        ...terminalRawValue,
        id: { value: terminalRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TerminalFormDefaults {
    return {
      id: null,
    };
  }
}

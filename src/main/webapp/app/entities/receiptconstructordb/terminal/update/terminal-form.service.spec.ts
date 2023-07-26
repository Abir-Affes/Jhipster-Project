import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../terminal.test-samples';

import { TerminalFormService } from './terminal-form.service';

describe('Terminal Form Service', () => {
  let service: TerminalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerminalFormService);
  });

  describe('Service methods', () => {
    describe('createTerminalFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTerminalFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });

      it('passing ITerminal should create a new form with FormGroup', () => {
        const formGroup = service.createTerminalFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });
    });

    describe('getTerminal', () => {
      it('should return NewTerminal for default Terminal initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTerminalFormGroup(sampleWithNewData);

        const terminal = service.getTerminal(formGroup) as any;

        expect(terminal).toMatchObject(sampleWithNewData);
      });

      it('should return NewTerminal for empty Terminal initial value', () => {
        const formGroup = service.createTerminalFormGroup();

        const terminal = service.getTerminal(formGroup) as any;

        expect(terminal).toMatchObject({});
      });

      it('should return ITerminal', () => {
        const formGroup = service.createTerminalFormGroup(sampleWithRequiredData);

        const terminal = service.getTerminal(formGroup) as any;

        expect(terminal).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITerminal should not enable id FormControl', () => {
        const formGroup = service.createTerminalFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTerminal should disable id FormControl', () => {
        const formGroup = service.createTerminalFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

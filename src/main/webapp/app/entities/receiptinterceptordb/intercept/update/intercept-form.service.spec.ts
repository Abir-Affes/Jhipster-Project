import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../intercept.test-samples';

import { InterceptFormService } from './intercept-form.service';

describe('Intercept Form Service', () => {
  let service: InterceptFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterceptFormService);
  });

  describe('Service methods', () => {
    describe('createInterceptFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInterceptFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            receipt_code: expect.any(Object),
            location: expect.any(Object),
          })
        );
      });

      it('passing IIntercept should create a new form with FormGroup', () => {
        const formGroup = service.createInterceptFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            receipt_code: expect.any(Object),
            location: expect.any(Object),
          })
        );
      });
    });

    describe('getIntercept', () => {
      it('should return NewIntercept for default Intercept initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createInterceptFormGroup(sampleWithNewData);

        const intercept = service.getIntercept(formGroup) as any;

        expect(intercept).toMatchObject(sampleWithNewData);
      });

      it('should return NewIntercept for empty Intercept initial value', () => {
        const formGroup = service.createInterceptFormGroup();

        const intercept = service.getIntercept(formGroup) as any;

        expect(intercept).toMatchObject({});
      });

      it('should return IIntercept', () => {
        const formGroup = service.createInterceptFormGroup(sampleWithRequiredData);

        const intercept = service.getIntercept(formGroup) as any;

        expect(intercept).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IIntercept should not enable id FormControl', () => {
        const formGroup = service.createInterceptFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewIntercept should disable id FormControl', () => {
        const formGroup = service.createInterceptFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

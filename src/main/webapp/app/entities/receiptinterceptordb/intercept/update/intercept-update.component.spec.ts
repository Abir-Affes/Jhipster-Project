import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InterceptFormService } from './intercept-form.service';
import { InterceptService } from '../service/intercept.service';
import { IIntercept } from '../intercept.model';

import { InterceptUpdateComponent } from './intercept-update.component';

describe('Intercept Management Update Component', () => {
  let comp: InterceptUpdateComponent;
  let fixture: ComponentFixture<InterceptUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let interceptFormService: InterceptFormService;
  let interceptService: InterceptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), InterceptUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(InterceptUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InterceptUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    interceptFormService = TestBed.inject(InterceptFormService);
    interceptService = TestBed.inject(InterceptService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const intercept: IIntercept = { id: 456 };

      activatedRoute.data = of({ intercept });
      comp.ngOnInit();

      expect(comp.intercept).toEqual(intercept);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIntercept>>();
      const intercept = { id: 123 };
      jest.spyOn(interceptFormService, 'getIntercept').mockReturnValue(intercept);
      jest.spyOn(interceptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ intercept });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: intercept }));
      saveSubject.complete();

      // THEN
      expect(interceptFormService.getIntercept).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(interceptService.update).toHaveBeenCalledWith(expect.objectContaining(intercept));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIntercept>>();
      const intercept = { id: 123 };
      jest.spyOn(interceptFormService, 'getIntercept').mockReturnValue({ id: null });
      jest.spyOn(interceptService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ intercept: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: intercept }));
      saveSubject.complete();

      // THEN
      expect(interceptFormService.getIntercept).toHaveBeenCalled();
      expect(interceptService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIntercept>>();
      const intercept = { id: 123 };
      jest.spyOn(interceptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ intercept });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(interceptService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

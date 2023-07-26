import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TerminalFormService } from './terminal-form.service';
import { TerminalService } from '../service/terminal.service';
import { ITerminal } from '../terminal.model';

import { TerminalUpdateComponent } from './terminal-update.component';

describe('Terminal Management Update Component', () => {
  let comp: TerminalUpdateComponent;
  let fixture: ComponentFixture<TerminalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let terminalFormService: TerminalFormService;
  let terminalService: TerminalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TerminalUpdateComponent],
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
      .overrideTemplate(TerminalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TerminalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    terminalFormService = TestBed.inject(TerminalFormService);
    terminalService = TestBed.inject(TerminalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const terminal: ITerminal = { id: 456 };

      activatedRoute.data = of({ terminal });
      comp.ngOnInit();

      expect(comp.terminal).toEqual(terminal);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITerminal>>();
      const terminal = { id: 123 };
      jest.spyOn(terminalFormService, 'getTerminal').mockReturnValue(terminal);
      jest.spyOn(terminalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ terminal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: terminal }));
      saveSubject.complete();

      // THEN
      expect(terminalFormService.getTerminal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(terminalService.update).toHaveBeenCalledWith(expect.objectContaining(terminal));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITerminal>>();
      const terminal = { id: 123 };
      jest.spyOn(terminalFormService, 'getTerminal').mockReturnValue({ id: null });
      jest.spyOn(terminalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ terminal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: terminal }));
      saveSubject.complete();

      // THEN
      expect(terminalFormService.getTerminal).toHaveBeenCalled();
      expect(terminalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITerminal>>();
      const terminal = { id: 123 };
      jest.spyOn(terminalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ terminal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(terminalService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

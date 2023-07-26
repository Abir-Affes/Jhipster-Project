import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReceiptFormService } from './receipt-form.service';
import { ReceiptService } from '../service/receipt.service';
import { IReceipt } from '../receipt.model';
import { ITerminal } from 'app/entities/receiptconstructordb/terminal/terminal.model';
import { TerminalService } from 'app/entities/receiptconstructordb/terminal/service/terminal.service';
import { ICard } from 'app/entities/receiptconstructordb/card/card.model';
import { CardService } from 'app/entities/receiptconstructordb/card/service/card.service';

import { ReceiptUpdateComponent } from './receipt-update.component';

describe('Receipt Management Update Component', () => {
  let comp: ReceiptUpdateComponent;
  let fixture: ComponentFixture<ReceiptUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let receiptFormService: ReceiptFormService;
  let receiptService: ReceiptService;
  let terminalService: TerminalService;
  let cardService: CardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ReceiptUpdateComponent],
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
      .overrideTemplate(ReceiptUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReceiptUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    receiptFormService = TestBed.inject(ReceiptFormService);
    receiptService = TestBed.inject(ReceiptService);
    terminalService = TestBed.inject(TerminalService);
    cardService = TestBed.inject(CardService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Terminal query and add missing value', () => {
      const receipt: IReceipt = { id: 456 };
      const terminal_id: ITerminal = { id: 31624 };
      receipt.terminal_id = terminal_id;

      const terminalCollection: ITerminal[] = [{ id: 8353 }];
      jest.spyOn(terminalService, 'query').mockReturnValue(of(new HttpResponse({ body: terminalCollection })));
      const additionalTerminals = [terminal_id];
      const expectedCollection: ITerminal[] = [...additionalTerminals, ...terminalCollection];
      jest.spyOn(terminalService, 'addTerminalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ receipt });
      comp.ngOnInit();

      expect(terminalService.query).toHaveBeenCalled();
      expect(terminalService.addTerminalToCollectionIfMissing).toHaveBeenCalledWith(
        terminalCollection,
        ...additionalTerminals.map(expect.objectContaining)
      );
      expect(comp.terminalsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Card query and add missing value', () => {
      const receipt: IReceipt = { id: 456 };
      const card_id: ICard = { id: 32071 };
      receipt.card_id = card_id;

      const cardCollection: ICard[] = [{ id: 4116 }];
      jest.spyOn(cardService, 'query').mockReturnValue(of(new HttpResponse({ body: cardCollection })));
      const additionalCards = [card_id];
      const expectedCollection: ICard[] = [...additionalCards, ...cardCollection];
      jest.spyOn(cardService, 'addCardToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ receipt });
      comp.ngOnInit();

      expect(cardService.query).toHaveBeenCalled();
      expect(cardService.addCardToCollectionIfMissing).toHaveBeenCalledWith(
        cardCollection,
        ...additionalCards.map(expect.objectContaining)
      );
      expect(comp.cardsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const receipt: IReceipt = { id: 456 };
      const terminal_id: ITerminal = { id: 15965 };
      receipt.terminal_id = terminal_id;
      const card_id: ICard = { id: 17568 };
      receipt.card_id = card_id;

      activatedRoute.data = of({ receipt });
      comp.ngOnInit();

      expect(comp.terminalsSharedCollection).toContain(terminal_id);
      expect(comp.cardsSharedCollection).toContain(card_id);
      expect(comp.receipt).toEqual(receipt);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReceipt>>();
      const receipt = { id: 123 };
      jest.spyOn(receiptFormService, 'getReceipt').mockReturnValue(receipt);
      jest.spyOn(receiptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ receipt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: receipt }));
      saveSubject.complete();

      // THEN
      expect(receiptFormService.getReceipt).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(receiptService.update).toHaveBeenCalledWith(expect.objectContaining(receipt));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReceipt>>();
      const receipt = { id: 123 };
      jest.spyOn(receiptFormService, 'getReceipt').mockReturnValue({ id: null });
      jest.spyOn(receiptService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ receipt: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: receipt }));
      saveSubject.complete();

      // THEN
      expect(receiptFormService.getReceipt).toHaveBeenCalled();
      expect(receiptService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReceipt>>();
      const receipt = { id: 123 };
      jest.spyOn(receiptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ receipt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(receiptService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTerminal', () => {
      it('Should forward to terminalService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(terminalService, 'compareTerminal');
        comp.compareTerminal(entity, entity2);
        expect(terminalService.compareTerminal).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCard', () => {
      it('Should forward to cardService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(cardService, 'compareCard');
        comp.compareCard(entity, entity2);
        expect(cardService.compareCard).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

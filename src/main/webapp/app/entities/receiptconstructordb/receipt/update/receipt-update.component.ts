import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReceiptFormService, ReceiptFormGroup } from './receipt-form.service';
import { IReceipt } from '../receipt.model';
import { ReceiptService } from '../service/receipt.service';
import { ITerminal } from 'app/entities/receiptconstructordb/terminal/terminal.model';
import { TerminalService } from 'app/entities/receiptconstructordb/terminal/service/terminal.service';
import { ICard } from 'app/entities/receiptconstructordb/card/card.model';
import { CardService } from 'app/entities/receiptconstructordb/card/service/card.service';
import { trans_type } from 'app/entities/enumerations/trans-type.model';
import { result } from 'app/entities/enumerations/result.model';

@Component({
  standalone: true,
  selector: 'jhi-receipt-update',
  templateUrl: './receipt-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReceiptUpdateComponent implements OnInit {
  isSaving = false;
  receipt: IReceipt | null = null;
  trans_typeValues = Object.keys(trans_type);
  resultValues = Object.keys(result);

  terminalsSharedCollection: ITerminal[] = [];
  cardsSharedCollection: ICard[] = [];

  editForm: ReceiptFormGroup = this.receiptFormService.createReceiptFormGroup();

  constructor(
    protected receiptService: ReceiptService,
    protected receiptFormService: ReceiptFormService,
    protected terminalService: TerminalService,
    protected cardService: CardService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTerminal = (o1: ITerminal | null, o2: ITerminal | null): boolean => this.terminalService.compareTerminal(o1, o2);

  compareCard = (o1: ICard | null, o2: ICard | null): boolean => this.cardService.compareCard(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ receipt }) => {
      this.receipt = receipt;
      if (receipt) {
        this.updateForm(receipt);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const receipt = this.receiptFormService.getReceipt(this.editForm);
    if (receipt.id !== null) {
      this.subscribeToSaveResponse(this.receiptService.update(receipt));
    } else {
      this.subscribeToSaveResponse(this.receiptService.create(receipt));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReceipt>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(receipt: IReceipt): void {
    this.receipt = receipt;
    this.receiptFormService.resetForm(this.editForm, receipt);

    this.terminalsSharedCollection = this.terminalService.addTerminalToCollectionIfMissing<ITerminal>(
      this.terminalsSharedCollection,
      receipt.terminal_id
    );
    this.cardsSharedCollection = this.cardService.addCardToCollectionIfMissing<ICard>(this.cardsSharedCollection, receipt.card_id);
  }

  protected loadRelationshipsOptions(): void {
    this.terminalService
      .query()
      .pipe(map((res: HttpResponse<ITerminal[]>) => res.body ?? []))
      .pipe(
        map((terminals: ITerminal[]) =>
          this.terminalService.addTerminalToCollectionIfMissing<ITerminal>(terminals, this.receipt?.terminal_id)
        )
      )
      .subscribe((terminals: ITerminal[]) => (this.terminalsSharedCollection = terminals));

    this.cardService
      .query()
      .pipe(map((res: HttpResponse<ICard[]>) => res.body ?? []))
      .pipe(map((cards: ICard[]) => this.cardService.addCardToCollectionIfMissing<ICard>(cards, this.receipt?.card_id)))
      .subscribe((cards: ICard[]) => (this.cardsSharedCollection = cards));
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IReceipt } from '../receipt.model';
import { ReceiptService } from '../service/receipt.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './receipt-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ReceiptDeleteDialogComponent {
  receipt?: IReceipt;

  constructor(protected receiptService: ReceiptService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.receiptService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'card',
        data: { pageTitle: 'Cards' },
        loadChildren: () => import('./receiptconstructordb/card/card.routes'),
      },
      {
        path: 'terminal',
        data: { pageTitle: 'Terminals' },
        loadChildren: () => import('./receiptconstructordb/terminal/terminal.routes'),
      },
      {
        path: 'receipt',
        data: { pageTitle: 'Receipts' },
        loadChildren: () => import('./receiptconstructordb/receipt/receipt.routes'),
      },
      {
        path: 'intercept',
        data: { pageTitle: 'Intercepts' },
        loadChildren: () => import('./receiptinterceptordb/intercept/intercept.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}

import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ReceiptDetailComponent } from './receipt-detail.component';

describe('Receipt Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ReceiptDetailComponent,
              resolve: { receipt: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(ReceiptDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load receipt on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ReceiptDetailComponent);

      // THEN
      expect(instance.receipt).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

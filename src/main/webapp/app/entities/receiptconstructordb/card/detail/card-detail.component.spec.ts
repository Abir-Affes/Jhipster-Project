import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CardDetailComponent } from './card-detail.component';

describe('Card Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CardDetailComponent,
              resolve: { card: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(CardDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load card on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CardDetailComponent);

      // THEN
      expect(instance.card).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

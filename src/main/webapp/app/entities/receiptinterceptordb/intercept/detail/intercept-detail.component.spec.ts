import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InterceptDetailComponent } from './intercept-detail.component';

describe('Intercept Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterceptDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: InterceptDetailComponent,
              resolve: { intercept: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(InterceptDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load intercept on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InterceptDetailComponent);

      // THEN
      expect(instance.intercept).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

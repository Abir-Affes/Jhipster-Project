import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TerminalDetailComponent } from './terminal-detail.component';

describe('Terminal Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: TerminalDetailComponent,
              resolve: { terminal: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(TerminalDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load terminal on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TerminalDetailComponent);

      // THEN
      expect(instance.terminal).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

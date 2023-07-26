import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITerminal } from '../terminal.model';
import { TerminalService } from '../service/terminal.service';

export const terminalResolve = (route: ActivatedRouteSnapshot): Observable<null | ITerminal> => {
  const id = route.params['id'];
  if (id) {
    return inject(TerminalService)
      .find(id)
      .pipe(
        mergeMap((terminal: HttpResponse<ITerminal>) => {
          if (terminal.body) {
            return of(terminal.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default terminalResolve;

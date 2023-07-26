import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIntercept } from '../intercept.model';
import { InterceptService } from '../service/intercept.service';

export const interceptResolve = (route: ActivatedRouteSnapshot): Observable<null | IIntercept> => {
  const id = route.params['id'];
  if (id) {
    return inject(InterceptService)
      .find(id)
      .pipe(
        mergeMap((intercept: HttpResponse<IIntercept>) => {
          if (intercept.body) {
            return of(intercept.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default interceptResolve;

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIntercept, NewIntercept } from '../intercept.model';

export type PartialUpdateIntercept = Partial<IIntercept> & Pick<IIntercept, 'id'>;

export type EntityResponseType = HttpResponse<IIntercept>;
export type EntityArrayResponseType = HttpResponse<IIntercept[]>;

@Injectable({ providedIn: 'root' })
export class InterceptService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/intercepts', 'receiptinterceptordb');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(intercept: NewIntercept): Observable<EntityResponseType> {
    return this.http.post<IIntercept>(this.resourceUrl, intercept, { observe: 'response' });
  }

  update(intercept: IIntercept): Observable<EntityResponseType> {
    return this.http.put<IIntercept>(`${this.resourceUrl}/${this.getInterceptIdentifier(intercept)}`, intercept, { observe: 'response' });
  }

  partialUpdate(intercept: PartialUpdateIntercept): Observable<EntityResponseType> {
    return this.http.patch<IIntercept>(`${this.resourceUrl}/${this.getInterceptIdentifier(intercept)}`, intercept, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IIntercept>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IIntercept[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInterceptIdentifier(intercept: Pick<IIntercept, 'id'>): number {
    return intercept.id;
  }

  compareIntercept(o1: Pick<IIntercept, 'id'> | null, o2: Pick<IIntercept, 'id'> | null): boolean {
    return o1 && o2 ? this.getInterceptIdentifier(o1) === this.getInterceptIdentifier(o2) : o1 === o2;
  }

  addInterceptToCollectionIfMissing<Type extends Pick<IIntercept, 'id'>>(
    interceptCollection: Type[],
    ...interceptsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const intercepts: Type[] = interceptsToCheck.filter(isPresent);
    if (intercepts.length > 0) {
      const interceptCollectionIdentifiers = interceptCollection.map(interceptItem => this.getInterceptIdentifier(interceptItem)!);
      const interceptsToAdd = intercepts.filter(interceptItem => {
        const interceptIdentifier = this.getInterceptIdentifier(interceptItem);
        if (interceptCollectionIdentifiers.includes(interceptIdentifier)) {
          return false;
        }
        interceptCollectionIdentifiers.push(interceptIdentifier);
        return true;
      });
      return [...interceptsToAdd, ...interceptCollection];
    }
    return interceptCollection;
  }
}

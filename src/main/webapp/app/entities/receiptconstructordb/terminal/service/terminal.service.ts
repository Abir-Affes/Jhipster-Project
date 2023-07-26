import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITerminal, NewTerminal } from '../terminal.model';

export type PartialUpdateTerminal = Partial<ITerminal> & Pick<ITerminal, 'id'>;

export type EntityResponseType = HttpResponse<ITerminal>;
export type EntityArrayResponseType = HttpResponse<ITerminal[]>;

@Injectable({ providedIn: 'root' })
export class TerminalService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/terminals', 'receiptconstructordb');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(terminal: NewTerminal): Observable<EntityResponseType> {
    return this.http.post<ITerminal>(this.resourceUrl, terminal, { observe: 'response' });
  }

  update(terminal: ITerminal): Observable<EntityResponseType> {
    return this.http.put<ITerminal>(`${this.resourceUrl}/${this.getTerminalIdentifier(terminal)}`, terminal, { observe: 'response' });
  }

  partialUpdate(terminal: PartialUpdateTerminal): Observable<EntityResponseType> {
    return this.http.patch<ITerminal>(`${this.resourceUrl}/${this.getTerminalIdentifier(terminal)}`, terminal, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITerminal>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITerminal[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTerminalIdentifier(terminal: Pick<ITerminal, 'id'>): number {
    return terminal.id;
  }

  compareTerminal(o1: Pick<ITerminal, 'id'> | null, o2: Pick<ITerminal, 'id'> | null): boolean {
    return o1 && o2 ? this.getTerminalIdentifier(o1) === this.getTerminalIdentifier(o2) : o1 === o2;
  }

  addTerminalToCollectionIfMissing<Type extends Pick<ITerminal, 'id'>>(
    terminalCollection: Type[],
    ...terminalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const terminals: Type[] = terminalsToCheck.filter(isPresent);
    if (terminals.length > 0) {
      const terminalCollectionIdentifiers = terminalCollection.map(terminalItem => this.getTerminalIdentifier(terminalItem)!);
      const terminalsToAdd = terminals.filter(terminalItem => {
        const terminalIdentifier = this.getTerminalIdentifier(terminalItem);
        if (terminalCollectionIdentifiers.includes(terminalIdentifier)) {
          return false;
        }
        terminalCollectionIdentifiers.push(terminalIdentifier);
        return true;
      });
      return [...terminalsToAdd, ...terminalCollection];
    }
    return terminalCollection;
  }
}

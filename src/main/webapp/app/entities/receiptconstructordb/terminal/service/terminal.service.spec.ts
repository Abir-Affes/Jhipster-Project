import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITerminal } from '../terminal.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../terminal.test-samples';

import { TerminalService } from './terminal.service';

const requireRestSample: ITerminal = {
  ...sampleWithRequiredData,
};

describe('Terminal Service', () => {
  let service: TerminalService;
  let httpMock: HttpTestingController;
  let expectedResult: ITerminal | ITerminal[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TerminalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Terminal', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const terminal = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(terminal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Terminal', () => {
      const terminal = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(terminal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Terminal', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Terminal', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Terminal', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTerminalToCollectionIfMissing', () => {
      it('should add a Terminal to an empty array', () => {
        const terminal: ITerminal = sampleWithRequiredData;
        expectedResult = service.addTerminalToCollectionIfMissing([], terminal);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(terminal);
      });

      it('should not add a Terminal to an array that contains it', () => {
        const terminal: ITerminal = sampleWithRequiredData;
        const terminalCollection: ITerminal[] = [
          {
            ...terminal,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTerminalToCollectionIfMissing(terminalCollection, terminal);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Terminal to an array that doesn't contain it", () => {
        const terminal: ITerminal = sampleWithRequiredData;
        const terminalCollection: ITerminal[] = [sampleWithPartialData];
        expectedResult = service.addTerminalToCollectionIfMissing(terminalCollection, terminal);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(terminal);
      });

      it('should add only unique Terminal to an array', () => {
        const terminalArray: ITerminal[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const terminalCollection: ITerminal[] = [sampleWithRequiredData];
        expectedResult = service.addTerminalToCollectionIfMissing(terminalCollection, ...terminalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const terminal: ITerminal = sampleWithRequiredData;
        const terminal2: ITerminal = sampleWithPartialData;
        expectedResult = service.addTerminalToCollectionIfMissing([], terminal, terminal2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(terminal);
        expect(expectedResult).toContain(terminal2);
      });

      it('should accept null and undefined values', () => {
        const terminal: ITerminal = sampleWithRequiredData;
        expectedResult = service.addTerminalToCollectionIfMissing([], null, terminal, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(terminal);
      });

      it('should return initial array if no Terminal is added', () => {
        const terminalCollection: ITerminal[] = [sampleWithRequiredData];
        expectedResult = service.addTerminalToCollectionIfMissing(terminalCollection, undefined, null);
        expect(expectedResult).toEqual(terminalCollection);
      });
    });

    describe('compareTerminal', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTerminal(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTerminal(entity1, entity2);
        const compareResult2 = service.compareTerminal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTerminal(entity1, entity2);
        const compareResult2 = service.compareTerminal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTerminal(entity1, entity2);
        const compareResult2 = service.compareTerminal(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

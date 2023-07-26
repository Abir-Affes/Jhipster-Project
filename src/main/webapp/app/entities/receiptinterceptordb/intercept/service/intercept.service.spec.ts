import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IIntercept } from '../intercept.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../intercept.test-samples';

import { InterceptService } from './intercept.service';

const requireRestSample: IIntercept = {
  ...sampleWithRequiredData,
};

describe('Intercept Service', () => {
  let service: InterceptService;
  let httpMock: HttpTestingController;
  let expectedResult: IIntercept | IIntercept[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InterceptService);
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

    it('should create a Intercept', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const intercept = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(intercept).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Intercept', () => {
      const intercept = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(intercept).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Intercept', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Intercept', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Intercept', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInterceptToCollectionIfMissing', () => {
      it('should add a Intercept to an empty array', () => {
        const intercept: IIntercept = sampleWithRequiredData;
        expectedResult = service.addInterceptToCollectionIfMissing([], intercept);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(intercept);
      });

      it('should not add a Intercept to an array that contains it', () => {
        const intercept: IIntercept = sampleWithRequiredData;
        const interceptCollection: IIntercept[] = [
          {
            ...intercept,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInterceptToCollectionIfMissing(interceptCollection, intercept);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Intercept to an array that doesn't contain it", () => {
        const intercept: IIntercept = sampleWithRequiredData;
        const interceptCollection: IIntercept[] = [sampleWithPartialData];
        expectedResult = service.addInterceptToCollectionIfMissing(interceptCollection, intercept);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(intercept);
      });

      it('should add only unique Intercept to an array', () => {
        const interceptArray: IIntercept[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const interceptCollection: IIntercept[] = [sampleWithRequiredData];
        expectedResult = service.addInterceptToCollectionIfMissing(interceptCollection, ...interceptArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const intercept: IIntercept = sampleWithRequiredData;
        const intercept2: IIntercept = sampleWithPartialData;
        expectedResult = service.addInterceptToCollectionIfMissing([], intercept, intercept2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(intercept);
        expect(expectedResult).toContain(intercept2);
      });

      it('should accept null and undefined values', () => {
        const intercept: IIntercept = sampleWithRequiredData;
        expectedResult = service.addInterceptToCollectionIfMissing([], null, intercept, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(intercept);
      });

      it('should return initial array if no Intercept is added', () => {
        const interceptCollection: IIntercept[] = [sampleWithRequiredData];
        expectedResult = service.addInterceptToCollectionIfMissing(interceptCollection, undefined, null);
        expect(expectedResult).toEqual(interceptCollection);
      });
    });

    describe('compareIntercept', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareIntercept(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareIntercept(entity1, entity2);
        const compareResult2 = service.compareIntercept(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareIntercept(entity1, entity2);
        const compareResult2 = service.compareIntercept(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareIntercept(entity1, entity2);
        const compareResult2 = service.compareIntercept(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

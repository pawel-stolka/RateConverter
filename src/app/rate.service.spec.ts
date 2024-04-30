import { TestBed } from '@angular/core/testing';
import { RateService } from './rate.service';

describe('RateService', () => {
  let service: RateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an array of at least 3 currencies', (done: DoneFn) => {
    service.getCurrencies$().subscribe((currencies) => {
      expect(currencies).toBeTruthy();
      expect(currencies.length).toBeGreaterThanOrEqual(3);
      done();
    });
  });

  it('should ensure all currencies have a rate', (done: DoneFn) => {
    service.getCurrencies$().subscribe((currencies) => {
      const allHaveRates = currencies.every((c) => typeof c.rate === 'number');
      expect(allHaveRates).toBeTrue();
      done();
    });
  });
});

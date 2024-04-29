import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Currency {
  name: string;
  rate: number;
}

@Injectable({
  providedIn: 'root',
})
export class RateService {
  private currencies = [
    { name: 'USD', rate: 0.25 },
    { name: 'EUR', rate: 0.22 },
    { name: 'GBP', rate: 0.18 },
  ];

  MIN_AMOUNT = 0;
  MAX_AMOUNT = 10_000;

  constructor(/*private http: HttpClient*/) {} // extendable in future...

  getCurrencies(): Observable<Currency[]> {
    // TODO: to be replaced with with HTTP request (via i.e. Observables)
    return of(this.currencies);
  }
}

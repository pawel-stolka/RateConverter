import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Currency, RateService } from '../rate.service';
import { Subject, takeUntil } from 'rxjs';

// ------------------------------------------------------------
// Changing currency at the end doesn't recalculates values
// 1. not required
// 2. additional considerations needed, i.e. which amount should be taken, etc.
// ------------------------------------------------------------

@Component({
  selector: 'app-rate-converter2',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf, NgIf, AsyncPipe],
  templateUrl: './rate-converter.component.html',
  styleUrl: './rate-converter.component.scss',
})
export class RateConverterComponent implements OnInit, OnDestroy {
  MIN_AMOUNT = this.rateService.MIN_AMOUNT;
  MAX_AMOUNT = this.rateService.MAX_AMOUNT;

  form: FormGroup = this.fb.group({
    selectedCurrency: [null],
    amountPLN: [
      null,
      [Validators.min(this.MIN_AMOUNT), Validators.max(this.MAX_AMOUNT)],
    ],
    amountForeign: [null],
  });

  currencies: Currency[] = [];
  showCurrencyList = false;

  private destroy$ = new Subject<void>(); // instead of | async

  get selectedCurrency() {
    return this.form.get('selectedCurrency');
  }

  get amountPLN() {
    return this.form.get('amountPLN');
  }

  get amountForeign() {
    return this.form.get('amountForeign');
  }

  get selectedCurrencyName(): string {
    const currency = this.currencies.find(
      ({ name }) => name === this.selectedCurrency?.value
    );
    return currency?.name ?? 'Currency';
  }

  get selectedCurrencySymbol(): string {
    const currency = this.currencies.find(
      ({ name }) => name === this.selectedCurrency?.value
    );
    return currency?.symbol ?? '';
  }

  constructor(private fb: FormBuilder, private rateService: RateService) {
    this.form.valueChanges.subscribe(({ selectedCurrency }) => {
      if (!selectedCurrency) return;

      const rate = this.currencies.find(
        ({ name }) => name === selectedCurrency
      )?.rate;
      if (!rate) return;

      if (this.amountPLN?.dirty) {
        this.updateForeignAmount(rate);
      } else if (this.amountForeign?.dirty) {
        this.updatePLNAmount(rate);
      }
    });
  }

  ngOnInit() {
    this.rateService
      .getCurrencies$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((currencies) => {
        this.currencies = currencies;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCurrentRate(): string {
    const currency = this.currencies.find(
      ({ name }) => name === this.selectedCurrency?.value
    );
    return currency ? currency.rate.toFixed(2) : '';
  }

  toggleCurrencyList() {
    this.showCurrencyList = !this.showCurrencyList;
  }

  private updateForeignAmount(rate: number): void {
    const amountForeign = this.amountPLN?.value * rate;
    this.form.patchValue({ amountForeign }, { emitEvent: false }); // Prevent infinite loop
    this.amountPLN?.markAsPristine();
  }

  private updatePLNAmount(rate: number): void {
    const amountPLN = this.amountForeign?.value / rate;
    this.form.patchValue({ amountPLN }, { emitEvent: false });
    this.amountForeign?.markAsPristine();
  }
}

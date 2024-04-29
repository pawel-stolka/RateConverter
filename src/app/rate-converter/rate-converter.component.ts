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

@Component({
  selector: 'app-rate-converter2',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf, NgIf, AsyncPipe],
  templateUrl: './rate-converter.component.html',
  styleUrl: './rate-converter.component.scss',
})
export class RateConverterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  currencies: Currency[] = [];
  MAX_AMOUNT = this.rateService.MAX_AMOUNT;

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

  getCurrentRate(): string {
    const currency = this.currencies.find(
      ({ name }) => name === this.selectedCurrency?.value
    );
    return currency ? currency.rate.toFixed(2) : '';
  }

  constructor(private fb: FormBuilder, private rateService: RateService) {
    const { MIN_AMOUNT } = rateService;
    this.form = this.fb.group({
      selectedCurrency: [null],
      amountPLN: [
        null,
        [Validators.min(MIN_AMOUNT), Validators.max(this.MAX_AMOUNT)],
      ],
      amountForeign: [null],
    });

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
      .getCurrencies()
      .pipe(takeUntil(this.destroy$))
      .subscribe((currencies) => {
        this.currencies = currencies;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

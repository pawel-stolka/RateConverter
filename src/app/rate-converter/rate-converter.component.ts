import { NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-rate-converter2',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf, NgIf],
  templateUrl: './rate-converter.component.html',
  styleUrl: './rate-converter.component.scss',
})
export class RateConverterComponent {
  form: FormGroup;
  currencies = [
    { name: 'USD', rate: 0.25 },
    { name: 'EUR', rate: 0.22 },
    { name: 'GBP', rate: 0.18 },
  ];

  MAXIMUM_AMOUNT = 10_000;

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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selectedCurrency: [null],
      amountPLN: [null, [Validators.max(this.MAXIMUM_AMOUNT)]],
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

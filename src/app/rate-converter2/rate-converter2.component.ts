import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-rate-converter2',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf],
  templateUrl: './rate-converter2.component.html',
  styleUrl: './rate-converter2.component.scss'
})
export class RateConverter2Component {
  form: FormGroup;
  currencies = [
    { name: 'USD', rate: 0.25 },
    { name: 'EUR', rate: 0.22 },
    { name: 'GBP', rate: 0.18 }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selectedCurrency: [null],
      amountPLN: [null],
      amountForeign: [null]
    });

    this.form.valueChanges.subscribe(val => {
      if (val.selectedCurrency && val.amountPLN !== null) {
        this.calculateForeignAmount();
      }
    });
  }

  private calculateForeignAmount(): void {
    const rate = this.currencies.find(c => c.name === this.form.value.selectedCurrency)?.rate;
    if (rate) {
      const foreignAmount = this.form.value.amountPLN * rate;
      this.form.patchValue({
        amountForeign: foreignAmount
      }, { emitEvent: false }); // Prevent infinite loop
    }
  }
}

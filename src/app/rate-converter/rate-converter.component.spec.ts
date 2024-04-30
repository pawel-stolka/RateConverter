import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RateConverterComponent } from './rate-converter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { RateService } from '../rate.service';

describe('RateConverterComponent', () => {
  let component: RateConverterComponent;
  let fixture: ComponentFixture<RateConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        {
          provide: RateService,
          useValue: {
            getCurrencies$: () => of([{ name: 'USD', rate: 0.25 }]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RateConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form with correct initial values', () => {
    const component = TestBed.createComponent(
      RateConverterComponent
    ).componentInstance;
    const form = component.form;

    expect(form).toBeTruthy();
    expect(component.selectedCurrency?.value).toBeNull();
    expect(component.amountPLN?.value).toBeNull();
    expect(component.amountForeign?.value).toBeNull();
  });

  it('should fetch currencies from the service on init', () => {
    const rateService = TestBed.inject(RateService);
    const spy = spyOn(rateService, 'getCurrencies$').and.returnValue(
      of([{ name: 'USD', rate: 0.25 }])
    );
    component.ngOnInit();

    expect(spy.calls.any()).toBe(true);
    expect(component.currencies.length).toBeGreaterThan(0);
  });

  it('should toggle currency list visibility', () => {
    const component = TestBed.createComponent(
      RateConverterComponent
    ).componentInstance;
    expect(component.showCurrencyList).toBeFalsy();

    component.toggleCurrencyList();
    expect(component.showCurrencyList).toBeTruthy();

    component.toggleCurrencyList();
    expect(component.showCurrencyList).toBeFalsy();
  });
});

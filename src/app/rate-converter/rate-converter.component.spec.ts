import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateConverterComponent } from './rate-converter.component';

describe('RateConverterComponent', () => {
  let component: RateConverterComponent;
  let fixture: ComponentFixture<RateConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateConverterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RateConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

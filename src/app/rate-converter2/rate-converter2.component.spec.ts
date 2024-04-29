import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateConverter2Component } from './rate-converter2.component';

describe('RateConverter2Component', () => {
  let component: RateConverter2Component;
  let fixture: ComponentFixture<RateConverter2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateConverter2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RateConverter2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceTripComponent } from './price-trip.component';

describe('PriceTripComponent', () => {
  let component: PriceTripComponent;
  let fixture: ComponentFixture<PriceTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneBookingComponent } from './phone-booking.component';

describe('PhoneBookingComponent', () => {
  let component: PhoneBookingComponent;
  let fixture: ComponentFixture<PhoneBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

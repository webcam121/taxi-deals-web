import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectBookingComponent } from './direct-booking.component';

describe('DirectBookingComponent', () => {
  let component: DirectBookingComponent;
  let fixture: ComponentFixture<DirectBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

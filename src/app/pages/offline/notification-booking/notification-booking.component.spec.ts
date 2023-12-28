import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationBookingComponent } from './notification-booking.component';

describe('NotificationBookingComponent', () => {
  let component: NotificationBookingComponent;
  let fixture: ComponentFixture<NotificationBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

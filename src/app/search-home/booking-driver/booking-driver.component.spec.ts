import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDriverComponent } from './booking-driver.component';

describe('BookingDriverComponent', () => {
  let component: BookingDriverComponent;
  let fixture: ComponentFixture<BookingDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

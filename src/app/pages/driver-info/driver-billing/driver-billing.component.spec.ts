import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverBillingComponent } from './driver-billing.component';

describe('DriverBillingComponent', () => {
  let component: DriverBillingComponent;
  let fixture: ComponentFixture<DriverBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

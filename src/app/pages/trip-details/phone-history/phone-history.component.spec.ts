import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneHistoryComponent } from './phone-history.component';

describe('PhoneHistoryComponent', () => {
  let component: PhoneHistoryComponent;
  let fixture: ComponentFixture<PhoneHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

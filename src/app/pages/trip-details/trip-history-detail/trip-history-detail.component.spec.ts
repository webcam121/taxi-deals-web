import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripHistoryDetailComponent } from './trip-history-detail.component';

describe('TripHistoryDetailComponent', () => {
  let component: TripHistoryDetailComponent;
  let fixture: ComponentFixture<TripHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

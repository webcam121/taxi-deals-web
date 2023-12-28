import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineOfflineComponent } from './online-offline.component';

describe('OnlineOfflineComponent', () => {
  let component: OnlineOfflineComponent;
  let fixture: ComponentFixture<OnlineOfflineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineOfflineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

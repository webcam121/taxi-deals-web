import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TripDetailsRoutingModule } from './trip-details-routing.module';
import { TripInfoComponent } from './trip-info/trip-info.component';
import { TripHistoryComponent } from './trip-history/trip-history.component';
import { TripDetailsComponent } from './trip-details.component';
import { TripHistoryModule } from './trip-history/trip-history.module';
import { TripInfoModule } from './trip-info/trip-info.module';
import { TripServices } from './_services/_trip.component.services';
import { TripHistoryDetailModule } from './trip-history-detail/trip-history-detail.module';
import { PhoneHistoryComponent } from './phone-history/phone-history.component';
import { PhoneHistoryModule } from './phone-history/phone-history.module';

@NgModule({
  declarations: [TripDetailsComponent],
  imports: [
    CommonModule,
    TripDetailsRoutingModule,
    TripHistoryModule,
    TripInfoModule,
    TripHistoryDetailModule,
    PhoneHistoryModule
  ],
  providers: [TripServices]
})
export class TripDetailsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationBookingRoutingModule } from './notification-booking-routing.module';
import { NotificationBookingComponent } from './notification-booking.component';
import { AgmCoreModule } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { createTranslateLoader } from 'src/app/app.module';
import { ControlMessagesModule } from 'src/app/shared';

@NgModule({
  declarations: [NotificationBookingComponent],
  imports: [
    CommonModule,
    NotificationBookingRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ControlMessagesModule,
    AgmCoreModule,
    InternationalPhoneNumberModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ]
})
export class NotificationBookingModule { }

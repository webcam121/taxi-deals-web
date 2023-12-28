import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingDriverRoutingModule } from './booking-driver-routing.module';
import { BookingDriverComponent } from './booking-driver.component';
import { AgmCoreModule } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { RatingModule } from 'ng-starrating';
import { DpDatePickerModule } from 'ng2-date-picker';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { createTranslateLoader } from 'src/app/app.module';
import { ControlMessagesModule } from 'src/app/shared';

@NgModule({
  declarations: [BookingDriverComponent],
  imports: [
    CommonModule,
    BookingDriverRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ControlMessagesModule,
    AgmCoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    RatingModule,
    DpDatePickerModule,
    DateTimePickerModule,
    InternationalPhoneNumberModule
  ],
  providers: [],
})
export class BookingDriverModule { }

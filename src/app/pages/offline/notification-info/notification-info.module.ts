import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationInfoRoutingModule } from './notification-info-routing.module';
import { AgmCoreModule } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { createTranslateLoader } from 'src/app/app.module';
import { ControlMessagesModule } from 'src/app/shared';
import { NotificationInfoComponent } from './notification-info.component';

@NgModule({
  declarations: [NotificationInfoComponent],
  imports: [
    CommonModule,
    NotificationInfoRoutingModule,
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
export class NotificationInfoModule { }

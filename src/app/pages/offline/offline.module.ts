import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfflineRoutingModule } from './offline-routing.module';
import { OfflineComponent } from './offline.component';
import { OfflineBookingModule } from './offline-booking/offline-booking.module';
import { OfflineBookSmsModule } from './offline-book-sms/offline-book-sms.module';
import { NotificationsService } from 'angular2-notifications';
import { OfflineService } from './_services/_offline.component.services';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from '../pages.module';
import { HttpClient } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { MessagingService } from 'src/app/@core/services/messaging.service';
import { MessageBookingComponent } from './message-booking/message-booking.component';
import { MessageBookingModule } from './message-booking/message-booking.module';
import { NotificationInfoComponent } from './notification-info/notification-info.component';
import { NotificationInfoModule } from './notification-info/notification-info.module';
import { NotificationBookingComponent } from './notification-booking/notification-booking.component';
import { NotificationBookingModule } from './notification-booking/notification-booking.module';

@NgModule({
  declarations: [OfflineComponent],
  imports: [
    CommonModule,
    OfflineRoutingModule,
    OfflineBookingModule,
    OfflineBookSmsModule,
    MessageBookingModule,
    NotificationInfoModule,
    NotificationBookingModule
  ],
  providers: [OfflineService, MessagingService]
})
export class OfflineModule { }

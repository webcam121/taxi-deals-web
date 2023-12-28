import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverInfoRoutingModule } from './driver-info-routing.module';
import { DriverInfoComponent } from './driver-info.component';
import { AddNewDriverModule } from './add-new-driver/add-new-driver.module';
import { DriverStatusModule } from './driver-status/driver-status.module';
import { DriverToptupModule } from './driver-toptup/driver-toptup.module';
import { DashboardServices } from '../dashboard/_services/_dashboard.component.services';
import { DriverServices } from './_services/_driver-info.component.services';
import { VehicleStatusModule } from '../vehicle-status/vehicle-status.module';
import { DriverListComponent } from './driver-list/driver-list.component';
import { DriverListModule } from './driver-list/driver-list.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from '../pages.module';
import { HttpClient } from '@angular/common/http';
import { DriverBillingModule } from './driver-billing/driver-billing.module';
import { DriverDetailsComponent } from './driver-details/driver-details.component';

// import { AgGridModule } from 'ag-grid-angular';
import { DriverDetailsModule } from './driver-details/driver-details.module';


@NgModule({
  declarations: [DriverInfoComponent],
  imports: [
    CommonModule,
    DriverInfoRoutingModule,
    AddNewDriverModule,
    DriverStatusModule,
    DriverToptupModule,
    DriverBillingModule,
    VehicleStatusModule,
    DriverDetailsModule,
    DriverListModule,
       TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [DashboardServices, DriverServices]
})
export class DriverInfoModule { }

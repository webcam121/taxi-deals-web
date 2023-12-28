
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { DriverBillingRoutingModule } from './driver-billing-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VehicleStatusModule } from '../../vehicle-status/vehicle-status.module';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { PaginationModule } from 'ngx-bootstrap';
import { SharedPipesModule } from 'src/app/@core/pipes/shared-pipes.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgGridModule } from 'ag-grid-angular';
import { DriverBillingComponent } from './driver-billing.component';

@NgModule({
  declarations: [DriverBillingComponent],
  imports: [
    CommonModule,
    DriverBillingRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    VehicleStatusModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places']
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    PaginationModule,
    Ng2OrderModule,
    SharedPipesModule,
    NgbModalModule,
    NgxPaginationModule,
    AgmJsMarkerClustererModule,
    AgGridModule.withComponents([])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class DriverBillingModule { }

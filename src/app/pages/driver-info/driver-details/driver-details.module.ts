import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverDetailsRoutingModule } from './driver-details-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehicleStatusModule } from '../../vehicle-status/vehicle-status.module';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule } from 'src/app/@core/pipes/shared-pipes.module';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { PaginationModule } from 'ngx-bootstrap';
import { DriverDetailsComponent } from './driver-details.component';

@NgModule({
  declarations: [DriverDetailsComponent],
  imports: [
    CommonModule,
    DriverDetailsRoutingModule,
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
export class DriverDetailsModule { }

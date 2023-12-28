import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingDetailsRoutingModule } from './booking-details-routing.module';
import { BookingDetailsComponent } from './booking-details.component';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { PaginationModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedPipesModule } from 'src/app/@core/pipes/shared-pipes.module';
import { createTranslateLoader } from 'src/app/app.module';

@NgModule({
  declarations: [BookingDetailsComponent],
  imports: [
    CommonModule,
    BookingDetailsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
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
    NgxPaginationModule
  ]
})
export class BookingDetailsModule { }

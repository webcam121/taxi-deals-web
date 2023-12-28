import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceTripRoutingModule } from './price-trip-routing.module';
import { PriceTripComponent } from './price-trip.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ControlMessagesModule } from 'src/app/shared';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from '../pages.module';
import { HttpClient } from '@angular/common/http';
import { PaginationModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [PriceTripComponent],
  imports: [
    CommonModule,
    PriceTripRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ControlMessagesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    PaginationModule
  ]
})
export class PriceTripModule { }

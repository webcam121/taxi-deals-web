import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingDetailsComponent } from './booking-details.component';

const routes: Routes = [{
  path: '',
  component: BookingDetailsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingDetailsRoutingModule { }

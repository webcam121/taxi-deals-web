import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhoneBookingComponent } from './phone-booking.component';

const routes: Routes = [{
  path: '',
  component: PhoneBookingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhoneBookingRoutingModule { }

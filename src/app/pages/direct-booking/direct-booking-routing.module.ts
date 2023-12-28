import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirectBookingComponent } from './direct-booking.component';

const routes: Routes = [{
  path: '',
  component: DirectBookingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectBookingRoutingModule { }

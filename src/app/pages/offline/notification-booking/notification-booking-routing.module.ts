import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationBookingComponent } from './notification-booking.component';

const routes: Routes = [{
  path: '',
  component: NotificationBookingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationBookingRoutingModule { }

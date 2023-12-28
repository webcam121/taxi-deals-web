import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingDriverComponent } from './booking-driver.component';

const routes: Routes = [{
  path: '',
  component: BookingDriverComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingDriverRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverDetailsComponent } from './driver-details.component';

const routes: Routes = [{
  path:'',
  component: DriverDetailsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverDetailsRoutingModule { }

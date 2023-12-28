import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverBillingComponent } from './driver-billing.component';
import { AuthGuard } from 'src/app/@core/guard';
const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverBillingRoutingModule { }

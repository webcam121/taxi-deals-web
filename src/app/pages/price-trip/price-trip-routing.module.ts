import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceTripComponent } from './price-trip.component';

const routes: Routes = [{
  path: '',
  component: PriceTripComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceTripRoutingModule { }

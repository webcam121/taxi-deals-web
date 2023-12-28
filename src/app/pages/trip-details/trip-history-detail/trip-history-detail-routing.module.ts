import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TripHistoryDetailComponent } from './trip-history-detail.component';

const routes: Routes = [{
  path: '',
  component: TripHistoryDetailComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripHistoryDetailRoutingModule { }

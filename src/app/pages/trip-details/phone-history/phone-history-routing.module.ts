import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhoneHistoryComponent } from './phone-history.component';

const routes: Routes = [{
  path: '',
  component: PhoneHistoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhoneHistoryRoutingModule { }

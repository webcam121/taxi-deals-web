import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationInfoComponent } from './notification-info.component';

const routes: Routes = [{
  path: '',
  component: NotificationInfoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationInfoRoutingModule { }

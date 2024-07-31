import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UmbralPage } from './umbral.page';

const routes: Routes = [
  {
    path: '',
    component: UmbralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UmbralPageRoutingModule {}

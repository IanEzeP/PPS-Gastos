import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DischargePage } from './discharge.page';

const routes: Routes = [
  {
    path: '',
    component: DischargePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DischargePageRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DischargePageRoutingModule } from './discharge-routing.module';

import { DischargePage } from './discharge.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DischargePageRoutingModule
  ],
  declarations: [DischargePage]
})
export class DischargePageModule {}

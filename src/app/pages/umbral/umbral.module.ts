import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UmbralPageRoutingModule } from './umbral-routing.module';

import { UmbralPage } from './umbral.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UmbralPageRoutingModule
  ],
  declarations: [UmbralPage]
})
export class UmbralPageModule {}

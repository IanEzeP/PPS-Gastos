import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GraphsPageRoutingModule } from './graphs-routing.module';
import { GraphsPage } from './graphs.page';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraphsPageRoutingModule,
    CanvasJSAngularChartsModule
  ],
  declarations: [GraphsPage]
})
export class GraphsPageModule {}

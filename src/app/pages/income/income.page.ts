import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-income',
  templateUrl: './income.page.html',
  styleUrls: ['./income.page.scss'],
})
export class IncomePage implements OnInit {

  public data: any;
  public fecha: Date = new Date();
  public ingreso: any | number = '';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  cargar() {
    this.data = {
      mes: this.fecha.getMonth() + 1,
      anio: this.fecha.getFullYear(),
      ingreso: this.ingreso
    };

    return this.modalCtrl.dismiss(this.data, 'accept');
  }

  cancelar() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}

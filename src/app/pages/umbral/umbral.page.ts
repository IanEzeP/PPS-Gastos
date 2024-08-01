import { Component, OnInit } from '@angular/core';
import { ModalController, RangeCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-umbral',
  templateUrl: './umbral.page.html',
  styleUrls: ['./umbral.page.scss'],
})
export class UmbralPage implements OnInit {

  public data: any;
  public umbral: any = '';
  public fecha: Date = new Date();

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  onIonInput(ev: Event) {
    this.umbral = (ev as RangeCustomEvent).detail.value;
  }

  cargar() {
    this.data = {
      mes: this.fecha.getMonth() + 1,
      anio: this.fecha.getFullYear(),
      umbral: this.umbral
    };

    return this.modalCtrl.dismiss(this.data, 'accept');
  }

  cancelar() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}

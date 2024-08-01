import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-discharge',
  templateUrl: './discharge.page.html',
  styleUrls: ['./discharge.page.scss'],
})
export class DischargePage implements OnInit {

  public data: any;
  public importe: number = 0;
  public categoria: any = '';
  public fecha: Date = new Date();

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  onIonChange(e: any) {
    this.categoria = e.target.value;
  }

  cargar() {
    this.data = {
      mes: this.fecha.getMonth() + 1,
      anio: this.fecha.getFullYear(),
      importe: this.importe,
      categoria: this.categoria
    };

    return this.modalCtrl.dismiss(this.data, 'accept');
  }

  cancelar() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}

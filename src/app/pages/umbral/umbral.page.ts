import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-umbral',
  templateUrl: './umbral.page.html',
  styleUrls: ['./umbral.page.scss'],
})
export class UmbralPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  goBack() {
    return this.modalCtrl.dismiss();
  }
}

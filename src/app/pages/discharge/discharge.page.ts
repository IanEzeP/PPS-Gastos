import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-discharge',
  templateUrl: './discharge.page.html',
  styleUrls: ['./discharge.page.scss'],
})
export class DischargePage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  goBack() {
    return this.modalCtrl.dismiss();
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { Subscription, map } from 'rxjs';
import Swal from 'sweetalert2';

import { IncomePage } from '../income/income.page';
import { DischargePage } from '../discharge/discharge.page';
import { UmbralPage } from '../umbral/umbral.page';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  /**
   * 1. Cargar sueldo/ingreso mensual <-- Cargo en BD objeto con importe de ingreso, mes y año (Si ya está cargado, preguntar si quiere actualizarlo)
   * 2. Poder establecer un umbral de gasto mensual (porcentual respecto al ingreso mensual) <-- Sería como un piso que no debe ser mayor al ingreso mensual, que se tiene que mostrar en porcentaje y que tiene que avisar cuando es superado
   * 3. Poder cargar gastos/egresos en el mes (con categoría) <-- Cargo en BD objeto con el mes y año y un array que guarde categoría e importe.
   * 4. 
   *  a- Visualizar gráfico de gastos en el mes, en grafico de torta dividido por categoría.
   *  b- Visualizar gráfico de gastos y ahorro anual, en gráfico de barras.
   */

  public sueldoCargado: boolean = false;
  public umbralCargado: boolean = false;
  public gastosCargados: boolean = false;
  public sueldoMensual: any = 0;
  public umbralMensual: any = 0;
  public gastosMensuales: any = 0;

  private usersGastos: Array<any> = [];
  private subsGastos: Subscription = Subscription.EMPTY;

  constructor(private auth: AuthService, private router: Router, private firestore: AngularFirestore,
    private data: DatabaseService, private modalCtrl: ModalController) {}

  ngOnInit(): void {
    console.log('Entro en home');

    const obsGastos = this.data.getCollectionSnapshot('gastos-usuarios')!.pipe(
      map((actions) => actions.map((a) => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return {id, ...data};
      })
    ));

    this.subsGastos = obsGastos.subscribe((data: any[]) => {
      this.usersGastos = data;
      console.log(this.usersGastos);
      let userInDB = this.usersGastos.find(doc => doc.idUsuario == this.auth.id);

      if (userInDB != undefined) {
        this.cargarDataMes(userInDB);
      } else {
        const newId = this.firestore.createId();
        const doc = this.firestore.doc("gastos-usuarios/" + newId);
        doc.set({
          idUsuario: this.auth.id,
          sueldo: [],
          umbral: [],
          gastos: []
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subsGastos.unsubscribe();
  }

  cargarDataMes(user: any) {
    let fecha = new Date();
    let ultSueldo = user.sueldo.pop();
    let ultUmbral = user.umbral.pop();
    let ultGastos = user.gastos.pop();

    if (ultSueldo != undefined && ultSueldo.mes == (fecha.getMonth() + 1) && ultSueldo.anio == fecha.getFullYear()) {
      this.sueldoMensual = ultSueldo; 
      this.sueldoCargado = true;
    }
    if (ultUmbral != undefined && ultUmbral.mes == (fecha.getMonth() + 1) && ultUmbral.anio == fecha.getFullYear()) {
      this.umbralMensual = ultUmbral; 
      this.umbralCargado = true;
    }
    if (ultGastos != undefined && ultGastos.mes == (fecha.getMonth() + 1) && ultGastos.anio == fecha.getFullYear()) {
      this.gastosMensuales = ultGastos; 
      this.gastosCargados = true;
    }
  }

  async openModal(option: string) {
    let component : any;
    switch (option) {
      case 'ingreso':
        component = IncomePage;//seetAlert preguntando si quiere actualizar el sueldo (CASO QUE ESTÉ CARGADO)
        break;
      case 'egreso':
        component = DischargePage;
        break;
      case 'umbral':
        component = UmbralPage;
        break;
    }

    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: { 
        cargoSueldo: this.sueldoCargado,
        sueldo: this.sueldoMensual,
        cargoUmbral: this.umbralCargado,
        umbral: this.umbralMensual
      }
    });
    
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    
    if(role != 'cancel') {
      this.updateUser(option, data);
    }
  }

  updateUser(action: string, data: any) {
    let userInDB = this.usersGastos.find(doc => doc.idUsuario == this.auth.id);

    if (userInDB != undefined) {
      let newData = {};
      let nuevoEgreso: any;

      switch (action) {
        case 'ingreso':
          this.sueldoMensual = data;
          if (this.sueldoCargado) {
            this.usersGastos.findIndex(sueldo => sueldo.mes == this.sueldoMensual.mes && sueldo.anio == this.sueldoMensual.anio);
            let index = userInDB.sueldo.findIndex((sueldo: any) => sueldo.mes == this.sueldoMensual.mes && sueldo.anio == this.sueldoMensual.anio);
            console.log(index);
            if(index > -1) {
              userInDB.sueldo[index] = this.sueldoMensual;
              newData = { sueldo: userInDB.sueldo };
            } else {
              newData = { sueldo: userInDB.sueldo.push(this.sueldoMensual) };
            }
          } else {
            newData = { sueldo: userInDB.sueldo.push(this.sueldoMensual) };
            this.sueldoCargado = true;
          }
          break;
        case 'egreso':
          nuevoEgreso = data;
          newData = { gastos: userInDB.gastos.push(this.sueldoMensual) };
          break;
        case 'umbral':
          this.umbralCargado = true;
          this.umbralMensual = data;
          newData = { umbral: userInDB.umbral.push(this.umbralMensual) };
          break;
      }
    }
  }

  navigate() {
    this.router.navigateByUrl('/graphs');
  }

  cerraSesion() {
    Swal.fire({
      heightAuto: false,
      title: '¿Cerrar Sesión?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.logOut().then(() => this.router.navigateByUrl('/login'));
      }
    });
  }
}

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

    this.subsGastos = obsGastos.subscribe(((data: any[]) => {
      this.sueldoCargado = false;
      this.umbralCargado = false;
      this.gastosCargados = false;
      this.sueldoMensual = 0;
      this.umbralMensual = 0;
      this.gastosMensuales = 0;
      this.usersGastos = [];
      this.usersGastos = data;
      console.log(this.usersGastos);
      let userInDB = this.usersGastos.find(doc => doc.idUsuario == this.auth.id);

      if (userInDB != undefined) {
        this.cargarDataMes(userInDB);
      } else {
        if (this.auth.logueado) {
          const newId = this.firestore.createId();
          const doc = this.firestore.doc("gastos-usuarios/" + newId);
          doc.set({
            idUsuario: this.auth.id,
            sueldo: [],
            umbral: [],
            gastos: []
          });
        }
      }
    }));
  }

  ngOnDestroy(): void {
    this.subsGastos.unsubscribe();
  }

  cargarDataMes(user: any) {
    let fecha = new Date();
    let auxUser = { gastos: user.gastos, sueldo: user.sueldo, umbral: user.umbral};
    let ultSueldo = auxUser.sueldo[auxUser.sueldo.length - 1];
    let ultUmbral = auxUser.umbral[auxUser.sueldo.length - 1];
    let ultGastos = auxUser.gastos[auxUser.sueldo.length - 1];

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
    let component : any = '';
    switch (option) {
      case 'ingreso':
        if (this.sueldoCargado) {
          await Swal.fire({
          heightAuto: false,
          title: 'Su sueldo ya se encuentra cargado',
          text: '¿Desea actualizar el importe?',
          showConfirmButton: true,
          confirmButtonText: 'Si',
          showCancelButton: true,
          cancelButtonText: 'Cancelar'
          }).then(res => {
            if (res.isConfirmed) {
              component = IncomePage;
            }
          });
        } else {
          component = IncomePage;
        }        
        break;
      case 'egreso':
        component = DischargePage;
        break;
      case 'umbral':
        if (this.umbralCargado) {
          await Swal.fire({
          heightAuto: false,
          title: 'El umbral ya fue establecido',
          text: '¿Desea cambiarlo?',
          showConfirmButton: true,
          confirmButtonText: 'Si',
          showCancelButton: true,
          cancelButtonText: 'Cancelar'
          }).then(res => {
            if (res.isConfirmed) {
              component = UmbralPage;
            }
          });
        } else {
          component = UmbralPage;
        }   
        break;
    }

    if(component != '') {
      const modal = await this.modalCtrl.create({
        component: component
      });
      
      modal.present();
  
      const { data, role } = await modal.onWillDismiss();
      
      if(role != 'cancel') {
        this.updateUser(option, data);
      }
    }
  }

  updateUser(action: string, data: any) {
    let userInDB = this.usersGastos.find(doc => doc.idUsuario == this.auth.id);

    if (userInDB != undefined) {
      let newData = {};

      switch (action) {
        case 'ingreso':
          this.sueldoMensual = data;
          if (this.sueldoCargado) {//Este sería el caso en que el ingreso ya estaba cargado pero decido actualizarlo
            let index = userInDB.sueldo.findIndex((sueldo: any) => sueldo.mes == this.sueldoMensual.mes && sueldo.anio == this.sueldoMensual.anio);
            console.log(index);//Verificacion
            if (index > -1) {
              userInDB.sueldo[index] = this.sueldoMensual;
              newData = { sueldo: userInDB.sueldo };
            } else {
              userInDB.sueldo.push(this.sueldoMensual)
              newData = { sueldo: userInDB.sueldo };
            }
          } else {
            userInDB.sueldo.push(this.sueldoMensual);
            newData = { sueldo: userInDB.sueldo };
            this.sueldoCargado = true;
          }
          break;
        case 'egreso':
          if (this.gastosCargados) {
            let index = userInDB.gastos.findIndex((gasto: any) => gasto.mes == data.mes && gasto.anio == data.anio);
            console.log(index);
            if (index > -1) {
              userInDB.gastos[index].egresos.push({ importe: data.importe, categoria: data.categoria});
              newData = { gastos: userInDB.gastos };
            } else {
              this.gastosMensuales = { mes: data.mes, anio: data.anio, egresos: [{importe: data.importe, categoria: data.categoria}]}
              userInDB.gastos.push(this.gastosMensuales);
              newData = { gastos: userInDB.gastos };
            }
          } else {
            this.gastosMensuales = { mes: data.mes, anio: data.anio, egresos: [{importe: data.importe, categoria: data.categoria}]}
            userInDB.gastos.push(this.gastosMensuales);
            newData = { gastos: userInDB.gastos };
            this.gastosCargados = true;
          }
          break;
        case 'umbral':
          this.umbralMensual = data;
          if (this.umbralCargado) {
            let index = userInDB.umbral.findIndex((umbral: any) => umbral.mes == this.umbralMensual.mes && umbral.anio == this.umbralMensual.anio);
            console.log(index);
            if (index > -1) {
              userInDB.umbral[index] = this.umbralMensual;
              newData = { umbral: userInDB.umbral };
            } else {
              userInDB.umbral.push(this.umbralMensual);
              newData = { umbral: userInDB.umbral };
            }
          } else {
            userInDB.umbral.push(this.umbralMensual);
            newData = { umbral: userInDB.umbral };
            this.umbralCargado = true;
          }
          break;
      }

      const doc = this.firestore.doc("gastos-usuarios/" + userInDB.id);
      doc.update(newData);
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.page.html',
  styleUrls: ['./graphs.page.scss'],
})

export class GraphsPage implements OnInit, OnDestroy {

  public viewPieChart: boolean = true;
  public gastosMensuales: Array<any> = [];
  public arrayUsers: Array<any> = [];
  public userDataDB: any;
  public mesNum: number = 0;
  public anio: number = 0;
  public meses: Array<string> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  private subsDatabase: Subscription = Subscription.EMPTY;
  public seriesPie : Array<any> = [];
  public seriesCol1 : Array<any> = [];
  public seriesCol2 : Array<any> = [];
  public ahorrosAnuales: Array<any> = [];

  constructor(private router: Router, private data: DatabaseService, private auth: AuthService) { }

  ngOnInit() {
    console.log("Entro en gráficos");
      
    this.subsDatabase = this.data.getCollectionObservable('gastos-usuarios').subscribe((next: any) => {
      this.arrayUsers = next;
      this.userDataDB = this.arrayUsers.find(user => user.idUsuario == this.auth.id);
      this.gastosMensuales = [];

      let fecha = new Date();
      this.mesNum = fecha.getMonth() + 1;
      this.anio = fecha.getFullYear();

      this.gastosMensuales = this.userDataDB.gastos.find((gasto: any) => gasto.mes == this.mesNum && gasto.anio == this.anio).egresos;
      console.log(this.gastosMensuales);
      this.cargarGastos();
      this.cargarAnual();
      console.log("finalizo carga");
    });
  }

  ngOnDestroy(): void {
    this.subsDatabase.unsubscribe();
  }

  onChangeChart(selection: any) {
    if(selection.target.value == 'gasto')
    {
      this.viewPieChart = true;
    }
    else
    {
      this.viewPieChart = false;
    }
  }

  onButtonChart(value: any) {
    if(value == 'gasto') {
      this.viewPieChart = true;
    } else {
      this.viewPieChart = false;
    }
  }

  cargarGastos() {
    this.seriesPie = [];
    //let gastosCategorizados = [];
    const groupedObjects: Record<string, number> = {};
  
    this.gastosMensuales.forEach(obj => {
      groupedObjects[obj.categoria] = (groupedObjects[obj.categoria] || 0) + obj.importe;
    });

    for (const [key, value] of Object.entries(groupedObjects)) {
      console.log(`Key: ${key}, Value: ${value}`);
      
      if (value > 0) {
        this.seriesPie.push({ 
          y: value, 
          name: key.toUpperCase(),
          //id: element.id_foto
        });
      }
    }
    this.updateChart();
  }

  cargarAnual() {
    this.seriesCol1 = [];
    this.seriesCol2 = [];
    let gastosAnuales: Array<any> = this.userDataDB.gastos;
    let sueldosAnuales: Array<any> = this.userDataDB.sueldo;

    gastosAnuales.forEach(gastoRes => {
      let totalEgresos = 0;

      gastoRes.egresos.forEach((egreso: any) => {
        totalEgresos += egreso.importe;
      });
      
      if (gastoRes.egresos.length > 0) {
        this.seriesCol1.push({
          label: this.meses[gastoRes.mes -1],
          y: totalEgresos,
          //id: element.id_foto 
        });
      }
    });

    sueldosAnuales.forEach(sueldoRes => {
      
      if (sueldoRes.ingreso > 0) {
        this.seriesCol2.push({
          label: this.meses[sueldoRes.mes -1],
          y: sueldoRes.ingreso,
          //id: element.id_foto 
        });
      }
    });

    this.seriesCol2.forEach(inMes => {
      let ingreso = inMes.y;
      let mes = inMes.label;

      let coincidencia = this.seriesCol1.find(egMes => egMes.label == mes);
      if(coincidencia != undefined) {
        this.ahorrosAnuales.push({ mes: mes, ahorro: ingreso - coincidencia.y});
      }
    });


    this.updateChart();
  }

  getChartInstance(chart : Object) {
    this.chart = chart;
    this.updateChart();
  }

  updateChart() { 
    if (this.viewPieChart) {
      this.chart.options.data[0].dataPoints = this.seriesPie;
    } else {
      this.chart.options.data[0].dataPoints = this.seriesCol1;
      this.chart.options.data[1].dataPoints = this.seriesCol2;
    }

      this.chart.render();
      const elementoCanva = document.querySelector(".canvasjs-chart-credit");
      elementoCanva?.remove();
    
  }

  private chart : any;

  public chartOptionsPie = {
    theme: "light1",
	  data: [{
      //click: (e : any) => this.onClickResult(e),
      type: "pie",
      startAngle: -45,
      indexLabel: "{name}: ${y}",
      dataPoints: [
		  ]
	  }]
	}

  public chartOptionsCol = {
    animationEnabled: true,
    theme: "light1",
    axisX: { labelAngle: 0 },
    toolTip: {
      shared: true
    },
    data: [{
      //click: (e : any) => this.onClickResult(e),
      type: "column",
      name: "Gasto mensual",
	    legendText: "Gastos mensuales",
	    showInLegend: true, 
      dataPoints: [
      ]
    },
    {
      //click: (e : any) => this.onClickResult(e),
      type: "column",
      name: "Sueldo mensual",
	    legendText: "Sueldos mensuales",
	    showInLegend: true,
      dataPoints: [
      ]
    }]
  }

  goBack() {
    this.router.navigateByUrl('/home')
  }
}

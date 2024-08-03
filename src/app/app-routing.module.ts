import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'anim-splash',
    pathMatch: 'full'
  },
  {
    path: 'graphs',
    loadChildren: () => import('./pages/graphs/graphs.module').then( m => m.GraphsPageModule)
  },
  {
    path: 'income',
    loadChildren: () => import('./pages/income/income.module').then( m => m.IncomePageModule)
  },
  {
    path: 'discharge',
    loadChildren: () => import('./pages/discharge/discharge.module').then( m => m.DischargePageModule)
  },
  {
    path: 'umbral',
    loadChildren: () => import('./pages/umbral/umbral.module').then( m => m.UmbralPageModule)
  },
  {
    path: 'anim-splash',
    loadChildren: () => import('./anim-splash/anim-splash.module').then( m => m.AnimSplashPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

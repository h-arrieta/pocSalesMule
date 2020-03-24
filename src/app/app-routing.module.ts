import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CardComponent } from './pages/card/card.component';
import { DetailsComponent } from './pages/details/details.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {
    path: 'card',
    component: CardComponent
  },
  {
    path: 'card',
    redirectTo: '/card',
    pathMatch: 'full'
  },
  {
    path: 'details',
    component: DetailsComponent
  },
  {
  path: 'details',
  redirectTo: '/details',
  pathMatch: 'full'
},
{
  path: 'login',
  component: LoginComponent
},
{
path: '',
redirectTo: '/login',
pathMatch: 'full'
},
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes,  { preloadingStrategy: PreloadAllModules } )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

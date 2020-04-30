import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

const routes: Routes = [
    {
        path: '',
        component: HomePage,
        canActivate: [AngularFireAuthGuard]
    },
    {
        path: 'login',
        component: LoginPage
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

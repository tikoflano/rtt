import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { RaceComponent } from './views/race/race.component';

const routes: Routes = [
  {
    path: 'login',
    title: 'Race Time Tracker - Login',
    component: LoginComponent,
  },
  { path: 'race', component: RaceComponent },
  {
    path: 'notFound',
    title: 'Race Time Tracker - Not Found',
    component: NotFoundComponent,
  },
  { path: '**', redirectTo: '/notFound' }, // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

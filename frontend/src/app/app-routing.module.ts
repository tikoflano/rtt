import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RaceComponent } from './views/race/race.component';

const routes: Routes = [
  { path: 'race', component: RaceComponent },
  { path: '**', redirectTo: '/race' }, // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

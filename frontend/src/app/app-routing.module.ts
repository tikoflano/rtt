import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RaceComponent } from './views/race/race.component';
import { TimerComponent } from './components/timer/timer.component';

const routes: Routes = [
  { path: 'race', component: RaceComponent },
  { path: 'timer', component: TimerComponent },
  { path: '**', component: AppComponent }, // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

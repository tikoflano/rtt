import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RaceComponent } from './views/race/race.component';
import { TimerComponent } from './components/timer/timer.component';
import { ToolBarComponent } from './components/tool-bar/tool-bar.component';
import { DurationPipe } from './pipes/duration.pipe';
import { HttpClientModule } from '@angular/common/http';
import { ServerTimeSyncService } from './services/server-time-sync.service';

@NgModule({
  declarations: [
    AppComponent,
    RaceComponent,
    TimerComponent,
    ToolBarComponent,
    DurationPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatSliderModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  providers: [ServerTimeSyncService],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { ServerTimeServiceService } from './services/server-time.service';
import { DescentService } from './services/descent.service';
import { ClientDatePipe } from './pipes/client-date.pipe';
import { DateDiffPipe } from './pipes/date-diff.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RaceComponent,
    TimerComponent,
    ToolBarComponent,
    DurationPipe,
    ClientDatePipe,
    DateDiffPipe,
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
  providers: [
    // https://stackoverflow.com/a/41614974/974822s
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ServerTimeServiceService],
      useFactory: (serverTimeServiceService: ServerTimeServiceService) => () =>
        null,
    },
    ServerTimeServiceService,
    DescentService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

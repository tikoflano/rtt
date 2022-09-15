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
import {
  HttpClientModule,
  HttpClientXsrfModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { ServerTimeServiceService } from './services/server-time.service';
import { DescentService } from './services/descent.service';
import { ClientDatePipe } from './pipes/client-date.pipe';
import { DateDiffPipe } from './pipes/date-diff.pipe';
import { DescentStatusToTimerStatusPipe } from './pipes/descent-status-to-timer-status.pipe';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { LoginComponent } from './views/login/login.component';
import { Router } from '@angular/router';
import { AuthInterceptor } from './services/auth.interceptor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AutofocusDirective } from './directives/autofocus.directive';

@NgModule({
  declarations: [
    AppComponent,
    RaceComponent,
    TimerComponent,
    ToolBarComponent,
    DurationPipe,
    ClientDatePipe,
    DateDiffPipe,
    DescentStatusToTimerStatusPipe,
    NotFoundComponent,
    LoginComponent,
    AutofocusDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFTOKEN',
    }),
    AppRoutingModule,
    MatSliderModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
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
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: function (router: Router) {
        return new AuthInterceptor(router);
      },
      multi: true,
      deps: [Router],
    },
    ServerTimeServiceService,
    DescentService,
    ClientDatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

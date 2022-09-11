import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { TimerService } from './services/timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public loadingTimer$: Observable<boolean>;

  constructor(private timerService: TimerService) {}

  ngOnInit(): void {
    this.loadingTimer$ = this.timerService.getTimer().pipe(
      first(),
      map(() => false),
      startWith(true)
    );
  }
}

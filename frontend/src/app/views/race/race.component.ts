import { Component, OnInit } from '@angular/core';
import { Descent } from 'app/models/descent.model';
import { DescentService } from 'app/services/descent.service';
import { ServerTimeServiceService } from 'app/services/server-time.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss'],
})
export class RaceComponent implements OnInit {
  public readonly displayedColumns = ['number', 'name', 'timer'];

  public descents$: Observable<Descent[]>;
  public loading$: Observable<boolean>;
  public error$: Observable<string>;

  public serverOffset$: Observable<number>;

  constructor(
    private serverTimeServiceService: ServerTimeServiceService,
    private descentService: DescentService
  ) {}

  ngOnInit(): void {
    this.descents$ = this.descentService.getDescents();
    this.loading$ = this.descentService.getLoading();
    this.error$ = this.descentService.getError();

    this.serverOffset$ = this.serverTimeServiceService.getServerOffset();

    // this.serverOffset$.subscribe((offset) => alert(offset));

    this.descentService.loadDescents(1);
  }

  sendTime(element: { number: number; name: string }, txt: any): void {
    console.log(element.name, txt);
  }
}

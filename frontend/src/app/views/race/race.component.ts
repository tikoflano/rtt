import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss'],
})
export class RaceComponent implements OnInit {
  public readonly displayedColumns = ['number', 'name', 'timer'];
  public readonly dataSource = [
    { number: 1, name: 'TIKO Flaño' },
    { number: 2, name: 'Benja Flaño' },
    { number: 3, name: 'Alvaro Flaño' },
  ];

  ngOnInit(): void {}

  sendTime(element: { number: number; name: string }, txt: any): void {
    console.log(element.name, txt);
  }
}

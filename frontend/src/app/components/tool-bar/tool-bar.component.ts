import { Component, OnInit } from '@angular/core';
import { ServerTimeServiceService } from 'app/services/server-time.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
})
export class ToolBarComponent implements OnInit {
  public offset$: Observable<number>;

  constructor(private serverTimeServiceService: ServerTimeServiceService) {}

  ngOnInit(): void {
    this.offset$ = this.serverTimeServiceService.getServerOffset();
  }
}

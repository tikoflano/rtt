import { Component, OnInit } from '@angular/core';
import { ServerTimeSyncService } from 'src/app/services/server-time-sync.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
})
export class ToolBarComponent implements OnInit {
  constructor(serverTimeSyncService: ServerTimeSyncService) {}

  ngOnInit(): void {}
}

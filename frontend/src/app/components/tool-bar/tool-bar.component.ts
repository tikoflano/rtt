import { Component, OnInit } from '@angular/core';
import { ServerTimeServiceService } from 'app/services/server-time.service';
import { UserService } from 'app/services/user.service';
import { Observable } from 'rxjs';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton, MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-tool-bar',
    templateUrl: './tool-bar.component.html',
    styleUrls: ['./tool-bar.component.scss'],
    imports: [MatToolbar, MatIconButton, MatIcon, MatAnchor, AsyncPipe]
})
export class ToolBarComponent implements OnInit {
  public offset$: Observable<number>;
  public authenticated$: Observable<boolean>;

  constructor(
    private serverTimeServiceService: ServerTimeServiceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.offset$ = this.serverTimeServiceService.getServerOffset();
    this.authenticated$ = this.userService.getIsAuthenticated();
  }
}

import { Component, OnInit } from '@angular/core';
import { ServerTimeServiceService } from 'app/services/server-time.service';
import { UserService } from 'app/services/user.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-tool-bar',
    templateUrl: './tool-bar.component.html',
    styleUrls: ['./tool-bar.component.scss'],
    standalone: false
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

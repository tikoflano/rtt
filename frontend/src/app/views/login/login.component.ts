import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginInfo } from 'app/models/login-info.model';
import { UserService } from 'app/services/user.service';
import { catchError, finalize, of, Subscription } from 'rxjs';

interface ErrorResponse {
  error: string;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {
  private subs: Subscription = new Subscription();
  public model: LoginInfo = { username: '', password: '' };
  public hide = true;
  public loading = false;
  public error = '';

  @ViewChild('loginForm') loginForm: NgForm;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userServiceSub = this.userService
      .getIsAuthenticated()
      .subscribe((authenticated) => {
        if (authenticated) {
          const nextRoute = this.route.snapshot.queryParamMap.get('next');
          this.router.navigateByUrl(nextRoute ?? '/race');
        }
      });

    this.subs.add(userServiceSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.userService
      .login(this.loginForm.value as LoginInfo)
      .pipe(
        catchError((err: HttpErrorResponse) => of(err.error)),
        finalize(() => (this.loading = false))
      )
      .subscribe((resp: ErrorResponse | null) => {
        if (resp) {
          this.error = resp.error;
        }
      });
  }
}

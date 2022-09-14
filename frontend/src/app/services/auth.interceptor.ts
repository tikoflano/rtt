import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// https://stackoverflow.com/a/46017463/974822
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401 || err.status === 403) {
      let options = {};
      if (this.router.url.indexOf('/login') !== 0) {
        options = {
          queryParams: { next: this.router.url },
        };
      }

      this.router.navigate(['/login'], options);

      return of(EMPTY);
    }

    return throwError(() => err);
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next
      .handle(request)
      .pipe(catchError((x) => this.handleAuthError(x)));
  }
}

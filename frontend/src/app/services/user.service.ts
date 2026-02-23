import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { share } from 'rxjs';
import { User } from 'app/models/user.model';
import { LoginInfo } from 'app/models/login-info.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userInfo$: Subject<User> = new Subject();
  private isAuthenticated$: Subject<boolean> = new Subject();

  constructor(private http: HttpClient) {
    this.loadUserInfo();
  }

  public loadUserInfo() {
    this.http.get<User>('/api/users/me/').subscribe((userInfo) => {
      this.userInfo$.next(userInfo);
      this.isAuthenticated$.next(true);
    });
  }

  public getUserInfo() {
    return this.userInfo$.asObservable();
  }

  public logout() {
    this.isAuthenticated$.next(false);
  }

  public getIsAuthenticated() {
    return this.isAuthenticated$.asObservable();
  }

  public login(loginInfo: LoginInfo) {
    const obs$ = this.http.post('/api/login/', loginInfo).pipe(share());

    obs$.subscribe(() => this.loadUserInfo());

    return obs$;
  }
}

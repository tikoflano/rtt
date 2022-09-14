import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';
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
    this.http.post('/api/login/', loginInfo).subscribe(() => {
      // this.isAuthenticated$.next(true);
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginInfo } from 'app/models/login-info.model';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public model: LoginInfo = { username: '', password: '' };
  public hide = true;

  @ViewChild('loginForm') loginForm: NgForm;

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.userService.login(this.loginForm.value as LoginInfo);
  }
}

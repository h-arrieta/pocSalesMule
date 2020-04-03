import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  
  users = [
    'roberto.clemente@techedgegroup.com.poc',
    'luis.zarzo@techedgegroup.com.poc'
  ];
  username: string;
  password: string;

  constructor(private _sharedService: SharedService, private _router: Router) { 
  }

  ngOnInit() {
    this.username = '';
    this.password = '';
  }



  login() {
    if (this.users.some( user => user===this.username) && this.password != '') {
      this._sharedService.setSharedData({username: this.username});
      this._router.navigateByUrl('/card');
    } 
  }

  updateUsername(val:any) {
    this.username = val;
  }

  updatePassword(val:any) {
    this.password = val;
  }
}

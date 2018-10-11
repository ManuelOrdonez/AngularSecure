import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from '../../services/security.service';
import { PersistenceService, StorageType } from 'angular-persistence';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
  providers: [SecurityService]
})
export class DemoComponent implements OnInit {

  constructor(
    private securityService: SecurityService,
    private persistenceService: PersistenceService,
    private cookieService: CookieService) { }

  token: string;
  tokenEncrypt: string;
  tokenDecrypt: string;
  tokenCookieDecrypt: string;
  tokenSessionDecrypt:string;

  ngOnInit() {

  }

  tryDemo() {
    this.tokenEncrypt = this.securityService.Encrypt(this.token, this.securityService.KeyApp, false);
    this.tokenDecrypt = this.securityService.Decrypt(this.tokenEncrypt, this.securityService.KeyApp);
    this.securityService.persistenceServiceSet('token', this.token, { type: StorageType.SESSION });
    this.tokenSessionDecrypt=this.securityService.persistenceServiceGet('token',{ type: StorageType.SESSION })
  }

  tryDemoNormal() {
    sessionStorage.setItem('token', this.token);
  }

  clean() {
    this.persistenceService.removeAll(StorageType.SESSION);
    this.persistenceService.clean(StorageType.SESSION);
    this.securityService.deleteCookies();
  }

  SetCookie() {
    this.cookieService.set('token', this.token);
    this.securityService.SetCookie('token', this.token);
    this.tokenCookieDecrypt = this.securityService.GetCookie('token');
  }

}

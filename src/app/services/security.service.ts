import { Injectable } from '@angular/core';
import { PersistenceService, StorageType } from 'angular-persistence';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(
    private persistenceService: PersistenceService,
    private cookieService: CookieService) { }

  KeyApp = 'MyKey';


  public SetCookie(name: string , value: string) {

    let valueEncripted = this.Encrypt(value, this.KeyApp, false);
    let cookieName = this.Encrypt(name, this.KeyApp, true);
    this.deleteCookies();

    if (!this.cookieService.check(cookieName)) {
        this.cookieService.set(cookieName, valueEncripted);
    }
    return this.cookieService.get(cookieName);
}


public GetCookie(cookieName: string) {
    let cookieNameEnc = this.Encrypt(cookieName, this.KeyApp, true);
    return this.Decrypt(this.cookieService.get(cookieNameEnc), this.KeyApp);
}


  public Encrypt(Word: string, keyWord: string, IsNameVar: boolean = false): string {

    let ciphertext;
    if (IsNameVar) {
      ciphertext = CryptoJS.MD5(Word, keyWord);
    } else {
      ciphertext = CryptoJS.AES.encrypt(Word, keyWord);
    }
    return ciphertext.toString();
  }

  public Decrypt(Word: string, keyWord: string): string {
    let bytes = CryptoJS.AES.decrypt(Word.toString(), keyWord);
    let plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext.toString();
  }
  public persistenceServiceExist(name: string): boolean {
    let EName = this.Encrypt(name, this.KeyApp, true);
    if (this.persistenceService.get(EName, StorageType.SESSION) == null) {
      return false;
    }
    else {
      return true;
    }
  }
  public persistenceSerivesRemove(key: string) {
    let eKey = this.Encrypt(key, this.KeyApp, true);
    this.persistenceService.remove(eKey, StorageType.SESSION);
  }
  public persistenceServiceSet(name: string, value: string, type: any) {
    let EName = this.Encrypt(name, this.KeyApp, true);
    let Evalue = this.Encrypt(value, this.KeyApp, false);
    this.persistenceService.set(EName, Evalue, { type: StorageType.SESSION });
  }

  public persistenceServiceGet(name: string, type: any) {

    let EName = this.Encrypt(name, this.KeyApp, true);
    if (this.persistenceServiceExist(name)) {

      let EValue = this.persistenceService.get(EName, StorageType.SESSION).toString();
      let DValue = this.Decrypt(EValue, this.KeyApp);
      return DValue;
    }
    else {
      return null;
    }
  }

  public deleteCookies() {
    let allCookies = this.cookieService.getAll();
    for (let key in allCookies) {
        this.cookieService.delete(key);
    }
    this.cookieService.deleteAll();
}

}

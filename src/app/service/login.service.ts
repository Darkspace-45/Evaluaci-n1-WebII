import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  private API_INGRESO = 'http://localhost:3000/users';

  getLogin(): Observable<any> {
    return this.http.get(this.API_INGRESO); {
    }
  }

  postLogin(usuario: any):Observable<any> {
    return this.http.post(this.API_INGRESO, usuario);
  }
}

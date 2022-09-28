import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Login';
  usuario : string = '';
  senha : string = '';

  constructor(private httpClient : HttpClient){

  }

  public login(){
    this.httpClient.post('http://localhost:3017/login', {name : this.usuario, password : this.senha}).toPromise().then((response : any)=> {
      console.log(response);
    })
  }
}

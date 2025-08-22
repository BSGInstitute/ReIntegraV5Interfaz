import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TokenService } from '@shared/services/token.service';
import { UserService } from '@shared/services/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuloGuard implements CanActivateChild {

  modulosUser: {
    url: string
  }[] = [];

  constructor(private tokenService: TokenService, private router: Router, private userService: UserService){

  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if(state.url.includes('FichaAlumno')){
      return true;
    }
    // let modulos = localStorage.getItem('modulos');
    this.modulosUser = this.userService.getModulosUser();
    if(this.modulosUser == null || this.modulosUser.length == 0){
      let modulos = localStorage.getItem('modulos');
      if(modulos != null){
        this.modulosUser = JSON.parse(atob(modulos));
      }
    }
    if(this.modulosUser != null){
      let item = this.modulosUser.findIndex(x => x.url == state.url);
      if(item != -1){
        return true;
      }else{
        this.router.navigate(['']);
        return false;
      }
    }
    this.router.navigate(['']);
    return false;
  }
}

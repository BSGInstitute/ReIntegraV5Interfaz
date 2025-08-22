import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CrmService } from '@shared/services/crm.service';
import { SharedService } from '@shared/services/shared.service';
import { RingoverSDKService } from '@shared/services/ringover-sdk.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-integra',
  templateUrl: './integra.component.html',
  styleUrls: ['./integra.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IntegraComponent implements OnInit {
  constructor(
    private crmService: CrmService,
    private userService: UserService,
    private _sharedService: SharedService,
    private _ringoverSDKService: RingoverSDKService,
  ) {}
  private intervalGetIp: any;
  private intervalGetIp2: any;
  private subscription$: Subscription = new Subscription();
  showCRM: boolean = false;
  varInterval:any;

  ngOnInit(): void {
    if (localStorage.getItem('userData')) {
      this.userService.setUserData(
        JSON.parse(localStorage.getItem('userData'))
      );
    }
    this.crmService.showCRM$.subscribe({
      next: (resp: boolean) => {
        this.showCRM = resp;
      },
    });
    this.userService.getPublicIp();
    this.initSubscribeObservable();
    this.habilitarIntervalo();
    if(this.userService.idPersonal == 213){
      this.habilitarIntervalo2();
    }
  }
  ngOnDestroy(): void {
    this.crmService.showCRM$.next(false);
    this.userService.ipPublica = '-1'
    if(this.intervalGetIp){
      clearInterval(this.intervalGetIp);
    }
    if(this.intervalGetIp2){
      clearInterval(this.intervalGetIp2);
    }
    this.subscription$.unsubscribe();
  }
  private initSubscribeObservable(){
    let sub$ = this.userService.publicIp$.subscribe(resp => {
      if(resp != null){
        this.userService.validarAcceso(resp);
      }
    });
    this.subscription$.add(sub$)
  }
  get showComentarioAgenda$(){
    return this._sharedService.showComentarioAgenda$;
  }
  private habilitarIntervalo(){
    this.intervalGetIp = setInterval(() => {
      this.userService.getPublicIp();
    }, 180000);
  }
  private habilitarIntervalo2(){
    this.intervalGetIp2 = setInterval(() => {
      this.userService.getPublicIpV2();
    }, 5000);
  }
  validarReLogin(){
    this.userService.validarReloginV2();
  }
  toggleRingover(){
    this._ringoverSDKService.toggle();
  }
  get checkStatusRingover(){
    return this._ringoverSDKService.checkStatus();
  }
  get showBtnRingover$() {
    return this.crmService.showBtnRingover$;
  }
 
  
  // countdown = setInterval(function() {
  //   alert("E")
  //   // create a new keyboard event and set the key to "Enter"
  //   const event = new KeyboardEvent('keyPress', {
  //     key: 'E',
  //     code: 'KeyE',
  //     which: 69,
  //     keyCode: 69,
  //   });

  //   // dispatch the event on some DOM element
  //   document.dispatchEvent(event);
  //   }, 30000);

}

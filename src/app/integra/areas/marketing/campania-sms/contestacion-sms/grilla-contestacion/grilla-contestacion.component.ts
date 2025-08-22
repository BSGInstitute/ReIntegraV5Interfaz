import { HttpResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { constApiMarketing } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { MatDialog } from '@angular/material/dialog';
import { ChatSmsComponent } from '../chat-sms/chat-sms.component';
@Component({
  selector: 'app-grilla-contestacion',
  templateUrl: './grilla-contestacion.component.html',
  styleUrls: ['./grilla-contestacion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GrillaContestacionComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    public dialog: MatDialog
  ) {
    this.diaDrop = this.dias[0];
  }

  @Input() tab:any;
  @Input() dia:any;

  grilla: any = [];
  diaDrop: any = 0;
  public dias = [
    { Value: 0, View: 'Hoy' },
    { Value: 1, View: 'Ayer' },
    { Value: 2, View: 'Hace 2 días' },
    { Value: 3, View: 'Hace 3 días' },
    { Value: 4, View: 'Hace 4 días' },
    { Value: 5, View: 'Hace 5 días' },
    { Value: 6, View: 'Hace 6 días' },
  ];

  ngOnInit(): void {
    this.obtenerGrilla();
    console.log(this.tab, this.dia)
    console.log(this.diaDrop)
  }

  obtenerGrilla() {

    var envio = {
      tab : this.tab,
      dia: this.diaDrop.Value
    }
    this.integraService

      .postJsonResponse(constApiMarketing.ObtenerGrilllaCOntestacion, envio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.grilla = response.body;
        },
        error: (error) => {},
        complete: () => {},
      });
  }

  selectionChange(e: any) {
    this.diaDrop = e
    console.log(this.diaDrop)
  }

  verSms(data: any) {
    const dialogRef = this.dialog.open(ChatSmsComponent, {
      width: '1400px',
      maxHeight: '90vh',
      panelClass:'dialog-gestor',
      data:data
    });

    dialogRef.afterClosed().subscribe(result => {
    
    });
  }
}

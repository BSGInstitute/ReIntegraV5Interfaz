import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { constApiMarketing } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { WhatsappFacebookOportunidadComponent } from '../whatsapp-facebook-oportunidad/whatsapp-facebook-oportunidad.component';
import { RowClassArgs } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-whatsapp-facebook-grilla',
  templateUrl: './whatsapp-facebook-grilla.component.html',
  styleUrls: ['./whatsapp-facebook-grilla.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WhatsappFacebookGrillaComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    public dialog: MatDialog
  ) {
    this.diaDrop = this.dias[0];
  }

  @Input() tab: any;
  @Input() dia: any;
  grilla: any = [];
  diaDrop: any;
  loading: boolean = false;

  selectedRowIndex: number | null = null;

  ngOnInit(): void {
    this.obtenerGrillass();
  }

  public dias = [
    { Value: 0, View: 'Hoy' },
    { Value: 1, View: 'Ayer' },
    { Value: 2, View: 'Hace 2 días' },
    { Value: 3, View: 'Hace 3 días' },
    { Value: 4, View: 'Hace 4 días' },
    { Value: 5, View: 'Hace 5 días' },
    { Value: 6, View: 'Hace 6 días' },
  ];

  obtenerGrillass() {
    this.loading = true;
    this.integraService
      .getJsonResponse(
        `${
          constApiMarketing.ObtenerWhatsappFacebookMasivo +
          '/' +
          this.tab +
          '/' +
          this.diaDrop.Value
        }`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.grilla = response.body;
          console.log(response.body);
          this.loading = false;
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
        },
      });
  }

  verWhats(dataItem: any) {
    const dialogRef = this.dialog.open(WhatsappFacebookOportunidadComponent, {
      maxWidth: '90%',
      minWidth: '90%',
      maxHeight: '1900px',
      panelClass: 'dialog-gestor',
      data: [dataItem, false],
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.obtenerGrillass();
    });
  }

  selectionChange(e: any) {
    console.log(e);
    this.diaDrop = e;
    console.log(this.diaDrop);
    this.obtenerGrillass();
  }

  Eliminar(data: any) {}

  public rowCallback = (context: RowClassArgs) => {
    if (context.dataItem.tipo == 1) {
      return { gold: true };
    } else {
      return { green: true };
    }
  };
}

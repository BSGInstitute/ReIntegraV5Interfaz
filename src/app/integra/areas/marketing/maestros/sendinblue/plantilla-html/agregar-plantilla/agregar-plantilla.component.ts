import { HttpResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { constApiMarketing } from '@environments/constApi';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-agregar-plantilla',
  templateUrl: './agregar-plantilla.component.html',
  styleUrls: ['./agregar-plantilla.component.scss'],
})
export class AgregarPlantillaComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AgregarPlantillaComponent>
  ) {}

  @ViewChild('miDiv', { static: true }) miDivRef: ElementRef;
  @ViewChild('miDiv2', { static: true }) miDivRef2: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {}

  //------------ obtener ------------------//

  imagen: any;

  selectedImage: string | ArrayBuffer | null = null;
  dataArchivo:any = null

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.dataArchivo = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    var fdata = new FormData();
     fdata.append('file', this.dataArchivo);

      this.integraService
        .postFormJson(constApiMarketing.InsertarImagen, fdata)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
          },
          error: (error) => {
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.alertaService.mensajeIcon(
              'Success',
              'La imagen se creo correctamente',
              'success'
            );
          },
        });
  }
}

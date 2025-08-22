import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AlertaService } from '@shared/services/alerta.service';

interface DialogData {
  dateRangeOption: string;
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-calendario-whatsapp',
  templateUrl: './calendario-whatsapp.component.html',
  styleUrls: ['./calendario-whatsapp.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarioWhatsappComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CalendarioWhatsappComponent>,
    private fb: FormBuilder,
    private alertaService: AlertaService
  ) {}

  hoy = new Date();

  calendarForm = this.fb.group({
      dateRangeOption: ['Hoy'],
      startDate: [this.hoy],
      endDate: [this.hoy],
  });

  @Output() onActualizar = new EventEmitter<DialogData>();
  habilitarFechas = false;


  ngOnInit(): void {
    this.calendarForm.patchValue(this.data);

    this.calendarForm
      .get('dateRangeOption')
      ?.valueChanges.subscribe((option) => {
        this.actualizarRangoFecha(option);
      });
  }

  actualizarRangoFecha(option: string): void {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let inicio: Date | null = null;
    let fin: Date | null = null;

    const diaSemana = hoy.getDay();

    switch (option) {
      case 'Hoy':
        inicio = hoy;
        fin = hoy;
        this.habilitarFechas = false;
        break;

      case 'Ayer':
        inicio = new Date(hoy);
        inicio.setDate(hoy.getDate() - 1);
        fin = new Date(hoy);
        fin.setDate(hoy.getDate() - 1);
        this.habilitarFechas = false;
        break;

      case 'Últimos 7 días':
        inicio = new Date(hoy);
        inicio.setDate(hoy.getDate() - 6);
        fin = hoy;
        this.habilitarFechas = false;
        break;

      case 'Últimos 14 días':
        inicio = new Date(hoy);
        inicio.setDate(hoy.getDate() - 13);
        fin = hoy;
        this.habilitarFechas = false;
        break;

      case 'Últimos 28 días':
        inicio = new Date(hoy);
        inicio.setDate(hoy.getDate() - 27);
        fin = hoy;
        this.habilitarFechas = false;
        break;

      case 'Últimos 30 días':
        inicio = new Date(hoy);
        inicio.setDate(hoy.getDate() - 29);
        fin = hoy;
        this.habilitarFechas = false;
        break;

      case 'Esta semana':
        const diffToMonday =
          hoy.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);

        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), diffToMonday);
        fin = new Date(hoy.getFullYear(), hoy.getMonth(), diffToMonday + 6);
        this.habilitarFechas = false;
        break;

      case 'La semana pasada':
        hoy.setDate(hoy.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1));

        inicio = new Date(hoy);
        inicio.setDate(hoy.getDate() - 7);

        fin = new Date(inicio);
        fin.setDate(inicio.getDate() + 6);
        this.habilitarFechas = false;
        break;

      case 'Este mes':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
        this.habilitarFechas = false;
        break;

      case 'El mes pasado':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        fin = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
        this.habilitarFechas = false;
        break;
      case 'Personalizado':
        this.habilitarFechas = true;
        return;
      default:
        return;
    }
    this.calendarForm.get('startDate').setValue(inicio);
    this.calendarForm.get('endDate').setValue(fin);
  }

  onUpdate(): void {
    if (this.calendarForm.valid) {
      if (
        this.calendarForm.get('startDate').value >
        this.calendarForm.get('endDate').value
      ) {
        this.alertaService.swalFireOptions({
          icon: 'warning',
          text: 'Rango de fechas no valido',
        });
        return;
      }
      this.dialogRef.close(this.calendarForm.getRawValue());
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}

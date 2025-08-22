import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SendinblueComponent } from '../sendinblue.component';

@Component({
  selector: 'app-plantilla-html',
  templateUrl: './plantilla-html.component.html',
  styleUrls: ['./plantilla-html.component.scss']
})
export class PlantillaHtmlComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PlantillaHtmlComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    console.log(this.data);

  }

}

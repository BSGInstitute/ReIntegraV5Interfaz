import { D } from '@angular/cdk/keycodes';
import { NumberSymbol } from '@angular/common';
import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { datePipeTransform } from '@shared/functions/date-pipe';

@Injectable({
  providedIn: 'root'
})



export class ExportExcelService {


  constructor() { }

  

  exportExcel(excelData:any) {

    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;
    const data2 = excelData.data2;
    const header2 = excelData.headers2;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Hoja 1');


    //Add Row and formatting
    worksheet.mergeCells('C1', 'G4');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    // Date
    worksheet.mergeCells('H1:I4');
    
    let d = datePipeTransform(
      new Date(),
      'yyyy-MM-dd'
    )

    let date = d;
    let dateCell = worksheet.getCell('H1');
    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true
    }
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

    //Blank Row 
    worksheet.addRow([]);

    //Adding Header Row

    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
    })
    headerRow.alignment= { vertical: 'middle', horizontal: 'center' }    

    data.forEach((d:any) => {
        var d1={
            Rubro: d.rubro,
            Enero: d.enero,
            Febrero: d.febrero,
            Marzo: d.marzo,
            Abril: d.abril,
            Mayo: d.mayo,
            Junio: d.junio,
            Julio: d.julio,
            Agosto: d.agosto,
            Septiembre: d.septiembre,
            Octubre: d.octubre,
            Noviembre: d.noviembre,
            Diciembre:d.diciembre,
            Total:d.total,
            Exceso: d.exceso,
            TotalProyectado: d.totalProyectado
          }
        let row = worksheet.addRow(Object.values(d1));  
        console.log(d)
        if(d.listaDesglose != undefined && d.listaDesglose!= null){
          worksheet.addRow({});
          
            let headerRow2 = worksheet.addRow(header2);

            headerRow2.eachCell((cell, number) => {

                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFDEA1' },
                  bgColor: { argb: '' }
                }
                cell.font = {
                  color: { argb: '#9C6500' },
                  size: 12,
                }
              })

              headerRow2.alignment= { vertical: 'middle', horizontal: 'center' }
          

            d.listaDesglose.forEach((d2:any) => {
                var detalles={
                    NombreCuenta: d2.nombreCuenta,
                    NumeroCuenta: d2.numeroCuenta,
                    Enero: d2.enero,
                    Febrero: d2.febrero,
                    Marzo: d2.marzo,
                    Abril: d2.abril,
                    Mayo: d2.mayo,
                    Junio: d2.junio,
                    Julio: d2.julio,
                    Agosto: d2.agosto,
                    Septiembre: d2.septiembre,
                    Octubre: d2.octubre,
                    Noviembre: d2.noviembre,
                    Diciembre:d2.diciembre,
                    Total:d2.total,
                    Exceso: d2.exceso,
                    TotalProyectado: d2.totalProyectado
                  }
                let row2 = worksheet.addRow(Object.values(detalles));
                row2.getCell('B')
                console.log(d2)
                row2.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'F4F4F4' },
                    bgColor: { argb: '' }
                  }
            });
            worksheet.addRow({});
            
            let headerRow = worksheet.addRow(header);
            headerRow.eachCell((cell, number) => {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '4167B8' },
                bgColor: { argb: '' }
              }
              cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' },
                size: 12
              }
            })
            headerRow.alignment= { vertical: 'middle', horizontal: 'center' }   

        }
     
      
    })    


        
    //   let sales = row.getCell(6);
    //   let color = 'FF99FF99';
    //   if (+sales.value < 200000) {
    //     color = 'FF9999'
    //   }

    //   sales.fill = {
    //     type: 'pattern',
    //     pattern: 'solid',
    //     fgColor: { argb: color }
    //   }

    worksheet.getColumn(1).width = 50;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 20;
    worksheet.getColumn(12).width = 20;
    worksheet.getColumn(13).width = 20;
    worksheet.getColumn(14).width = 20;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 20;
    worksheet.getColumn(17).width = 20;
    worksheet.addRow([]);

    // //Footer Row
    // let footerRow = worksheet.addRow(['Employee Sales Report Generated from example.com at ' + date]);
    // footerRow.getCell(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'FFB050' }
    // };

    // //Merge Cells
    // worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })

  }
}
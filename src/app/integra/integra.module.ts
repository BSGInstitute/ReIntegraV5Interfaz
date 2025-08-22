import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegraRoutingModule } from './integra-routing.module';
import { IntegraComponent } from './integra.component';
import { SharedModule } from '@shared/shared.module';
import { KendoAngularModule } from '@modules/kendo-angular.module';
import { SoftphoneIntegraComponent } from './softphone/softphone-integra/softphone-integra.component';
import { CrmComponent } from './softphone/crm/crm.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  TabStripComponent,
  TabStripTabComponent,
} from '@progress/kendo-angular-layout';
import { AngularMaterialModule } from '@modules/angular-material.module';




@NgModule({
  declarations: [IntegraComponent, SoftphoneIntegraComponent, CrmComponent],
  imports: [
    CommonModule,
    IntegraRoutingModule,
    KendoAngularModule,
    AngularMaterialModule,
    SharedModule,
    FontAwesomeModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [TabStripComponent, TabStripTabComponent],
})
export class IntegraModule {}

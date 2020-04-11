import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SheetInfoRoutingModule } from './sheet-info-routing.module';
import { SheetInfoComponent } from './sheet-info.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [SheetInfoComponent],
  imports: [
    SharedModule,
    SheetInfoRoutingModule
  ]
})
export class SheetInfoModule { }

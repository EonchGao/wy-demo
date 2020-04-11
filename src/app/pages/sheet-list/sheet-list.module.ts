import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SheetListRoutingModule } from './sheet-list-routing.module';
import { SheetListComponent } from './sheet-list.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [SheetListComponent],
  imports: [
    CommonModule,
    SharedModule,
    SheetListRoutingModule
  ]
})
export class SheetListModule { }

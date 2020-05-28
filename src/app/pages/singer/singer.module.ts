import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SingerRoutingModule } from './singer-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SingerDetailComponent } from './singer-detail/singer-detail.component';


@NgModule({
  declarations: [SingerDetailComponent],
  imports: [
    SharedModule,
    SingerRoutingModule
  ]
})
export class SingerModule { }

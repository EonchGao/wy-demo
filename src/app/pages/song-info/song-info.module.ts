import { NgModule } from '@angular/core';

import { SongInfoRoutingModule } from './song-info-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SongInfoComponent } from './song-info.component';


@NgModule({
  declarations: [SongInfoComponent],
  imports: [
    SharedModule,
    SongInfoRoutingModule
  ]
})
export class SongInfoModule { }

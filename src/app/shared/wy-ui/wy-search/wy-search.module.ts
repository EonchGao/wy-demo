import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WySearchComponent } from './wy-search.component';
import { NzInputModule, NzIconModule } from 'ng-zorro-antd';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';


@NgModule({
  declarations: [WySearchComponent, WySearchPanelComponent],
  imports: [
    CommonModule,
    NzIconModule,
    NzInputModule,
    OverlayModule,
    PortalModule,
  ],
  entryComponents: [
    WySearchPanelComponent
  ],
  exports: [WySearchComponent]
})
export class WySearchModule { }

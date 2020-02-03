import { NgModule, SkipSelf, Optional } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServicesModule } from '../services/services.module';
import { PagesModule } from '../pages/pages.module';
import { SharedModule } from '../shared/shared.module';
import { registerLocaleData } from '@angular/common';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';

import zh from '@angular/common/locales/zh';
import { AppStoreModule } from '../store';

registerLocaleData(zh);

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServicesModule,
    PagesModule,
    SharedModule,
    AppRoutingModule,
    AppStoreModule
  ],
  exports: [
    SharedModule,
    AppRoutingModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],

})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('coreModule 只能被appModule引入');
    }
  }
}

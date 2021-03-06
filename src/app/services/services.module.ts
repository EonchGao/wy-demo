import { NgModule, InjectionToken, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export const API_CONFIG = new InjectionToken('ApiConfigToken');
export const WINDOW = new InjectionToken('WINDOWToken');


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: API_CONFIG, useValue: 'http://localhost:3001/' },
    {
      provide: WINDOW,
      useFactory(platformId: object): Window | object {
        return isPlatformBrowser(platformId) ? window : {};
      },
      deps: [
        PLATFORM_ID
      ]
    },
  ]
})
export class ServicesModule { }

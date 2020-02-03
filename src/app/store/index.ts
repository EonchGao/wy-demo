import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { playReducer } from './reducers/player.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';



@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot({ player: playReducer }, {
      runtimeChecks: {
        strictActionImmutability: true,
        strictStateImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
      }
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 20,
      logOnly: environment.production
    })
  ]
})
export class AppStoreModule { }

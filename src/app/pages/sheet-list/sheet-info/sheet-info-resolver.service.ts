import { SongSheet } from 'src/app/services/data-type/common.types';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SheetService } from 'src/app/services/sheet.service';

@Injectable()
export class SheetInfoResolverService implements Resolve<SongSheet[]>{
    constructor(private sheetService: SheetService) { }
    resolve(route: ActivatedRouteSnapshot): Observable<SongSheet[]> {
        return this.sheetService.getSongSheetDetail(Number(route.paramMap.get('id')));
    }
}
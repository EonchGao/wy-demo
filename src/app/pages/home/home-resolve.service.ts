
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/singer.service';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-type/common.types';
import { take, first } from 'rxjs/operators';

type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];


@Injectable()
export class HomeResolveService implements Resolve<HomeDataType> {

    constructor(
        private homeService: HomeService,
        private singerService: SingerService,
    ) { }
    resolve(): Observable<HomeDataType> {

        return forkJoin([
            this.homeService.getBanners(),
            this.homeService.getHotTags(),
            this.homeService.getPersonalSheetList(),
            this.singerService.getEnterSinger()
        ]).pipe(first());
    }
}
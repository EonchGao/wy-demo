import { SongSheet, Song, Lyric, SingerDetail } from 'src/app/services/data-type/common.types';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { SongService } from 'src/app/services/song.service';
import { first } from 'rxjs/operators';
import { SingerService } from 'src/app/services/singer.service';

@Injectable()
export class SingerDetailResolverService implements Resolve<SingerDetail>{
    constructor(private singerService: SingerService) { }
    resolve(route: ActivatedRouteSnapshot): Observable<SingerDetail> {

        const id = route.paramMap.get('id');

        return this.singerService.getSingerDetail(id);
    }
}
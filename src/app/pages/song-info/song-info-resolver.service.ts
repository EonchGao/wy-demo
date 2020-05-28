import { SongSheet, Song, Lyric } from 'src/app/services/data-type/common.types';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { SongService } from 'src/app/services/song.service';
import { first } from 'rxjs/operators';


type SongDataModel = [Song, Lyric];


@Injectable()
export class SongInfoResolverService implements Resolve<SongDataModel>{
    constructor(private songService: SongService) { }
    resolve(route: ActivatedRouteSnapshot): Observable<SongDataModel> {

        const id = route.paramMap.get('id');

        return forkJoin([
            this.songService.getSongDetail(id),
            this.songService.getLyric(Number(id)),
        ]).pipe(first());
    }
}
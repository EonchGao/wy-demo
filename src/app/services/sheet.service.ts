import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import { Singer, SongSheet, Song, SheetList } from './data-type/common.types';
import { SongService } from './song.service';
import queryString from 'query-string'

export interface SheetParams {
  offset: number;
  limit: number;
  order: 'new' | 'hot';
  cat: string
}

@Injectable({
  providedIn: ServicesModule
})
export class SheetService {

  constructor(
    private http: HttpClient,
    private songService: SongService,
    @Inject(API_CONFIG) private uri: string
  ) { }


  // 获取歌单列表
  getSheets(args: SheetParams): Observable<SheetList> {

    const params = new HttpParams({ fromString: queryString.stringify(args) })
    console.log('params', params)
    return this.http.get(this.uri + 'top/playlist', { params }).pipe(map(res => res as SheetList))

  }

  getSongSheetDetail(id: number): Observable<SongSheet[]> {

    const params = new HttpParams().set('id', id.toString());

    return this.http.get(this.uri + 'playlist/detail', { params })
      .pipe(map((res: { playlist: SongSheet[] }) => res.playlist));
  }

  playSheet(id: number): Observable<Song[]> {
    return this.getSongSheetDetail(id)
      .pipe(
        pluck('tracks'),
        switchMap((tracks: Song | Song[]) => this.songService.getSongList(tracks))
      ) as Observable<Song[]>;
  }

}

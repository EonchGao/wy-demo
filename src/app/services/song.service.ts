import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Singer, SongUrl, Song, Lyric } from './data-type/common.types';


@Injectable({
  providedIn: ServicesModule
})
export class SongService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string
  ) { }

  getSongUrl(ids: string): Observable<SongUrl[]> {

    const params = new HttpParams().set('id', ids);

    return this.http.get(this.uri + 'song/url', { params })
      .pipe(map((res: { data: SongUrl[] }) => res.data));
  }

  getSongList(songs: Song | Song[]): Observable<Song[]> {
    const songArr = Array.isArray(songs) ? songs.slice() : [songs];
    const ids = songArr.map(item => item.id).join(',');

    // return Observable.create(observer => {
    //   this.getSongUrl(ids).subscribe(urls => {
    //     observer.next(this.generateSongList(songArr, urls));
    //   });
    // });

    return this.getSongUrl(ids).pipe(map(urls => this.generateSongList(songArr, urls)));

  }

  private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
    const result = [];
    songs.forEach(song => {
      const url = urls.find(songUrl => songUrl.id === song.id).url;
      if (url) {
        result.push({ ...song, url });
      }
    });
    return result;
  }


  // 获取歌曲详情
  getSongDetail(ids: string): Observable<Song> {
    const params = new HttpParams().set('ids', ids)
    return this.http.get(this.uri + 'song/detail', { params }).pipe(map((res: { songs: Song }) => res.songs[0]));

  }

  // 获取歌词
  getLyric(id: number): Observable<Lyric> {

    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.uri + 'lyric', { params }).pipe(map((res: { [key: string]: { lyric: string } }) => {


      try {
        return {
          lyric: res.lrc.lyric,
          tlyric: res.tlyric.lyric
        };
      } catch (error) {
        return {
          lyric: '',
          tlyric: ''
        };
      }
    }));
  }

}

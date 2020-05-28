import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchResult } from './data-type/common.types';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: ServicesModule
})
export class SearchService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string
  ) { }

  search(keyWords: string): Observable<SearchResult> {
    const params = new HttpParams().set('keywords', keyWords);

    return this.http.get(this.uri + 'search/suggest', { params }).pipe(map((res: { result: any }) => res.result));
  }
}

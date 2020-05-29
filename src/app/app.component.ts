import { Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchResult } from './services/data-type/common.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'wy-demo';

  menu = [
    {
      label: '发现',
      path: '/home'
    },
    {
      label: '歌单',
      path: '/sheet'
    },
  ];
  searchResult: SearchResult;
  constructor(
    private searchService: SearchService
  ) { }

  search(keyWords: string) {
    if (keyWords) {
      this.searchService.search(keyWords).subscribe((res: SearchResult) => {
        console.log(res)
        this.searchResult = res;
      })
    } else {
      this.searchResult = {};
    }
  }
}

import { Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchResult } from './services/data-type/common.types';
import { isEmptyObject } from './util/tools';

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
        this.searchResult = this.highlightKeyWord(keyWords, res);
      })
    } else {
      this.searchResult = {};
    }
  }


  private highlightKeyWord(keyWords: string, result: SearchResult): SearchResult {
    if (!isEmptyObject(result)) {
      const reg = new RegExp(keyWords, 'ig');
      ['artists', 'playlists', 'songs'].forEach(type => {
        if (result[type]) {
          result[type].forEach(item => {
            item.name = item.name.replace(reg, '<span class="highlight">$&</span>');
          });
        }
      })
    }
    return result;
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-type/common.types';
import { NzCarouselComponent, th_TH } from 'ng-zorro-antd';
import { SingerService } from 'src/app/services/singer.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { SetSongList, SetPlayList, SetCurrentIndex } from 'src/app/store/actions/player.action';
import { PlayState } from 'src/app/store/reducers/player.reducer';
import { getPlayer } from 'src/app/store/selectors/player.selector';
import { findIndex, shuffle } from 'src/app/util/array';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  banners: Banner[];
  hotTags: HotTag[];
  songSheetList: SongSheet[];
  singers: Singer[];


  carouselActiveIndex = 0;
  @ViewChild(NzCarouselComponent, { static: true })
  private nzCarousel: NzCarouselComponent;

  private playerState: PlayState;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private store$: Store<AppStoreModule>
  ) {
    this.route.data.pipe(map(res => res.homeData)).subscribe(([banners, hotTags, songSheetList, singers]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
      this.singers = singers;
    });

    this.store$.pipe(select(getPlayer)).subscribe((res: any) => this.playerState = res);
  }

  ngOnInit() {

  }

  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }
  changeSlide(type: string) {
    this.nzCarousel[type]();
  }

  onPlaySheet(id: number) {
    this.sheetService.playSheet(id).subscribe(list => {
      console.log('song:', list);
      this.store$.dispatch(SetSongList({ songList: list }));

      let trueIndex = 0;
      let trueList = list.slice();

      if (this.playerState.playMode.type === 'random') {
        trueList = shuffle(list || []);
        trueIndex = findIndex(trueList, list[trueIndex]);
      }

      this.store$.dispatch(SetPlayList({ playList: trueList }));
      this.store$.dispatch(SetCurrentIndex({ currentIndex: trueIndex }));
    });
  }


}

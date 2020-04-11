import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-type/common.types';
import { NzCarouselComponent, th_TH } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { SetSongList, SetPlayList, SetCurrentIndex } from 'src/app/store/actions/player.action';
import { PlayState } from 'src/app/store/reducers/player.reducer';
import { getPlayer } from 'src/app/store/selectors/player.selector';
import { findIndex, shuffle } from 'src/app/util/array';
import { BatchActionsService } from 'src/app/store/batch-actions.service';

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
    private router: Router,
    private sheetService: SheetService,
    private store$: Store<AppStoreModule>,
    private batchActionsService: BatchActionsService
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
      this.batchActionsService.selectPlayList({ list, index: 0 });
    });
  }
  toInfo(id: number) {
    this.router.navigate(['sheetInfo', id]);
  }

}

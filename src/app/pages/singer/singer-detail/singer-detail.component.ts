import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { SingerDetail, Song } from 'src/app/services/data-type/common.types';
import { AppStoreModule } from 'src/app/store';
import { SongService } from 'src/app/services/song.service';
import { Store, select } from '@ngrx/store';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { getPlayer, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { findIndex } from 'src/app/util/array';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit, OnDestroy {
  singerDetail: SingerDetail;
  currentIndex: number = -1;
  currentSong: Song;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songServe: SongService,
    private batchActionServe: BatchActionsService,
    private messageServe: NzMessageService,
  ) {
    this.route.data.pipe(map(res => res.singerDetail)).subscribe(detail => {

      this.singerDetail = detail;
      this.listenCurrent();

    })
  }

  ngOnInit() {
  }
  // 添加一首歌曲
  onAddSong(song: Song, isPlay = false) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songServe.getSongList(song)
        .subscribe(list => {
          if (list.length) {
            this.batchActionServe.insertSong(list[0], isPlay);
          } else {
            this.alertMessage('warning', '无url!');
          }
        });
    }
  }

  onAddSongs(songs: Song[], isPlay = false) {
    this.songServe.getSongList(songs).subscribe(list => {
      if (list.length) {
        if (isPlay) {
          this.batchActionServe.selectPlayList({ list, index: 0 });
        } else {
          this.batchActionServe.insertSongs(list);
        }
      }
    });
  }


  private alertMessage(type: string, msg: string) {
    this.messageServe.create(type, msg);
  }

  private listenCurrent() {
    this.store$
      .pipe(select(getPlayer), select(getCurrentSong), takeUntil(this.destroy$))
      .subscribe(song => {
        this.currentSong = song;
        if (song) {
          this.currentIndex = findIndex(this.singerDetail.hotSongs, song);
        } else {
          this.currentIndex = -1;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

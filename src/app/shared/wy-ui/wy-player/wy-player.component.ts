import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { getSongList, getPlayList, getCurrentIndex, getPlayer, getPlayMode, getCurrentSong, getCurrentAction } from 'src/app/store/selectors/player.selector';
import { Song } from 'src/app/services/data-type/common.types';
import { PlayMode } from './player-type';
import { SetCurrentIndex, SetPlayMode, SetPlayList, SetSongList, SetCurrentAction } from 'src/app/store/actions/player.action';
import { Subscription, fromEvent, timer } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { shuffle, findIndex } from 'src/app/util/array';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import { NzModalService } from 'ng-zorro-antd';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { RouterModule, Router } from '@angular/router';
import { trigger, transition, animate, state, style, AnimationEvent } from '@angular/animations';
import { CurrentActions } from 'src/app/store/reducers/player.reducer';


const modeTypes: PlayMode[] = [
  {
    type: 'loop',
    label: '循环'
  },
  {
    type: 'random',
    label: '随机'
  }, {
    type: 'singleLoop',
    label: '单曲循环'
  },
];

enum TipTiles {
  Add = '已添加到列表',
  Play = '已开始播放'
}

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
  animations: [trigger('showHide', [
    state('show', style({ bottom: 0 })),
    state('hide', style({ bottom: -71 })),
    transition('show=>hide', [animate('0.3s')]),
    transition('hide=>show', [animate('0.1s')]),
  ])]
})
export class WyPlayerComponent implements OnInit {
  showPlayer = 'hide';
  isLocked = false;
  controlTooltip = {
    title: '',
    show: false
  };

  animating = false;

  percent = 0;
  bufferPercent = 0;

  currentSong: Song;
  songList: Song[];
  playList: Song[];
  currentIndex: number;

  duration: number;
  currentTime: number;

  // 播放状态
  playing = false;

  // 是否可以播放
  songReady = false;

  // 音量
  volume = 60;

  // 是否显示音量面板
  showVolumePanel = false;

  showPanel = false;

  // 是否绑定document click事件
  bindFlag = false;

  // 当前模式
  currentMode: PlayMode;
  modeCount = 0;



  private winClick: Subscription;

  @ViewChild('audio', { static: true }) audio: ElementRef;
  @ViewChild(WyPlayerPanelComponent, { static: false }) playerPanel: WyPlayerPanelComponent;

  private audioEl: HTMLAudioElement;

  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document,
    private modal: NzModalService,
    private batchActionsService: BatchActionsService,
    private router: Router
  ) {
    const appStore$ = this.store$.pipe(select(getPlayer));
    const stateArr = [
      {
        type: getSongList,
        cb: list => this.watchList(list, 'songList')
      },
      {
        type: getPlayList,
        cb: list => this.watchList(list, 'playList')
      },
      {
        type: getCurrentIndex,
        cb: index => this.watchCurrentIndex(index)
      },
      {
        type: getPlayMode,
        cb: mode => this.watchPlayMode(mode)
      },
      {
        type: getCurrentSong,
        cb: song => this.watchCurrentSong(song)
      },
      {
        type: getCurrentAction,
        cb: action => this.watchCurrentAction(action)
      },

    ];

    stateArr.forEach((item: any) => {
      appStore$.pipe(select(item.type)).subscribe(item.cb);
    });

  }

  ngOnInit() {
    this.audioEl = this.audio.nativeElement;
  }

  private watchList(list: Song[], type: string) {
    this[type] = list;
  }


  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  private watchPlayMode(mode: PlayMode) {
    console.log('mode', mode);
    this.currentMode = mode;

    if (this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        list = shuffle(this.songList);
      }

      this.updateCurrentIndex(list, this.currentSong);
      this.store$.dispatch(SetPlayList({ playList: list }));

    }

  }

  private watchCurrentSong(song: Song) {
    this.currentSong = song;
    if (song) {
      this.duration = song.dt / 1000;
    }
  }

  private watchCurrentAction(action: CurrentActions) {

    const title = TipTiles[CurrentActions[action]];
    if (title) {
      this.controlTooltip.title = title;
      if (this.showPlayer === 'hide') {
        this.togglePlayer('show');
      } else {
        this.showToolTip();
      }
    }
    this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Other }));

  }
  onAnimateDone(event: AnimationEvent) {
    this.animating = false;
    if (event.toState === 'show' && this.controlTooltip.title) {
      this.showToolTip();
    }
  }
  private showToolTip() {
    this.controlTooltip.show = true;
    timer(1500).subscribe(_ => {
      this.controlTooltip = {
        title: '',
        show: false
      }
    })
  }

  private updateCurrentIndex(list: Song[], song: Song) {

    const newIndex = findIndex(list, song);
    this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex }));

  }
  // 改变模式
  changeMode() {
    const temp = modeTypes[++this.modeCount % 3];
    this.store$.dispatch(SetPlayMode({ playMode: temp }));
  }

  onClickOutSide(target: HTMLElement) {
    if (target.dataset.act !== 'delete') {
      this.showVolumePanel = false;
      this.showPanel = false;
      this.bindFlag = false;
    }
  }

  onPercentChange(percent: number) {
    if (this.currentSong) {
      const currentTime = this.duration * (percent / 100);
      this.audioEl.currentTime = currentTime;
      if (this.playerPanel) {
        this.playerPanel.seekLyric(currentTime * 1000);
      }
    }
  }

  // 控制音量
  onVolumeChange(percent: number) {
    this.audioEl.volume = percent / 100;
  }

  // 控制音量面板
  toggleVolPanel(event: Event) {
    event.stopPropagation();
    this.togglePanel('showVolumePanel');
  }

  // 控制列表面板
  toggleListPanel() {
    if (this.songList.length > 0) {
      this.togglePanel('showPanel');
    }
  }

  togglePanel(type: string) {
    this[type] = !this[type];
    // if (this.showVolumePanel || this.showPanel) { // 音量面板显示
    //   this.bindFlag = true;
    // } else {
    //   this.bindFlag = false;
    // }

    this.bindFlag = (this.showVolumePanel || this.showPanel);

  }

  private unbindDocumentClickListener() {
    if (this.winClick) {
      this.winClick.unsubscribe();
      this.winClick = null;
    }
  }
  // 播放暂停
  onToggle() {
    if (!this.currentSong) {
      if (this.playList.length) {
        this.updateIndex(0);
      }
    } else {
      if (this.songReady) {
        this.playing = !this.playing;
        if (this.playing) {
          this.audioEl.play();
        } else {
          this.audioEl.pause();
        }
      }
    }
  }

  // 上一曲
  onPrev(index: number) {
    if (!this.songReady) { return; }
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index < 0 ? this.playList.length - 1 : index;
      this.updateIndex(newIndex);
    }
  }

  // 下一曲
  onNext(index: number) {
    if (!this.songReady) { return; }
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index >= this.playList.length ? 0 : index;
      this.updateIndex(newIndex);
    }
  }

  // 播放结束
  onEnded() {
    this.playing = false;
    if (this.currentMode.type === 'singleLoop') {
      this.loop();

    } else {
      this.onNext(this.currentIndex + 1);
    }
  }
  // 播放错误
  onError() {
    this.playing = false;
    this.bufferPercent = 0;
  }

  private loop() {
    this.audioEl.currentTime = 0;
    this.play();
    if (this.playerPanel) {
      this.playerPanel.seekLyric(0);
    }
  }

  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: index }));
    this.songReady = false;
  }

  onCanplay() {
    this.songReady = true;
    this.play();
  }

  onTimeUpdate(e: Event) {
    this.currentTime = (e.target as HTMLAudioElement).currentTime;
    this.percent = (this.currentTime / this.duration) * 100;
    const buffered = this.audioEl.buffered;
    if (buffered.length && this.bufferPercent < 100) {
      this.bufferPercent = (buffered.end(0) / this.duration) * 100;
    }
  }

  private play() {
    this.audioEl.play();
    this.playing = true;
  }

  get picUrl() {
    return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }


  // 改变歌曲
  onChangeSong(song: Song) {
    this.updateCurrentIndex(this.playList, song);
  }

  // 删除歌曲
  onDeleteSong(song: Song) {
    this.batchActionsService.deleteSong(song);
  }

  onClearSong() {
    this.modal.confirm({
      nzTitle: '确认清空列表？',
      nzOnOk: () => {
        this.batchActionsService.clearSong();
      }
    });
  }

  toInfo(path: [string, number]) {
    if (path[1]) {
      this.showPanel = false;
      this.showVolumePanel = false;
      this.router.navigate(path);
    }
  }

  togglePlayer(type: string) {
    if (!this.isLocked && !this.animating) {
      this.showPlayer = type;
    }
  }
}

import { Injectable } from '@angular/core';
import { AppStoreModule } from '.';
import { Song } from '../services/data-type/common.types';
import { Store, select } from '@ngrx/store';
import { PlayState } from './reducers/player.reducer';
import { SetSongList, SetPlayList, SetCurrentIndex } from './actions/player.action';
import { getPlayer } from './selectors/player.selector';
import { shuffle, findIndex } from '../util/array';

@Injectable({
  providedIn: AppStoreModule
})
export class BatchActionsService {
  private playerState: PlayState;

  constructor(
    private store$: Store<AppStoreModule>

  ) {
    this.store$.pipe(select(getPlayer)).subscribe((res: any) => this.playerState = res);

  }

  // 播放列表
  selectPlayList({ list, index }: { list: Song[], index: number }) {
    this.store$.dispatch(SetSongList({ songList: list }));

    let trueIndex = index;
    let trueList = list.slice();

    if (this.playerState.playMode.type === 'random') {
      trueList = shuffle(list || []);
      trueIndex = findIndex(trueList, list[trueIndex]);
    }

    this.store$.dispatch(SetPlayList({ playList: trueList }));
    this.store$.dispatch(SetCurrentIndex({ currentIndex: trueIndex }));
  }

  // 删除歌曲
  deleteSong(song: Song) {
    const songList = this.playerState.songList.slice();
    const playList = this.playerState.playList.slice();
    let currentIndex = this.playerState.currentIndex;

    const sIndex = findIndex(songList, song);
    songList.splice(sIndex, 1);
    const pIndex = findIndex(playList, song);
    playList.splice(pIndex, 1);

    if (currentIndex > pIndex || currentIndex === playList.length) {
      currentIndex--;
    }
    this.store$.dispatch(SetSongList({ songList }));
    this.store$.dispatch(SetPlayList({ playList }));
    this.store$.dispatch(SetCurrentIndex({ currentIndex }));

  }

  clearSong() {
    this.store$.dispatch(SetSongList({ songList: [] }));
    this.store$.dispatch(SetPlayList({ playList: [] }));
    this.store$.dispatch(SetCurrentIndex({ currentIndex: -1 }));
  }

}

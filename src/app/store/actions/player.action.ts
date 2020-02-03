import { createAction, props } from '@ngrx/store';
import { Song } from 'src/app/services/data-type/common.types';
import { PlayMode } from 'src/app/shared/wy-ui/wy-player/player-type';

export const SetPlaying = createAction('[player] set playing', props<{ playing: boolean }>());
export const SetPlayList = createAction('[player] set playList', props<{ playList: Song[] }>());
export const SetSongList = createAction('[player] set songList', props<{ songList: Song[] }>());
export const SetPlayMode = createAction('[player] set playMode', props<{ playMode: PlayMode }>());

export const SetCurrentIndex = createAction('[player] set currentIndex', props<{ currentIndex: number }>());

import {
  Component,
  OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter
  , ViewChildren, QueryList, Inject, ElementRef
} from '@angular/core';
import { Song } from 'src/app/services/data-type/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { findIndex } from 'src/app/util/array';
import { timer } from 'rxjs';
import { WINDOW } from 'src/app/services/services.module';
import { SongService } from 'src/app/services/song.service';
import { WyLyric, BasicLyricLine } from './wy-lyyic';


@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {
  currentLineNum: number;
  scrollY: number = 0;
  currentIndex: number;
  currentLyric: BasicLyricLine[] = [];
  lyric: WyLyric;
  lyricRefs: NodeList;

  @Input() playing: boolean;
  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() show: boolean;

  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();
  @Output() onDeleteSong = new EventEmitter<Song>();
  @Output() onClearSong = new EventEmitter<void>();

  @ViewChildren(WyScrollComponent) wyScroll: QueryList<WyScrollComponent>;

  constructor(
    @Inject(WINDOW) private win: Window,
    private songServe: SongService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songList']) {
      this.updateCurrentIndex();
    }
    if (changes['playing']) {
      if (!changes['playing'].firstChange) {

        this.lyric && this.lyric.togglePlay(this.playing);
      }
    }

    if (changes['currentSong']) {
      if (this.currentSong) {
        this.updateCurrentIndex();
        this.updateLyric();
        if (this.show) {
          this.scrollToCurrent();
        }
      } else {
        this.resetLyric();

      }

    }
    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll();
        this.wyScroll.last.refreshScroll();

        // timer(80).subscribe(() => {
        //   if (this.currentSong) {
        //     this.scrollToCurrent(0);
        //   }
        // });

        this.win.setTimeout(() => {
          if (this.currentSong) {
            this.scrollToCurrent(0);
          }
        }, 80);
      }
    }
  }
  private updateCurrentIndex() {
    this.currentIndex = findIndex(this.songList, this.currentSong);

  }

  private updateLyric() {
    this.resetLyric();
    this.songServe.getLyric(this.currentSong.id).subscribe(res => {
      this.lyric = new WyLyric(res);
      this.currentLyric = this.lyric.lines;
      const startLine = res.tlyric ? 0 : 2;

      this.handleLyric(startLine);
      this.wyScroll.last.scrollTo(0, 0);
      if (this.playing) {
        this.lyric.play();
      }
    });
  }

  private handleLyric(startLine = 2) {
    this.lyric.handle.subscribe(({ lineNum }) => {
      if (!this.lyricRefs) {
        this.lyricRefs = this.wyScroll.last.el.nativeElement.querySelectorAll('ul li');
      }

      if (this.lyricRefs.length) {
        this.currentLineNum = lineNum;
        if (lineNum > startLine) {
          const targetLine = this.lyricRefs[lineNum - startLine];
          if (targetLine) {
            this.wyScroll.last.scrollToElement(targetLine, 300, false, false);
          }
        } else {
          this.wyScroll.last.scrollTo(0, 0);
        }

      }
    });
  }

  private resetLyric() {
    if (this.lyric) {
      this.lyric.stop();
      this.lyric = null;
      this.currentLyric = [];
      this.currentLineNum = 0;
      this.lyricRefs = null;
    }
  }

  seekLyric(time: number) {
    if (this.lyric) {
      this.lyric.seek(time);
    }
  }

  private scrollToCurrent(speed: number = 300) {
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = songListRefs[this.currentIndex || 0] as HTMLElement;
      const offsetTop = currentLi.offsetTop;
      const offsetHeight = currentLi.offsetHeight;

      if ((offsetTop - Math.abs(this.scrollY)) > offsetHeight * 5 || (offsetTop < Math.abs(this.scrollY))) {
        this.wyScroll.first.scrollToElement(currentLi, speed, false, false);
      }

    }
  }

}

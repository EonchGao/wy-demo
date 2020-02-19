import {
  Component,
  OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter
  , ViewChildren, QueryList, Inject
} from '@angular/core';
import { Song } from 'src/app/services/data-type/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { findIndex } from 'src/app/util/array';
import { timer } from 'rxjs';
import { WINDOW } from 'src/app/services/services.module';
import { SongService } from 'src/app/services/song.service';


@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {

  scrollY: number = 0;
  currentIndex: number;

  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() show: boolean;

  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();

  @ViewChildren(WyScrollComponent) wyScroll: QueryList<WyScrollComponent>;

  constructor(
    @Inject(WINDOW) private win: Window,
    private songServe: SongService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songList']) {
      console.log('songList', this.songList);
      this.currentIndex = 0;

    }

    if (changes['currentSong']) {
      if (this.currentSong) {
        this.currentIndex = findIndex(this.songList, this.currentSong);
        this.updateLyric();
        if (this.show) {
          this.scrollToCurrent();
        }
      } else {

      }

    }
    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll();

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

  private updateLyric() {
    this.songServe.getLyric(this.currentSong.id).subscribe(res => {
      console.log('res', res)
    });
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

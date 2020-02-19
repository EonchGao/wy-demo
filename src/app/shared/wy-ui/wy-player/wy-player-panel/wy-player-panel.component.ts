import {
  Component,
  OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter
  , ViewChildren, QueryList
} from '@angular/core';
import { Song } from 'src/app/services/data-type/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {

  scrollY: number = 0;

  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() currentIndex: number;
  @Input() show: boolean;

  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();

  @ViewChildren(WyScrollComponent) wyScroll: QueryList<WyScrollComponent>;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songList']) {
      console.log('songList', this.songList);
    }
    if (changes['currentSong']) {
      if (this.currentSong) {
        if (this.show) {
          this.scrollToCurrent();
        }
      } else {

      }

    }
    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll();

        setTimeout(() => {
          if (this.currentSong) {
            this.scrollToCurrent();
          }
        }, 80);


      }

    }
  }

  private scrollToCurrent() {
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = songListRefs[this.currentIndex || 0] as HTMLElement;
      const offsetTop = currentLi.offsetTop;
      const offsetHeight = currentLi.offsetHeight;

      if ((offsetTop - Math.abs(this.scrollY)) > offsetHeight * 5 || (offsetTop < Math.abs(this.scrollY))) {
        this.wyScroll.first.scrollToElement(currentLi, 300, false, false);
      }



    }
  }

}

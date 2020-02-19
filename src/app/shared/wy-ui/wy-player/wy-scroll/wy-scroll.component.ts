import {
  Input,
  OnInit,
  Component,
  ViewChild,
  OnChanges,
  ElementRef,
  SimpleChanges,
  AfterViewInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';

import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
BScroll.use(ScrollBar);
import MouseWheel from '@better-scroll/mouse-wheel';
BScroll.use(MouseWheel);

@Component({
  selector: 'app-wy-scroll',
  template: `
    <div class="wy-scroll" #wrap>
      <ng-content></ng-content>
    <div>
  `,
  styles: [`.wy-scroll{width:100%;height:100%;overflow:hidden;}`],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyScrollComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() data: any[];
  @Input() refreshDelay = 50;

  @Output() private onScrollEnd = new EventEmitter<number>();

  private bs: BScroll;

  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;

  constructor(readonly el: ElementRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.refreshScroll();
    }

  }
  ngAfterViewInit() {
    this.bs = new BScroll(this.wrapRef.nativeElement, {
      scrollbar: {
        interactive: true
      },
      mouseWheel: {}
    });
    this.bs.on('scrollEnd', ({ y }) => { this.onScrollEnd.emit(y); }); // 监听滚动条位置
  }

  scrollToElement(...args) {
    this.bs.scrollToElement.apply(this.bs, args);
  }

  private refresh() {
    this.bs.refresh();
  }

  refreshScroll() {
    setTimeout(() => {
      this.refresh();
    }, this.refreshDelay);
  }
}
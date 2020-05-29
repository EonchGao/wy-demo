import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { pluck, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchResult } from 'src/app/services/data-type/common.types';
import { isEmptyObject } from 'src/app/util/tools';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';
import { ComponentPortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() customView: TemplateRef<any>;
  @Input() searchResult: SearchResult;

  @Output() onSearch = new EventEmitter<string>();

  @ViewChild('nzInput', { static: false }) private nzInput: ElementRef;
  @ViewChild('search', { static: false }) private search: ElementRef;
  private overlayRef: OverlayRef;
  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    fromEvent(this.nzInput.nativeElement, 'input')
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        pluck('target', 'value'))
      .subscribe((value: string) => {
        this.onSearch.emit(value);
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchResult'] && !changes['searchResult'].firstChange) {
      // if (!isEmptyObject(this.searchResult)) {
      //   this.showOverlayPanel();
      // } else {
      //   this.showOverlayPanel();
      // }
      this.showOverlayPanel();
    }
  }
  onFocus() {
    if (this.searchResult && !isEmptyObject(this.searchResult)) {
      this.showOverlayPanel();
    }
  }
  onBlur() {
    this.hideOverlayPanel()
  }
  showOverlayPanel() {
    this.hideOverlayPanel();
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.search).withPositions([{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top'
      }]).withLockedPosition(true);
    this.overlayRef = this.overlay.create({
      // hasBackdrop: true,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
    const panelPortal = new ComponentPortal(WySearchPanelComponent, this.viewContainerRef);
    const panelRef = this.overlayRef.attach(panelPortal);
    panelRef.instance.searchResult = this.searchResult;

    // this.overlayRef.backdropClick().subscribe(_ => this.hideOverlayPanel());
  }

  hideOverlayPanel() {
    if (this.overlayRef && this.overlayRef.hasAttached) {
      this.overlayRef.dispose();
    }
  }

}

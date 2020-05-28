import { Component, OnInit, Input, TemplateRef, ViewChild, ElementRef, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { fromEvent } from 'rxjs';
import { pluck, debounce, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit, AfterViewInit {

  @Input() customView: TemplateRef<any>;

  @Output() onSearch = new EventEmitter<string>();

  @ViewChild('nzInput', { static: false }) private nzInput: ElementRef;

  constructor() { }

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

}

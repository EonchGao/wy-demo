import { Component, OnInit } from '@angular/core';
import { ServicesModule } from 'src/app/services/services.module';
import { SheetParams, SheetService } from 'src/app/services/sheet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SheetList } from 'src/app/services/data-type/common.types';
import { BatchActionsService } from 'src/app/store/batch-actions.service';

@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.less']
})
export class SheetListComponent implements OnInit {
  listParams: SheetParams = {
    cat: '全部',
    order: 'hot',
    offset: 1,
    limit: 35
  };

  sheets: SheetList;

  orderValue = 'hot';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sheetService: SheetService,
    private batchActionsService: BatchActionsService
  ) {
    this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部';
    this.getList();
  }

  ngOnInit() {
  }

  private getList() {
    this.sheetService.getSheets(this.listParams).subscribe(sheets => {
      this.sheets = sheets;
    });
  }

  onPlaySheet(id: number) {
    this.sheetService.playSheet(id).subscribe(list => {
      this.batchActionsService.selectPlayList({ list, index: 0 });
    });
  }

  onPageChange(page: number) {
    this.listParams.offset = page;
    this.getList();
  }

  onOrderChange(order: 'new' | 'hot') {
    this.listParams.order = order;
    this.listParams.offset = 1;
    this.getList();
  }

  toInfo(id: number) {

    this.router.navigate(['sheetInfo', id]);
  }


}

import { Component, OnInit } from '@angular/core';
import { ServicesModule } from 'src/app/services/services.module';
import { SheetParams, SheetService } from 'src/app/services/sheet.service';
import { ActivatedRoute } from '@angular/router';
import { SheetList } from 'src/app/services/data-type/common.types';

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
  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private servicesModule: ServicesModule
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
}

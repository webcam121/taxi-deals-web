import { Component, OnInit } from '@angular/core';
import { PaginationInfo } from 'src/app/@core/entities/common.entities';
import { AuthService } from 'src/app/@core/services';
import { DashboardServices } from '../../dashboard/_services/_dashboard.component.services';
import { OfflineService } from '../../offline/_services/_offline.component.services';

@Component({
  selector: 'app-phone-history',
  templateUrl: './phone-history.component.html',
  styleUrls: ['./phone-history.component.css']
})
export class PhoneHistoryComponent implements OnInit {
  filterText = '';
  userRole: any;
  phoneHistoryList = [];
  pageNo = 0;
  paginationInfo: PaginationInfo = new PaginationInfo();
  pager: any = {};
  pagedItems: any[];
  totalRecords: number;
  constructor(
    private _offlineService : OfflineService,
    private _authService: AuthService) { }

  ngOnInit() {
    this.userRole = this._authService.getCurrentUser();
    this.getPhoneHistory();
  }
  getPhoneHistory() {
    if (this.userRole.data.supplierId && this.userRole.data.id) {
      this._offlineService.getPhoneHistory(this.userRole.data.supplierId).subscribe((res: any) => {
        // console.log('book my taxi res : ', res.data)
        if (res.data) {
          this.phoneHistoryList = [];
          this.phoneHistoryList = res.data;
          this.totalRecords = this.phoneHistoryList.length ? this.phoneHistoryList.length : 0;
          this.setPage(1);
          }

      }, _err => {
        // console.log('book my taxi error : ', _err)
      });
    }
  }
  onChanged(pageInfo: any) {
    this.paginationInfo.pageNumber = pageInfo.page;
    this.paginationInfo.pageSize = pageInfo.itemsPerPage;
    this.pageNo = pageInfo.page;
    this.setPage(pageInfo.page);
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.getPager(this.phoneHistoryList.length, page);

    // get current page of items
    this.pagedItems = this.phoneHistoryList.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }

  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);
    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // if (totalPages <= 5) {
    //   startPage = 1;
    //   endPage = totalPages;
    // } else {
    //   if (currentPage <= 3) {
    //     startPage = 1;
    //     endPage = 5;
    //   } else if (currentPage + 1 >= totalPages) {
    //     startPage = totalPages - 4;
    //     endPage = totalPages;
    //   } else {
    //     startPage = currentPage - 2;
    //     endPage = currentPage + 2;
    //   }
    // }
    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    // create an array of pages to ng-repeat in the pager control
    let pages = this.phoneHistoryList.length;
    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
    };
  }

}

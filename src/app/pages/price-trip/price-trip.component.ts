import { Component, OnInit } from '@angular/core';
import { GLOBAL_MESSAGES } from 'src/app/@core/entities/constants';
import { AppUser } from 'src/app/@core/entities/authDataModel';
import { DriverTopUp } from '../driver-info/_entities/_driver-info.data.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaginationInfo } from 'src/app/@core/entities/common.entities';
import { DriverServices } from '../driver-info/_services/_driver-info.component.services';
import { AlertService } from 'src/app/@core/services/alert.service';
import {
  AuthService,
  SessionStorageService,
  DataStoreService,
} from 'src/app/@core/services';
import { DashboardServices } from '../dashboard/_services/_dashboard.component.services';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-price-trip',
  templateUrl: './price-trip.component.html',
  styleUrls: ['./price-trip.component.css'],
})
export class PriceTripComponent implements OnInit {
  taxiId = String;
  Id = String;
  myId = String;
  mydriverId = String;
  driverId = String;
  isEdit = false;
  isdisplay: boolean;
  userRole: AppUser;
  myTaxis = [];
  driverDetails: DriverTopUp;
  topupForm: FormGroup;
  paginationInfo: PaginationInfo = new PaginationInfo();
  previousPage: number;
  pager: any = {};
  pagedItems: any[];
  totalRecords: number;
  pageNo: 0;
  category = '';
  supplier = '';
  pricetripForm: FormGroup;
  updateInfo: any;
  constructor(
    private _driverService: DriverServices,
    private _alertService: AlertService,
    private _authService: AuthService,
    private _dashboardServices: DashboardServices,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private translate: TranslateService,
    private storage: SessionStorageService,
    private _storeService: DataStoreService
  ) {}

  ngOnInit() {
    this.pricetripForm = this._formBuilder.group({
      km: '',
      price: '',
      peakPrice: '',
      basePrice: '',
      percentage: '',
      baseAddPrice: 0,
      baseTime: 0,
      cancellation: 0,
      category: '',
      domain: '',
      id: '',
      kmFive: 0,
      kmFour: 0,
      kmSix: 0,
      kmThree: 0,
      kmTwo: 0,
      minimumPrice: 0,
      priceFive: 0,
      priceFour: 0,
      priceSix: 0,
      priceThree: 0,
      priceTwo: 0,
      region: '',
      supplierId: '',
      tax: 0,
      travelTime: 0,
      type: '',
      waitingThree: 0,
      waitingTime: 0,
      waitingTimeFive: 0,
      waitingTimeFour: 0,
      waitingTimeSix: 0,
      waitingTimeTwo: 0,
      zipCode: 0,
    });
    this.userRole = this._authService.getCurrentUser();
    this.getMyTaxis();
    this._storeService.currentStore.subscribe((value) => {
      if (
        value['language'] === 'es' ||
        value['language'] === 'fr' ||
        value['language'] === 'gr' ||
        value['language'] === 'it'
      ) {
        this.translate.use(value['language']);
      } else {
        this.translate.use('en');
      }
    });
  }
  getMyTaxis() {
    this.isEdit = false;
    if (
      this.supplier.toString().length > 0 &&
      this.category.toString().length > 0
    ) {
      this._dashboardServices
        .getPricetrip(this.supplier, this.category)
        .subscribe(
          (res: any) => {
            if (res.data) {
              this.myTaxis = res.data;
              this.totalRecords = this.myTaxis.length ? this.myTaxis.length : 0;
              this.setPage(1);
            }
            this.isEdit = false;
          },
          (err) => {
            this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
          }
        );
    }
  }
  searchFilter() {
    this.getMyTaxis();
  }
  onChanged(pageInfo: any) {
    this.paginationInfo.pageNumber = pageInfo.page;
    this.paginationInfo.pageSize = pageInfo.itemsPerPage;
    // this.setPage(pageInfo.page);
    this.pageNo = pageInfo.page ? pageInfo.page : 0;
    this.getMyTaxis();
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.getPager(this.myTaxis.length, page);

    // get current page of items
    this.pagedItems = this.myTaxis.slice(
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
    let pages = this.myTaxis.length;
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
  getDriverTripHistory(driverid, form) {
    this.storage.setItem('TRIPHISTORYID', driverid);
    this._router.navigate(['/pages/trip-details/trip-history']);
  }
  clearForm() {
    this.isEdit = false;
    this.isdisplay = false;
    this.pricetripForm.reset();
  }
  updatePricetrip(data) {
    const modal = {
      baseAddPrice: data.baseAddPrice,
      basePrice: data.basePrice,
      baseTime: data.baseTime,
      cancellation: data.cancellation,
      category: data.category,
      domain: data.domain,
      id: data.id,
      km: data.km,
      kmFive: data.kmFive,
      kmFour: data.kmFour,
      kmSix: data.kmSix,
      kmThree: data.kmThree,
      kmTwo: data.kmTwo,
      minimumPrice: data.minimumPrice,
      peakPrice: data.peakPrice,
      percentage: data.percentage,
      price: data.price,
      priceFive: data.priceFive,
      priceFour: data.priceFour,
      priceSix: data.priceSix,
      priceThree: data.priceThree,
      priceTwo: data.priceTwo,
      region: data.region,
      supplierId: data.supplierId,
      tax: data.tax,
      travelTime: data.travelTime,
      type: data.type,
      waitingThree: data.waitingThree,
      waitingTime: data.waitingTime,
      waitingTimeFive: data.waitingTimeFive,
      waitingTimeFour: data.waitingTimeFour,
      waitingTimeSix: data.waitingTimeSix,
      waitingTimeTwo: data.waitingTimeTwo,
      zipCode: data.zipCode
    };
    this._driverService.UpdatePricetrip(modal).subscribe(
      (response: any) => {
        this.updateInfo = response;
        if (this.updateInfo.status === true) {
          this._alertService.success('Updated successfully!');
          this.isEdit = false;
          this.isdisplay = false;
          // this._router.navigate(['/pages/approval']);
        } else {
          this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
        }
        this.searchFilter();
      },
      (err) => {
        this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
      }
    );
  }
  editDriver(data) {
    this.isEdit = true;
    this.isdisplay = false;
    this.pricetripForm.patchValue(data);
  }
}

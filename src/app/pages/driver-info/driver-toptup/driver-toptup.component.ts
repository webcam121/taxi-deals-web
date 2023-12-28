import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../@core/services/auth.service";
import { AppUser } from "../../../@core/entities/authDataModel";
import { DashboardServices } from "../../dashboard/_services/_dashboard.component.services";
import { GLOBAL_MESSAGES } from "src/app/@core/entities/constants";
import { AlertService } from "../../../@core/services/alert.service";
import { DriverServices } from "../_services/_driver-info.component.services";
import { DriverTopUp } from "../_entities/_driver-info.data.model";
import { TranslateService } from "@ngx-translate/core";
import { DataStoreService } from "src/app/@core/services";
import { Router } from "@angular/router";
import { DragAndDropService } from "ag-grid-community";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { PaginationInfo } from "src/app/@core/entities/common.entities";
import { SessionStorageService } from "../../../@core/services/storage.service";

declare var $: any;
@Component({
  selector: "app-driver-toptup",
  templateUrl: "./driver-toptup.component.html",
  styleUrls: ["./driver-toptup.component.css"],
})
export class DriverToptupComponent implements OnInit {
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
    this.userRole = this._authService.getCurrentUser();
    this.formInitilize();
    // this.getMyTaxis();
    this.pageNo = 0;
    this.getTopupPage();
    this._storeService.currentStore.subscribe((value) => {
      if (
        value["language"] === "es" ||
        value["language"] === "fr" ||
        value["language"] === "gr" ||
        value["language"] === "it"
      ) {
        this.translate.use(value["language"]);
      } else {
        this.translate.use("en");
      }
    });
  }
  get f() {
    return this.topupForm.controls;
  }

  /*refresh(): Observable<Currency[]> {
    return this._http.get<CurrenciesResponse>('api/refresh').pipe(
        map((res: CurrenciesResponse) => res.data)
    );
  }*/

  formInitilize() {
    this.topupForm = this._formBuilder.group({
      credit: ["", Validators.required],
      wallet_type: ["", Validators.required],
    });
  }
  getMyTaxis() {
    this.isEdit = false;
    if (this.userRole.data.supplierId.toString().length > 0) {
      this._dashboardServices
        .getBilling(this.userRole.data.supplierId, this.userRole.data.id)
        .subscribe(
          (res: any) => {
            if (res.data) {
              //this.myTaxis = res.data; old
              //this.myTaxis = res.data; old
              //map((res: CurrenciesResponse) => res.data)

              this.myTaxis = res.data.map((data) => {
                return {
                  id: data.id,
                  credit: data.credit,
                  driverId: data.driverId,
                  paymentType: data.paymentType,
                  balance: data.balance,
                  drivername: data["drivername"] ? data.drivername : "",
                };
              });

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
  editDriver(taxiId) {
    (<any>$("#driverInfo")).modal("show");
    // this._driverService.getTaxiDetails(taxiId).subscribe(
    //   (res: any) => {
    //     if (res.data) {
    //       this.driverDetails = res.data;
    //       this.topupForm.patchValue(this.driverDetails);
    //       this.isEdit = true;
    //     }
    //   },
    //   (err) => {
    //     this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
    //   }
    // );
  }
  closePopup() {
    (<any>$("#driverInfo")).modal("hide");
  }
  gotoBashboard() {
    // this.closePopup();
    this._router.navigate(["/pages/dashboard"]);
  }
  addUpdateDriverTopup(Id, driverId, e) {
    this.isEdit = true;
    this.isdisplay = false;
    this.myId = Id;
    this.mydriverId = driverId;

    console.info(" Id " + Id + " driverId" + driverId);

    const inputRequest = {
      credit: this.topupForm.value.credit,
      debit: 0,
      driverId: this.mydriverId,
      id: this.myId,
      paymentType: this.topupForm.value.wallet_type,
      balance: 0,
    };

    if (this.topupForm.valid) {
      console.info(
        " this.topupForm.valid " +
          this.topupForm.value.credit +
          " Debit " +
          inputRequest.debit
      );

      this._driverService.topup(inputRequest).subscribe(
        (res) => {
          this._alertService.success("Added Successfully.");
          this.getMyTaxis();
          this.isEdit = false;
          this.reset();
        },
        (err) => {
          this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
        }
      );
    }
  }
  reset() {
    this.topupForm.reset();
    this.formInitilize();
  }
  cancel() {
    this.isEdit = false;
    this.reset();
  }
  onChanged(pageInfo: any) {
    this.paginationInfo.pageNumber = pageInfo.page;
    this.paginationInfo.pageSize = pageInfo.itemsPerPage;
    // this.setPage(pageInfo.page);
    this.pageNo = pageInfo.page ? pageInfo.page : 0;
    this.getTopupPage();
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
    this.storage.setItem("TRIPHISTORYID", driverid);
    this._router.navigate(["/pages/trip-details/trip-history"]);
  }
  getTopupPage() {
   this.isEdit = false;
    if (this.userRole.data.supplierId.toString().length > 0) {
      this._dashboardServices
        .getTopupDetails(this.userRole.data.supplierId, this.pageNo)
        .subscribe(
          (res: any) => {
            if (res.taxiDetails) {
              this.pagedItems = [];
              this.pagedItems = res.taxiDetails;
              if (this.pageNo === 0) {
                this.totalRecords = res.totalItems ? res.totalItems : 0;
              }
            }
            this.isEdit = false;
          },
          (err) => {
            this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
          }
        );
    }
  }
}

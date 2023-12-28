import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaginationInfo } from 'src/app/@core/entities/common.entities';
import { DataStoreService, AuthService } from 'src/app/@core/services';
import { ProfileServices } from '../profile/_services/_profile.component.services';
import { AlertService } from '../../@core/services/alert.service';
declare var $: any;
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  paginationInfo: PaginationInfo = new PaginationInfo();
  previousPage: number;
  pager: any = {};
  pagedItems: any[];
  key: string;
  filterText = '';
  pageNUmber = 1;
  totalRecords: number;
  userRole: any;
  mytaxipageno = 0;
  onlineDetails = [];
  currentRole: string;
  selectDriver: any;
  Coupon = '';
  Percentage = '';
  constructor(private translate: TranslateService,
    private _storeService: DataStoreService,
    private _alertService: AlertService,
    private _router: Router, private _userServices: ProfileServices, private _authService: AuthService) { }

  ngOnInit() {
    this.userRole = this._authService.getCurrentUser();
    this.getOnlineDetails();
  }
  getOnlineDetails() {
    const firstName = this.currentRole === 'NAME' ? this.filterText : 'string';
    const phoneNumber = this.currentRole === 'PHONENUMBER' ? this.filterText : 'string';
     // tslint:disable-next-line:max-line-length
     this._userServices.getTaxiPositionPagination(firstName, phoneNumber,  this.mytaxipageno, this.userRole.data.supplierId).subscribe((res: any) => {
      this.onlineDetails = res.taxiDetails;
      if(this.mytaxipageno === 0){
        this.totalRecords = res.totalItems ? res.totalItems : 0;
      }
    });
  }
  onChanged(pageInfo: any) {
    this.paginationInfo.pageNumber = pageInfo.page;
    this.paginationInfo.pageSize = pageInfo.itemsPerPage;
    this.mytaxipageno = pageInfo.page;
    this.getOnlineDetails();
  }
  selectRole(type) {
    this.currentRole = type;
  }
  applyCoupon(data, index){
    this.selectDriver = '';
    this.selectDriver = data;
  }
  closePopup(){
    // (<any>$("#driverInfo")).modal("hide");
  }
  addCoupon(){
    const inputrequest = {
      'coupan': this.Coupon ? this.Coupon : '',
      'driverId': this.selectDriver.id ? this.selectDriver.id : '',
      'id': 'string',
      'percentage': this.Percentage ? this.Percentage : 0,
      'supplierId': this.userRole.data.supplierId
      };
      this._userServices.addCoupan(inputrequest).subscribe((res: any) => {
        this._alertService.success('Coupon added successfully!');
        this.getOnlineDetails();
      });
  }
}

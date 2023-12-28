import { Injectable } from '@angular/core';

import { HttpService } from '../../../@core/services/http.service';
import { DashBoardConfig } from '../_dashboard-url.config';

@Injectable({ providedIn: 'root' })
export class DashboardServices {
  constructor(private http: HttpService) { }

  getPricetrip(supplier, category) {
    return this.http.get(DashBoardConfig.EndPoint.Dashboard.PriceTrip + supplier + '/' + category);
  }
  getBilling(supplierId,userID) {
    return this.http.get(DashBoardConfig.EndPoint.Dashboard.billing + supplierId + '/' + userID);
  }
  getPRECANCEL_BY_USER(supplierId) {
    return this.http.get(DashBoardConfig.EndPoint.Dashboard.PRECANCEL_BY + supplierId + '/PRECANCEL_BY_USER');
  }
  getPRECANCEL_BY_DRIVER(supplierId) {
    return this.http.get(DashBoardConfig.EndPoint.Dashboard.PRECANCEL_BY + supplierId + '/PRECANCEL_BY_DRIVER');
  }
  getFINISH(supplierId) {
    return this.http.get(DashBoardConfig.EndPoint.Dashboard.PRECANCEL_BY + supplierId + '/FINISH');
  }
  getTaxiPosition(supplierId, userID) {
    return this.http.get(DashBoardConfig.EndPoint.Dashboard.TaxiPosition + supplierId + '/' + userID);
  }
  getSearchByName(supplierId, _userID, Name, page) {
    // return this.http.get(DashBoardConfig.EndPoint.Dashboard.SearchBy + supplierId + '/' + userID + '/string/string/' + Name);
    // return this.http.get(DashBoardConfig.EndPoint.Dashboard.DriverRideStatus +'firstName='+ Name+'&numberPlate=string&page=0&phoneNumber=string&role=ROLE_DRIVER&size=10&supplierId='+ supplierId);
    return this.http.get(DashBoardConfig.EndPoint.Dashboard.DriverStatus +supplierId+ '&page='+page+'&size=10');

  }
  getSearchByNumberPlat(supplierId, userID, NumberPlat) {
    return this.http.get(DashBoardConfig.EndPoint.Dashboard.DriverRideStatus +'firstName=string&numberPlate='+NumberPlat+'&page=0&phoneNumber=string&role=ROLE_DRIVER&size=10&supplierId='+ supplierId);
    // return this.http.get(DashBoardConfig.EndPoint.Dashboard.SearchBy + supplierId + '/' + userID + '/string/' + NumberPlat + '/string');
  }
  getSearchByPhoneNumber(supplierId, userID, PhoneNumber) {
    // tslint:disable-next-line:max-line-length
    // return this.http.get(DashBoardConfig.EndPoint.Dashboard.SearchBy + supplierId + '/' + userID  + '/' +  PhoneNumber + '/string/string');
    return this.http.get(DashBoardConfig.EndPoint.Dashboard.DriverRideStatus +'firstName=string&numberPlate=string&page=0&phoneNumber='+PhoneNumber+'&role=ROLE_DRIVER&size=10&supplierId='+ supplierId);
  }
  getPhoneSearch(phonenumber) {
    return this.http.get('user/v1/get/phonenumber/' + phonenumber);
  }
  getPrice(){
    return this.http.get(DashBoardConfig.EndPoint.Dashboard.Price);
  }
  getUpdate(modal){
    return this.http.put(DashBoardConfig.EndPoint.Dashboard.updatePrice,modal);
  }
  getTotalRide(supplierId) {
    return this.http.get(DashBoardConfig.EndPoint.Dashboard.totalRide + supplierId);
  }
  getTaxiPositionPagination(supplierId, userID, pageNo) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(DashBoardConfig.EndPoint.Dashboard.TaxiPaination + supplierId + '&page=' + pageNo + '&size=10');
  }
  getDriverImage(driverId) {
    // tslint:disable-next-line:max-line-length
    return this.http.get('/driver-photo/id/PROFILE/' + driverId);
  }
  getDriverTripHis(driverId) {
    // tslint:disable-next-line:max-line-length
    return this.http.get('ride/app/v1/get/check/id/' + driverId);
  }
  getTopupDetails(supplierId, pageNo) {
    // tslint:disable-next-line:max-line-length
    return this.http.get('billing/app/driverBilling/v1/pagenation/user?id=' + supplierId + '&page=' + pageNo + '&size=10');
  }
}

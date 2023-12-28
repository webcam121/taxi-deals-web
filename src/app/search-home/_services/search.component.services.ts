import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/@core/services/http.service';
import { appInitializerFactory } from '@angular/platform-browser/src/browser/server-transition';

@Injectable({ providedIn: 'root' })
export class SearchServices {
    resultData: any;
    constructor(private http: HttpService) { }
    getSearchResult(modal) {
         // return this.http.post('taxi/v1/search/auto/ByGeoLocation', modal);
        //  return this.http.post('search/v1/image/search', modal);
         return this.http.post('search/v1/image/advanceSearch', modal);
    }
    getAdvancedSearchResult(modal) {
      // return this.http.post('taxi/v1/search/auto/ByGeoLocation', modal);
      return this.http.post('search/v1/image/advanceSearch', modal);
 }
    uploadImage() {
    }
    getTaxiDetails(taxiId, driverId) {
        return this.http.get('taxi/v1/detailview/' + taxiId + '/' + driverId);
    }
    getTaxiDetail(taxiId, taxiName) {
        return this.http.get('taxi/v1/detailview/' + taxiId + '/' + taxiName);
    }
    getTaxiDetailS(taxiId, taxiName) {
        return this.http.get('taxi/app/taxi/v1/details/' + taxiId);
    }
    getReview(taxiDetailId) {
        return this.http.get('review/app/v1/ByTaxiDetailId/' + taxiDetailId);
    }
    postContactForm(data) {
        return this.http.post('contact/app/mail/create', data);
    }

    setResultData(result) {
        return this.resultData = result;
    }
    postReview(modal) {
        return this.http.post('review/v1/create', modal);
    }
    getCategoryTypeAll() {
        return this.http.get('vehicleType/app/getAll');
    }
    getFarResult(modal) {
        return this.http.post('ride/app/v1/PriceCalculation/gps/', modal);
    }
    getPrice(taxiId) {
        // return this.http.get('price/v1/taxi/' + taxiId);
        return this.http.get('price/app/v1/supplier/' + taxiId);
    }
    offlineSmsBooking(modal) {
      return this.http.post('phoneBooking/app/phoneBooking/v1/userOffline/sms/create', modal);
      // return this.http.post('phoneBooking/app/phoneBooking/v1/userOffline/sms/create/', modal);
  }
  verifyMobile(modal){
    return this.http.post('mobileVerification/app/phoneNumber/v1/twillo/sms' , modal);
  }
  otpVerification(modal){
    return this.http.post('mobileVerification/app/user/twillo/v1/token' , modal);
  }
  getTripPrice(domain){
    return this.http.get('priceTemplate/app/price/v1/'+ domain );
  }
}

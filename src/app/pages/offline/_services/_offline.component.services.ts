import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/@core/services/http.service';
import { OfflineConfig } from '../_offline-url.config';

@Injectable({ providedIn: 'root' })
export class OfflineService {
    constructor(private http: HttpService) { }
    getSearchResult(modal) {
      return this.http.post('search/v2/image/advanceSearch', modal);
 }
    taxiPosition(modal) {
        return this.http.get(OfflineConfig.EndPoint.SMS.TaxiPosition + modal.supplierId + '/' + modal.userId);
    }
    createSms(modal) {
        return this.http.post(OfflineConfig.EndPoint.SMS.CreateSMS, modal);
    }
    driverTopup(modal) {
        return this.http.post(OfflineConfig.EndPoint.BookMessage.Toptp, modal);
    }
    getFarResult(modal) {
        return this.http.post('ride/v1/PriceCalculation/gps/', modal);
    }
    offlineSms(modal) {
        // return this.http.post('phoneBooking/app/phoneBooking/v1/userOffline/sms/create', modal);
        return this.http.post('phoneBooking/app/phoneBooking/v1/userOffline/sms/create/', modal);
    }
    offlineSmsBooking(modal) {
      return this.http.post('phoneBooking/app/phoneBooking/v1/userOffline/sms/create', modal);
      // return this.http.post('phoneBooking/app/phoneBooking/v1/userOffline/sms/create/', modal);
  }
    sendNoticeToDeviceUserAll(modal){
      return this.http.post('notification/tripId/all/user/notice/todevice', modal);
    }
    sendTripToDeviceUserAll(modal){
      return this.http.post('notification/tripId/all/user/todevice', modal);
    }
    getPhoneHistory(supplierId){
      return this.http.get('phoneBooking/app/phoneBooking/v1/allBookings/' + supplierId);
    }
    getToken(phonenumber) {
      return this.http.get('/user/v1/get/phonenumber/{phonenumber}?phonenumber=' + phonenumber);
    }
    getTokenValue(phonenumber) {
      return this.http.get('user/v1/get/phonenumber/' + phonenumber);
    }
}

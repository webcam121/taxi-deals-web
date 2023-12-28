import { Injectable } from '@angular/core';

import { HttpService } from '../../../@core/services/http.service';
import { DriverConfig } from '../_driver-info-url.config';

@Injectable({ providedIn: 'root' })
export class DriverServices {
    constructor(private http: HttpService) { }
    updateDriverInfo(modal) {
        return this.http.post(DriverConfig.EndPoint.DriverStatus.UpdateDriverInfo, modal);
    }
    UpdateDriver(modal) {
      return this.http.post(DriverConfig.EndPoint.DriverStatus.UpdateDriver, modal);
    }
    UpdateVehicle(modal) {
      return this.http.post(DriverConfig.EndPoint.DriverStatus.UpdateVehicle, modal);
    }
    UpdatePricetrip(modal) {
      return this.http.put(DriverConfig.EndPoint.UpdatePricetrip.pricetrip, modal);
    }
    updateDriverInfomation(modal) {
      return this.http.post(DriverConfig.EndPoint.DriverStatus.UpdateDriverInfomation, modal);
  }
    getTaxiDetails(taxiId) {
        return this.http.get(DriverConfig.EndPoint.DriverStatus.GetDriverInfo + taxiId);
    }
    deleteSupplier(supplierId, userID) {
        return this.http.get(DriverConfig.EndPoint.DriverStatus.DeleteSupplier + supplierId + '/' + userID);
    }
    deleteTaxiDetail(taxiId) {
      return this.http.get(DriverConfig.EndPoint.DriverStatus.DeleteTaxi + taxiId );
    }
    addDriver(modal) {
        return this.http.post(DriverConfig.EndPoint.AddNewDriver.SignUP, modal);
    }
    topup(data) {
        return this.http.put(DriverConfig.EndPoint.DriverTopUp.TopUp, data);
    }
    uploadUrl(modal) {
        // console.log('image modal : ', modal)

        return this.http.post(DriverConfig.EndPoint.AddNewDriver.imageUrl, modal);
    }
    smsSend(modal) {
        return this.http.post('phoneNumber/v1/twillo/new/sms', modal);
    }
    otpSend(modal) {
        return this.http.post('user/twillo/v1/token', modal);
    }
    uploadImage(image)  {
        return this.http.post(DriverConfig.EndPoint.AddNewDriver.imageUrl, image);
    }

}

import { Injectable } from '@angular/core';

import { HttpService } from '../../../@core/services/http.service';
import { ProfileConfig } from '../_profile-url.config';

@Injectable({ providedIn: 'root' })
export class ProfileServices {
    constructor(private http: HttpService) { }
    getProfileDetails(userId) {
        return this.http.get(ProfileConfig.EndPoint.ViewProfile.TaxiPositionData + userId);
    }
    updateProfile(modal) {
        return this.http.post(ProfileConfig.EndPoint.ViewProfile.UpdateProfile, modal);
    }
    uploadUrl(modal) {
        return this.http.post(ProfileConfig.EndPoint.ViewProfile.imageUrl, modal);
    }
    getCategoryTypeAll() {
        // return this.http.get('VehicleType/getAll');
        return this.http.get('vehicleType/app/getAll')
    }
    getTaxiPositionPagination(firstName, phoneNumber, pageNo, supplierId){
      // tslint:disable-next-line:max-line-length
      return this.http.get('pagination/app/v2/users/search/get?firstName=' + firstName +'&page=' + pageNo + '&phoneNumber=' + phoneNumber + '&role=string&size=10&supplierId=' + supplierId);
    }
    addCoupan(modal) {
      return this.http.post('coupan/v1/add', modal);
  }
}

import { Injectable } from '@angular/core';

import { HttpService } from '../../../@core/services/http.service';

@Injectable({ providedIn: 'root' })
export class TripServices {
    currentUrl: string;
    constructor(private http: HttpService) { }

    getTrips(modal) {
        if (modal.roleId === 'ROLE_DRIVER') {
            this.currentUrl = 'ride/app/v1/driver/get/' + modal.userId;
        } else if (modal.roleId === 'ROLE_USER') {
            this.currentUrl = 'ride/app/v1/user/get/' + modal.userId;
        } else {
            this.currentUrl = 'ride/app/v1/supplier/get/' + modal.supplierId;
        }
        return this.http.get(this.currentUrl);
    }
    getTaxiPositionPagination(supplierId, pageNo) {
      // tslint:disable-next-line:max-line-length
      // return this.http.get('admin/app/v1/ride/get?id=' + supplierId + '&page=' + pageNo + '&size=10');
       // tslint:disable-next-line:max-line-length
       return this.http.get('pagination/app/v1/ride/get?id=' + supplierId + '&page=' + pageNo + '&size=10');
    }

    getTripsDetail(modal) {
        if (modal.roleId === 'ROLE_DRIVER') {
            this.currentUrl = 'ride/app/ride/v1/invoice/' + modal.rideId;
        }
        else
        {
            ///ride/app/ride/v1/invoice/{rideId}
            this.currentUrl = 'ride/app/ride/v1/invoice/' + modal.tripId;
        }
        return this.http.get(this.currentUrl);
    }
    getSupplier(supplierId) {
        return this.http.get('phoneBooking/v1/allBookings/' + supplierId);
    }

    getinvoice(rideId){
        return this.http.get('ride/v1/invoice/' + rideId);
    }
}

import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/@core/services/http.service';

@Injectable({ providedIn: 'root' })
export class ContactServices {
    constructor(private http: HttpService) { }
    contacts() {
        return this.http.post('contactus/mail/getAll');
    }
    contact(supplierId) {
        return this.http.get('contact/app/mail/' + supplierId);
    }
    bookingInfo(supplierId, pageNO) {
      return this.http.get('admin/app/v1/trip/get?id=' + supplierId + '&page=' + pageNO + '&size=10');
  }
  phonebooking(supplierId, pageNO) {
    return this.http.get('phoneBooking/app/phoneBooking/v1/allBookings/' + supplierId);
}

}

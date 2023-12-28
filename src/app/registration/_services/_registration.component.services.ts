import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/@core/services/http.service';

@Injectable({ providedIn: 'root' })
export class SignUpServices {
    constructor(private http: HttpService) { }
    signUp(modal) {
        return this.http.post('userLogin/app/user/v1/mobile/full/registration', modal);
    }
    uploadImage(modal) {
        return this.http.post('taxi/uploadurl', modal); 
    }
}
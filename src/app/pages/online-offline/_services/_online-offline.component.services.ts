import { Injectable } from '@angular/core';

import { HttpService } from '../../../@core/services/http.service';
import { OnlineOfflineConfig } from '../_online-offline-url.config';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({ providedIn: 'root' })
export class OnlineOfflineServices {
    constructor(
        private http: HttpService,
        private firestore: AngularFirestore  
        ) { }
    getTaxiPositionData(supplierId, userId) {
        return this.http.get(OnlineOfflineConfig.EndPoint.OnlineOffline.TaxiPositionData + supplierId + '/' + userId);
    }
    getTaxiPosition() {
        return new Promise<any>((resolve, reject) =>{
            this.firestore
                .collection("drivers").snapshotChanges()
        });
    }
}

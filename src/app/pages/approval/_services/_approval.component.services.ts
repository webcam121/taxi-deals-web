import { Injectable } from '@angular/core';

import { HttpService } from '../../../@core/services/http.service';
import { ApprovalConfig } from '../_approval-url.config';


@Injectable({ providedIn: 'root' })
export class ApprovalServices {
    constructor(private http: HttpService) { }
      getApprovedList(firstName, phoneNumber, activeFlag,page, supplierId , taxiId) {
       // tslint:disable-next-line:max-line-length
       return this.http.get(ApprovalConfig.EndPoint.Approval.ApprovedNew + 'firstName=' + firstName + '&flag='+ activeFlag +'&page=' + page + '&phoneNumber='+ phoneNumber +'&size=10&supplierId=' + supplierId+ '&taxiId=' + taxiId);
     }
     getDeactiveList(firstName, page, supplierId , taxiId) {
       // tslint:disable-next-line:max-line-length
       return this.http.get(ApprovalConfig.EndPoint.Approval.Deactive + 'firstName=' + firstName + '&page=' + page + '&size=10&supplierId=' + supplierId+ '&taxiId=' + taxiId);
    }
    taxiApproves(supId, userId) {
        if (supId === 0 || supId === '0') {
            return this.http.get(ApprovalConfig.EndPoint.Approval.GetnonApproval + userId);
        } else {
            return this.http.get(ApprovalConfig.EndPoint.Approval.Approval + supId + '/' + userId);
        }
    }
    getApproved(id, userId) {
        return this.http.get(ApprovalConfig.EndPoint.Approval.UpdateApproval + id + '/' + userId);
    }
    getDeactive(id, suppliderId) {
        return this.http.get(ApprovalConfig.EndPoint.Approval.UpdateDeactive + id + '/' + suppliderId);
    }
    getTaxiDetails(taxiId) {
        return this.http.get(ApprovalConfig.EndPoint.Approval.GetApprovalDetails + taxiId);
    }
    updateVehicleInfo(data) {
        return this.http.post(ApprovalConfig.EndPoint.Approval.UpdateVehicleDetails, data);
    }


}

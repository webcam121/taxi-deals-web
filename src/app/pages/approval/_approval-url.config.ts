export class ApprovalConfig {
    public static EndPoint = {
        Approval: {
            GetnonApproval: 'taxi/v2/approves/',
            Approval: 'admin/app/taxi/v1/mytaxies/approve/',
            UpdateApproval: 'admin/app/taxi/v1/approve/',
            UpdateDeactive: 'admin/app/taxi/v1/disapprove/',
            GetApprovalDetails: 'taxi/app/taxi/v1/details/',
            UpdateVehicleDetails: 'taxi/v1/updateInfo',
            Approved: 'pagination/app/v1/approve/role/get?',
            Deactive: 'pagination/app/v1/disapprove/role/get?',
            ApprovedNew: 'pagination/app/v2/approve/role/get?',
        }
    };
}



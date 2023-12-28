export class DriverConfig {
    public static EndPoint = {
        DriverStatus: {
           // UpdateDriverInfo: 'taxi/v1/mytaxies/',
            UpdateDriverInfo: 'taxi/v1/updateInfo',
            GetDriverInfo: 'taxi/app/taxi/v1/details/',
            DeleteSupplier: 'admin/driver/v1/delete/',
            DeleteTaxi: 'admin/app/admin/taxidetail/v1/delete/',
            UpdateDriverInfomation: 'taxiDetail/app/taxi/user/updateInfo',
            UpdateDriver: 'logout/app/user/v2/update',
            UpdateVehicle: 'vehicleType/app/taxi/v1/type/updateInfo'

        },
        AddNewDriver: {
            // SignUP: 'web/supplier/user/v1/type/signup',
            SignUP: 'userLogin/app/user/v1/mobile/detail/registration',
            // imageUrl: 'taxi/uploadurl'
            imageUrl: 'driver-photo/'
        },
        DriverTopUp: {
            //TopUp: 'billing/app/driverBilling/v1/create'
            TopUp: 'billing/app/driverBilling/v1/update'
        },
        UpdatePricetrip: {
          pricetrip: 'price/app/v1/update'
        }
    };
}

export class DashBoardConfig {
  public static EndPoint = {
    Dashboard: {
      TaxiPositions: 'taxi/v1/mytaxies/',
      // TaxiPosition: 'taxi/v1/mytaxies/user/',
      TaxiPosition: 'admin/app/taxi/v1/mytaxies/user/',
      SearchBy: 'admin/app/taxi/v2/mytaxies/user/',
      Price: 'price/v1/all/',
      updatePrice: 'price/v1/update',
      totalRide: 'ride/app/v1/user/get/',
      billing: 'billing/app/driverBilling/v1/allDrivers/',
      TaxiPositionPaination: 'admin/app/taxi/v1/mytaxies/pagenation/user?id=',
      PriceTrip: 'price/app/price/v1/',
      PRECANCEL_BY: 'ride/app/v1/supplier/get/',
      DriverRideStatus:'pagination/app/v2/users/search/get?',
      DriverStatus: 'pagination/app/taxi/v1/mytaxies/pagenation/user?id=',
      TaxiPaination: 'pagination/app/taxi/v1/mytaxies/pagenation/user?id=',
    }
  };
}



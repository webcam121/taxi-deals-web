export class DriverInfo {
    cartype: string;
    category: string;
    id: number;
    name: string;
    phoneNumber: number;
    price: string;
    basePrice: string;
    waitingTime: number;
    imageUrl: string;
    blobkey: string;
    deviceId: string;
    tag: string;
    star: number;
    totalComments: number;
    notification: string;
    loginStatus: string;
    imageInfo: {
        fileName: string;
        imageUrl: string;
        blobkey: string;
    };
    deliveryTime: string;
    debit: number;
    oneSignalValue: string;
    transporttype: string;
    driverStatus: string;
    supplierId: string;
    latitude: number;
    longitude: number;
    driverId: number;
    taxiDetailId: string;
    imageInfos: [];
    licenceNumber: string;
    numberPlate: string;
    amount: number;
    seat?: string;
    vehicleBrand?: string;
    year?: string;
    drivername: string;
    driverPhonenumber: number;
    status: string;
    km: string;
    hour: string;
    carType: string;
}

export class DriverTopUp {
    address: string;
    carType: string;
    code: string;
    deviceId: string;
    domain: string;
    email: string;
    lastname: string;
    hourly: number;
    userId: string;
    isSocialUser: boolean;
    lang: string;
    drivername: string;
    latitude: number;
    licenseNumber: string;
    loginStatus: string;
    longitude: string;
    notification: string;
    password: string;
    phoneNumber: string;
    phoneVerified: string;
    price: string;
    push: string;
    restKey: string;
    role: string;
    socialUser: string;
    status: string;
    website: string;
}

export class taxiDetails {
    id: number;
    taxiId: number;
    supplierId: number;
    userId: number;
    name: string;
    description: string;
    additionalInformation: string;
    latitude: number;
    longitude: number;
    phoneNumber: string;
    taxiNumber: string;
    drivername: string;
    driverPhonenumber: number;
    status: string;
    imageInfos: [];
    currency: string;
    transporttype: string;
    carType: string;
    airPortprice: 0;
    perDay: number;
    weekEndOffer: string;
    price: number;
    peakPrice: number;
    basePrice: number;
    waitingTime: number;
    minimumFare: number;
    source: string;
    destination: string;
    pickUpLocation: string;
    cityDTO: {
      id: number;
      code: string;
      name: string;
      description: string;
      zipCode: string;
      countryId: string;
      region: string;
      lang: string
    };
    supplierDTO: string;
    active: string;
    updatedOn: string;
    city: string;
    year: number;
    vehicleBrand: string;
    seats: string;
    vehicleTypeDTO: {
      id: string;
      code: string;
      name: string;
      description: string;
      lang: string
    };
    tags: []
}

export class  TopupResponse {
  credit:number;
  debit:number;
  driverId:string;
  id:string;
  paymentType:string;
  balanace:number;
}

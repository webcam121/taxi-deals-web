import { MapsAPILoader } from '@agm/core';
import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'highcharts';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/@core/entities/authDataModel';
import { PaginationInfo } from 'src/app/@core/entities/common.entities';
import { GLOBAL_MESSAGES } from 'src/app/@core/entities/constants';
import { AuthService, DataStoreService } from 'src/app/@core/services';
import { AlertService } from 'src/app/@core/services/alert.service';
import { PresenceService } from 'src/app/@core/services/presence.service';
import { DashboardServices } from '../../dashboard/_services/_dashboard.component.services';
import { DriverInfo } from '../_entities/_driver-info.data.model';
import { DriverServices } from '../_services/_driver-info.component.services';

interface point { lat: number; lng: number; imageUrl: string; id?: any; }


declare var $: any;
declare let google: any;
@Component({
  selector: 'app-driver-billing',
  templateUrl: './driver-billing.component.html',
  styleUrls: ['./driver-billing.component.css']
})
export class DriverBillingComponent implements OnInit {


  driverStatusForm: FormGroup;
  isEdit: boolean;
  userRole: AppUser;
  myTaxis = [];
  myTaxisCount: any;
  currentDriverId: string;
  currentTaxiId: string;
  updateInfo: any;
  driverDetails: DriverInfo;
  paginationInfo: PaginationInfo = new PaginationInfo();
  previousPage: number;
  pager: any = {};
  pagedItems: any[];
  key: string;
  filterText = '';
  pageNUmber = 1;
  totalRecords: number;
  reverse: boolean;
  private itemsCollection: AngularFirestoreCollection<any>;
  items: Observable<any[]>;
  itemsDoc: AngularFirestoreDocument<any>;
  // google maps zoom level
  zoom = 16;
  currentLocation: any;
  FirebaseData: any;
  lat: number;
  lng: number;
  private geoCoder;
  // initial center position for the map
  currentPos: any;

  points: point[] = [];
  tmpPoints: point[] = this.FirebaseData;
  driverInfo: string;
  timeInfo: string;
  trackId: any;
  isdisplay: boolean;
  currentCity: any;
  private gridApi;
  private gridColumnApi;

  private autoGroupColumnDef;
  private defaultColDef;
  private rowSelection;
  private rowGroupPanelShow;
  private pivotPanelShow;
  private paginationPageSize;
  private paginationNumberFormatter;
  mytaxipageno = 0;
  constructor(private _alertService: AlertService,
    private _dashboardServices: DashboardServices,
    private _driverService: DriverServices,
    private _authService: AuthService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _presenceService: PresenceService,
    private translate: TranslateService,
    private _storeService: DataStoreService,
    private _mapsApiLoader: MapsAPILoader,
    private _ngZone: NgZone,
    private _fireStore: AngularFirestore,
    private _route: ActivatedRoute) { }


    columnDefs = [
      {
        headerName: 'Action', field: 'edit', cellStyle: { 'cursor': 'pointer', 'text-align': 'left' },
        cellRenderer: (params) => {
          var editButton = document.createElement('i');
          editButton.setAttribute("class", "image-icon permission-icon-Edit fa fa-edit");
          editButton.setAttribute("title", "Edit Detail");
          return editButton;
        },
      },

      { headerName: 'Name', field: 'name' },

      {
        headerName: 'Vechile Image', field: 'vechile',
        cellRenderer: (params) => {
          var element = document.createElement("span");
          var imageElement = document.createElement("img");
          imageElement.setAttribute("class", "img-profile");
          if (params.value != "" && params.value != null) {
            imageElement.src = params.value;
          } else {
            imageElement.src = "assets/img/car.png";
          }
          element.appendChild(imageElement);
          return element;
        }
      },

      // { headerName: 'Car Type', field: 'type' },
      // { headerName: 'Taxi Number', field: 'taxino' },
      // { headerName: 'License Number', field: 'licno' },
      // { headerName: 'Phone Number', field: 'phno' },
      // {headerName: 'Status', field: 'status'},
      {
        headerName: 'Status', field: 'status',
        cellRenderer: (params) => {
          var text = '<h1>Action</h1>';
          var element = document.createElement("span");
          return element;
        }
        }

    ];

    rowData = [
      // { name: 'Rahul', type: "Taxi 4", taxino: "TN 66 F 2321", licno: "4324GJSN82", phno: 9600535201, status: 'Active' },
      ];



  ngOnInit() {
    this.userRole = this._authService.getCurrentUser();
    // console.log('user data : ', this.userRole.data)
    this.formInitilize();
    // this.getMyTaxis();
    this.getMyTaxiPagination();
    this._storeService.currentStore.subscribe((value) => {
      if (value['language'] === 'es' || value['language'] === 'fr' || value['language'] === 'gr' || value['language'] === 'it') {
        this.translate.use(value['language']);
      } else {
        this.translate.use('en');
      }
    });
  }
  formInitilize() {
    this.driverStatusForm = this._formBuilder.group({
      drivername: [''],
      price: [''],
      seats: [''],
      driverPhonenumber: [''],
      peakPrice: [''],
      taxiNumber: [''],
      carType: [''],
      vehicleBrand: [''],
      year: [''],
      status: [''],
      name: [''],
      description: [''],
      email: [''],
      firstName: [''],
      "hour": 0,
      "id": [''],
      "km": 0,
      "lastName": [''],
      "phoneNumber": [''],
      supplierId: [''],
      taxiId: [''],
      userId: [''],
      vehicleYear: [''],
    });
  }
  getMyTaxis() {
    if (this.userRole.data.supplierId.toString().length > 0) {
      // console.log('user id : ', this.userRole.data.supplierId, this.userRole.data.id)
      this._dashboardServices.getTaxiPosition(this.userRole.data.supplierId, this.userRole.data.id).subscribe((res: any) => {
        // console.log('driver state res : ', res)
        if (res.data) {
          // this.myTaxis = res.data;
          this.myTaxis = res.data.map(data => {
            return {
              name: data.name,
              driverStatus: data.driverStatus,
              phoneNumber: data.phoneNumber,
              cartype: data.cartype,
              address: this.getCurrentLocation(data),
              id: data.id,
              driverId: data.driverId
            };
          });
          this.myTaxisCount = this.myTaxis.length > 0 ? this.myTaxis.length : 0;
         //  // // console.log(this.myTaxis);
          this.isEdit = false;
          this.isdisplay = false;
          this.totalRecords = this.myTaxis.length ? this.myTaxis.length : 0;
          this.setPage(1);
          this.myTaxis.forEach(e => {
            e.presence$ = this._presenceService.getPresence(parseInt(e.driverId));
          });





          const obj = {};

          const state = {};

          res.data.forEach(element => {
            state[element.driverStatus] = 0;
          });

          // tslint:disable-next-line:forin
          for (let d in state) {
            res.data.forEach(element => {
              if (d === element.driverStatus) {
                state[d] = state[d] + 1;
              }
            });
          }

          res.data.forEach(element => {
            obj[element.cartype] = 0;
          });

          // tslint:disable-next-line:forin
          for (let k in obj) {
            res.data.forEach(element => {
              if (k === element.cartype) {
                obj[k] = obj[k] + 1;
              }
            });
          }

        }
      }, err => {
        // console.log('driver state error : ', err)
        this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
      });
    }
  }
  getMyTaxiPagination(){
    if (this.userRole.data.supplierId.toString().length > 0) {
      // console.log('user id : ', this.userRole.data.supplierId, this.userRole.data.id)
      this._dashboardServices.getTaxiPositionPagination(this.userRole.data.supplierId, this.userRole.data.id,
        this.mytaxipageno).subscribe((res: any) => {
        // console.log('driver state res : ', res)
        if (res) {
          // this.myTaxis = res.data;
          this.myTaxis = res.taxiDetails.map(data => {
            return {
              name: data.name,
              driverStatus: data.driverStatus,
              phoneNumber: data.phoneNumber,
              cartype: data.cartype,
              address: this.getCurrentLocation(data),
              id: data.id,
              driverId: data.driverId
            };
          });
          this.myTaxisCount = this.myTaxis.length > 0 ? this.myTaxis.length : 0;
         //  // // console.log(this.myTaxis);
          this.isEdit = false;
          this.isdisplay = false;
          if (this.mytaxipageno === 0){
            this.totalRecords = res.totalItems ? res.totalItems : 0;
          }
          this.setPage(1);
          this.myTaxis.forEach(e => {
            e.presence$ = this._presenceService.getPresence(parseInt(e.driverId));
          });





          const obj = {};

          const state = {};

          res.taxiDetails.forEach(element => {
            state[element.driverStatus] = 0;
          });

          // tslint:disable-next-line:forin
          for (let d in state) {
            res.taxiDetails.forEach(element => {
              if (d === element.driverStatus) {
                state[d] = state[d] + 1;
              }
            });
          }

          res.taxiDetails.forEach(element => {
            obj[element.cartype] = 0;
          });

          // tslint:disable-next-line:forin
          for (let k in obj) {
            res.taxiDetails.forEach(element => {
              if (k === element.cartype) {
                obj[k] = obj[k] + 1;
              }
            });
          }

        }
      }, err => {
        // console.log('driver state error : ', err)
        this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
      });
    }
  }
  vechicleDriver(formValue) {
    const inputRequest = {
      active: true,
      additionalInformation: 'string',
      airPortprice: 0,
      basePrice: parseInt(formValue.basePrice, 10),
      carType: formValue.carType,
      city: this.currentCity,
      cityDTO: {
        code: 'string',
        countryId: 0,
        description: 'string',
        id: 0,
        lang: 'string',
        name: 'string',
        region: 'string',
        zipCode: 'string'
      },
      currency: 'string',
      description: 'string',
      destination: 'string',
      driverPhonenumber: formValue.driverPhonenumber + '',
      drivername: formValue.drivername,
      hour: 0,
      id: 0,
      imageInfos: [
        {
          blobkey: 'string',
          fileName: 'string',
          imageUrl: 'string'
        }
      ],
      km: 0,
      latitude: 0,
      longitude: 0,
      minimumFare: 0,
      name: 'string',
      peakPrice: parseInt(formValue.peakPrice, 10),
      perDay: 0,
      phoneNumber: 'string',
      pickUpLocation: 'Any',
      price: parseInt(formValue.price, 10),
      seats: parseInt(formValue.seats, 10),
      source: 'string',
      status: 'string',
      supplierDTO: {
        id: 0,
        licenseNumber: 'string',
        name: 'string',
        userId: 0
      },
      supplierId: this.userRole.data.supplierId,
      tags: ['string'],
      taxiId: this.currentTaxiId,
      taxiNumber: formValue.taxiNumber,
      transporttype: 'airport',
      updatedOn: 'string',
      userId: this.currentDriverId,
      vehicleBrand: formValue.vehicleBrand,
      vehicleTypeDTO: {
        description: 'string',
        id: 0,
        lang: 'string',
        code: 'string',
        name: 'string'
      },
      vehicleYear: formValue.year,
      waitingTime: 0,
      weekEndOffer: 0,
      // tslint:disable-next-line:radix
      year: formValue.year ? parseInt(formValue.year) : 0
    };
    const inputRequest1 = {
        carType: formValue.carType,
        description: 'string',
        "email": "string",
        "firstName": formValue.drivername,
        "hour": 0,
        "id": "string",
        "km": 0,
        "lastName": formValue.drivername,
        name: 'string',
        "phoneNumber": formValue.driverPhonenumber + '',
        seats: parseInt(formValue.seats, 10),
        status: 'string',
        supplierId: this.userRole.data.supplierId,
        taxiId: this.currentTaxiId,
        taxiNumber: formValue.taxiNumber,
        userId: this.currentDriverId,
        vehicleBrand: formValue.vehicleBrand,
        vehicleYear: formValue.year,
      };
      // console.log(inputRequest1);

    this._driverService.updateDriverInfomation(inputRequest1).subscribe(
      (response: any) => {
        this.updateInfo = response;
        if (this.updateInfo.status === true) {
          this._alertService.success(this.updateInfo.message);
          this.isEdit = false;
          this.isdisplay = false;
          // this._router.navigate(['/pages/approval']);
        } else {
          this._alertService.error(this.updateInfo.message);
        }
        // this.getMyTaxis();
        this.getMyTaxiPagination();
      },
      (err) => {
        this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
      }
    );
  }
  editDriver(taxiId) {
    this._driverService.getTaxiDetails(taxiId).subscribe(
      (res: any) => {
        if (res.data) {
          this.driverDetails = res.data;
          this.driverStatusForm.patchValue(this.driverDetails);
          this.currentDriverId = res.data.userId;
          this.currentTaxiId = res.data.taxiId;
          this.currentCity = res.data.city;
          this.isEdit = true;
          this.isdisplay = false;
        }
      },
      (err) => {
        this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
      }
    );
  }
  deleteTaxi(driverId) {
    if (confirm('Are you sure you want to remove this driver?') === true) {
      if (driverId) {
        this._driverService.deleteTaxiDetail(driverId).subscribe((response: any) => {
          // this.getMyTaxis();
          this.getMyTaxiPagination();
          this._alertService.success('Deleted Successfully.');
        });
      }
    }
  }
  getCurrentLocation(taxi): void {
    this._mapsApiLoader.load().then(() => {
      let geocoder = new google.maps.Geocoder;
      let latlng = {
        lat: parseFloat(taxi.latitude),
        lng: parseFloat(taxi.longitude)
      };
      let that = this;
      geocoder.geocode({ 'location': latlng }, function (results) {
        if (results && results.length) {
         //  // // console.log(results[0].formatted_address);
          that.zoom = 11;
          // that.currentLocation = results[0].formatted_address;
          that.currentLocation = results[0].formatted_address;
          //  // // console.log(that.currentLocation);
        } else {
          //  // // console.log('No results found');
          that.currentLocation = 'NA';
        }
      });
      return that.currentLocation;
    });
  }
  // deleteTaxi(driverId) {
  //    // // console.log("Delete Driverid = ", driverId);
  //   this.delete = driverId;
  //   // $('#delete-user').modal('show');
  //   $('document').ready(function () {
  //     $('#delete-user').click(function () {
  //         $('#delete-user').modal('show');
  //     });
  //   });
  // }
  // confirmation() {
  //   if (this.userRole.data.supplierId > 0) {
  //     this._driverService.deleteSupplier(this.userRole.data.supplierId, this.delete).subscribe(
  //       (res: any) => {
  //         this.getMyTaxis();
  //         this._alertService.success('Deleted Successfully.');
  //         $('#delete-user').modal('hide');
  //       },
  //       (err) => {
  //         this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
  //       }
  //     );

  //   }
  // }
  confirmation() {
    // console.log('confirmation');
   }
  clearForm() {
    this.isEdit = false;
    this.isdisplay = false;
    this.driverStatusForm.reset();
  }

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }
  onChanged(pageInfo: any) {
    this.paginationInfo.pageNumber = pageInfo.page;
    this.paginationInfo.pageSize = pageInfo.itemsPerPage;
    this.mytaxipageno = pageInfo.page;
    // this.setPage(pageInfo.page);
    this.getMyTaxiPagination();
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.getPager(this.myTaxis.length, page);

    // get current page of items
    this.pagedItems = this.myTaxis.slice(this.pager.startIndex, this.pager.endIndex + 1);

  }

  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);
    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // if (totalPages <= 5) {
    //   startPage = 1;
    //   endPage = totalPages;
    // } else {
    //   if (currentPage <= 3) {
    //     startPage = 1;
    //     endPage = 5;
    //   } else if (currentPage + 1 >= totalPages) {
    //     startPage = totalPages - 4;
    //     endPage = totalPages;
    //   } else {
    //     startPage = currentPage - 2;
    //     endPage = currentPage + 2;
    //   }
    // }
    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    // create an array of pages to ng-repeat in the pager control
    let pages = this.myTaxis.length;
    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  tracking(driverInfo, lat?, lng?) {
    this.trackId = driverInfo;
    this.isdisplay = true;
    this.currentPos = {
      lat: 50.082730,
      lng: 14.431697,
      id: this.trackId.driverId ? this.trackId.driverId : '',
      Supplier: driverInfo.Supplier,
      driverName: driverInfo.DriverName,
      TimeStamp: new Date(),
      imageUrl: '../../assets/img/type/taxi-cab.png',
    };
    this.points = [];
    let i;
    // this.item = this.itemDoc.valueChanges();
    this.itemsCollection = this._fireStore.collection<any>('DRIVER_STATUS');
    // this.items = this.itemsCollection.valueChanges();


    this.items.subscribe((res: any) => {
      this.FirebaseData = res;
      //  // // console.log('Firebase', this.FirebaseData);
      const i = 0;
      // tslint:disable-next-line:radix
      const driverInfoId = res.filter(data => data.id === parseInt(this.trackId.driverId));
     //   // // console.log(driverInfoId);
      if (driverInfoId.length > 0) {
        if (this.trackId) {
          // tslint:disable-next-line:radix
          const driverId = parseInt(this.trackId.driverId);
          const android = false;
          // tslint:disable-next-line:radix
          const Supplier = parseInt(this.trackId.id);
          const DriverName = this.trackId.name;
          const onlineData = {
            lat: parseFloat(this.trackId.latitude),
            lng: parseFloat(this.trackId.longitude),
            id: driverId,
            Supplier: Supplier,
            android: android,
            driverName: DriverName,
            TimeStamp: new Date(),
            imageUrl: '../../assets/img/type/taxi-cab.png'
          };

          // tslint:disable-next-line:radix
          if (onlineData.id === parseInt(this.trackId.driverId)) {
            this.points.push(onlineData);
            this.currentPos = onlineData;
           //  // // console.log('this.currentPos', this.currentPos);

          }
          // else {
          //   this._alertService.warn('Your token is expired on current date and time');
          // }
          // alert("Tracking");
        }
      }
        else {
        res.forEach((e, idx) => {
          if (e.LOCATION) {
            const latVal = parseFloat(e.LATITUDE);
            e.lat = latVal + lat;
            if (idx === 0) {
              //  // // console.log(e.lat);
            }
            const lngVal = parseFloat(e.LONGITUDE);
            e.lng = lngVal + lng;
            e.LOCATION = e.lat + ',' + e.lng;
            // tslint:disable-next-line:radix
            const driverId = (e.id);
            const android = e.IS_ANDROID;
            const Supplier = parseInt(e.SUPPLIER);
            const TimeStamp = e.LAST_LOGIN;
            const DriverName = e.DRIVER_NAME;
            const onlineData = {
              lat: parseFloat(e.LATITUDE),
              lng: parseFloat(e.LONGITUDE),
              id: driverId,
              Supplier: Supplier,
              android: android,
              driverName: DriverName,
              TimeStamp: new Date(TimeStamp.seconds * 1000),
              imageUrl:  e[e.id] ? '../../assets/img/type/taxi-cab.png' : '../../assets/img/taxi-imgs/none.png',
            };
            const fireBaseLocation = this.FirebaseData.filter(value => value.id === this.trackId.driverId);
            // tslint:disable-next-line:radix
            if (onlineData.id === (this.trackId.driverId)) {
              // console.log(onlineData, 'onlineData');
              if(onlineData.lat === 0 && onlineData.lng === 0 ){
                this.points = [];
              }
              this.points.push(onlineData);
              // this.currentPos = '';
              this.currentPos = onlineData;
              //  // // console.log('this.currentPos', this.currentPos);
             if (onlineData.id > 0 ) {
                this.isdisplay = true;
                this.isEdit = false;
            } else {
              // if (confirm('Tracking not available for this driver') === true) {
              // }
            }
            }
            // else {
            //   this._alertService.warn('Your token is expired on current date and time');
            // }
          }
        });

      }

    });



  }

  mapClicked(e) {
    // console.log(e);
  }
  closeTracking() {
    this.isdisplay = false;
  }
  imageStatus(modal): any{
    if (modal.status === 'STOP') {
      return '../../assets/img/taxi-imgs/none.png';
    } else if(modal.status === 'WAITING') {
      return '../../assets/img/type/taxi-cab.png';
    }  else if(modal.status === 'START') {
      return '../../assets/img/type/car-green.png';
    }
  }

}

import { Component, OnInit, NgZone, ViewChild, Pipe } from "@angular/core";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
} from "@angular/fire/firestore";
import { Observable } from "rxjs/internal/Observable";
import { SidebarService } from "src/app/@core/services/sidebar.service";
import { EventsService } from "src/app/@core/services/events.service";
import { AgmMap, MapsAPILoader } from "@agm/core";
import { PresenceService } from "src/app/@core/services/presence.service";
import { Router } from "@angular/router";
import { AlertService } from "../../@core/services/alert.service";
import { interval } from "rxjs/internal/observable/interval";
import { map, filter } from "rxjs/operators";
import { OnlineOfflineServices } from "./_services/_online-offline.component.services";
import { AuthService } from "../../@core/services/auth.service";
import { AppUser } from "src/app/@core/entities/authDataModel";
import { GLOBAL_MESSAGES } from "../../@core/entities/constants";
import { TranslateService } from "@ngx-translate/core";
import { DataStoreService } from "src/app/@core/services";
import { isEmbeddedView } from "@angular/core/src/view/util";
import { FormGroup, FormBuilder } from "@angular/forms";
interface point {
  lat: number;
  lng: number;
  imageUrl: string;
}
interface rideObject {
  id: string;
  driverId: string;
  source: {
    lat: number;
    lng: number;
  };
  current: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
}
declare var $: any;
@Component({
  selector: "app-online-offline",
  templateUrl: "./online-offline.component.html",
  styleUrls: ["./online-offline.component.css"],
})
export class OnlineOfflineComponent implements OnInit {
  @ViewChild("gmap") gmapElement: any;
  @ViewChild(AgmMap) public agmMap: AgmMap;
  myTaxis = [];
  userId;
  supplierId;
  showMyTaxisChart = false;
  onlineDatas = [];
  offlineDatas = [];
  offlineDataList = [];
  mapDataMode = "offline";
  lat: string;
  lng: string;
  source: string;
  zoom = 10;
  icon = "";
  liveSubscription;
  role;
  taxiArray: any[];
  Name: "";
  taxi = {
    id: "",
    name: "",
    driverStatus: "",
    phoneNumber: "",
    basePrice: "",
    cartype: "",
  };

  private itemsCollection: AngularFirestoreCollection<any>;
  items: Observable<any[]>;
  itemsDoc: AngularFirestoreDocument<any>;
  supperIdwise = [];
  supperIdwise1 = [];
  /** Donut chart data */
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [];
  public doughnutChartType = "doughnut";

  /** LINE CHART DATA */
  public lineChartData: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: "Series A" },
  ];
  public lineChartLabels: Array<any> = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  public lineChartOptions: any = {
    responsive: true,
  };
  public lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(148,159,177,0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
    {
      // dark grey
      backgroundColor: "rgba(77,83,96,0.2)",
      borderColor: "rgba(77,83,96,1)",
      pointBackgroundColor: "rgba(77,83,96,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(77,83,96,1)",
    },
    {
      // grey
      backgroundColor: "rgba(148,159,177,0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
  ];
  public lineChartLegend = true;
  public lineChartType = "line";
  route: any;
  sub: any;
  edited: boolean;
  add: boolean;
  types: any;
  Taxi: any;
  driverStatus: any;
  offDutyDriver: any;
  states: any;
  online = {
    LOCATION: "",
    ID: "",
  };
  Onlinedata: {};

  map: google.maps.Map;
  isTracking = false;
  currentLat: any;
  currentLong: any;
  userRole: AppUser;
  marker: google.maps.Marker;
  isOnlineMode = true;
  FirebaseData: any;
  currentlat;
  currentlng;
  getAddress;
  currentLocation;
  currentPos: point = {
    lat: 50.08273,
    lng: 14.431697,
    imageUrl: "../../assets/img/type/taxi-cab.png",
  };

  rideObject: rideObject = {
    id: "",
    driverId: "",
    source: {
      lat: 0,
      lng: 0,
    },
    current: {
      lat: 0,
      lng: 0,
    },
    destination: {
      lat: 0,
      lng: 0,
    },
  };

  public rideObjects: rideObject[] = [];

  points: point[] = [];
  tmpPoints: point[] = this.FirebaseData;
  driverInfo: any;
  timeInfo: string;
  map1: any[];
  driverStatusForm: FormGroup;
  mapLoader = true;
  constructor(
    private _sidebar: SidebarService,
    private _eventsService: EventsService,
    private _mapsApiLoader: MapsAPILoader,
    private _ngZone: NgZone,
    private _fireStore: AngularFirestore,
    private _presenceService: PresenceService,
    private _router: Router,
    private _alertService: AlertService,
    private _onlineService: OnlineOfflineServices,
    private _authService: AuthService,
    private translate: TranslateService,
    private _storeService: DataStoreService,
    private _formBuilder: FormBuilder
  ) {
    // this.role = localStorage.getItem('role');
    // this.userId = localStorage.getItem('userId');
    // this.supplierId = localStorage.getItem('supplierId');
    // this.lat = '13.5';
    // this.lng = '77.5';
    this.icon = "../../assets/img/taxi-imgs/";
  }
  ngOnInit() {
    this.get();
    this.userRole = this._authService.getCurrentUser();
    this.formInitilize();
    // this.getTaxi();
    // this.getMyTaxis();
    this.setMapDataMode("offline");
    this._storeService.currentStore.subscribe((value) => {
      if (
        value["language"] === "es" ||
        value["language"] === "fr" ||
        value["language"] === "gr" ||
        value["language"] === "it"
      ) {
        this.translate.use(value["language"]);
      } else {
        this.translate.use("en");
      }
    });
  }
  formInitilize() {
    this.driverStatusForm = this._formBuilder.group({
      driverStart: true,
      driverWaiting: true,
      driverOffline: true,
    });
  }

  ngAfterViewInit() {
    this.getTaxi();
  }

  initMap() {
    let map;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const centerPosition = new google.maps.LatLng(-33.91722, 151.23064);
    const mapOptions = {
      zoom: 16,
      center: centerPosition,
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    directionsRenderer.setMap(map);
  }

  getTaxi() {
    let start: any;
    let end: any;
    let current: any;
    let centerPosition = new google.maps.LatLng(-33.93722, 151.23075);
    let mapOptions = {
      zoom: 16,
      center: centerPosition,
    };
    let map = new google.maps.Map(document.getElementById("map"), mapOptions);

    this._fireStore
      .collection("RIDE_KEY")
      .snapshotChanges()
      .subscribe((res) => {
        let taxis = res.map((e) => {
          return e.payload.doc.data();
        });
        taxis.map(async (item: any, index) => {
          if (item.SOURCE && item.DESTINATION) {
            //  console.log('here : ', item.SOURCE, item.DESTINATION)
            start = item.SOURCE;
            end = item.DESTINATION;
            current = new google.maps.LatLng(item.Latitude, item.Longitude);

            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer();
            const requestMap: any = {
              origin: start,
              destination: current,
              travelMode: "DRIVING",
            };
            directionsService.route(requestMap, function (res, stat: any) {
              if (stat == "OK") {
                directionsRenderer.setDirections(res);
                directionsRenderer.setMap(map);
              }
            });
          }
        });
      });
  }

  subscribeLiveMode() {
    setTimeout(() => {
      this.onlineTaxi();
    }, 5000);
  }

  unSubscribeLiveMode() {
    this.liveSubscription.unsubscribe();
  }

  setMapDataMode(type) {
    this.mapDataMode = type;
    if (this.mapDataMode === "online") {
      this.isOnlineMode = true;
      this.onlineTaxi();
      // this.subscribeLiveMode();
    } else {
      this.isOnlineMode = false;
      this.getMyTaxis();
      // this.unSubscribeLiveMode();
    }
  }
  trackMe() {
    if (navigator.geolocation) {
      this.isTracking = true;
      navigator.geolocation.watchPosition((LOCATION) => {
        this.showTrackingPosition(LOCATION);
      });
    } else {
      this._alertService.warn("Geolocation is not supported by this browser.");
    }
  }

  showTrackingPosition(LOCATION) {
    // console.log(`tracking postion:  ${LOCATION.coords.latitude} - ${LOCATION.coords.longitude}`);
    this.currentLat = LOCATION.coords.latitude;
    this.currentLong = LOCATION.coords.longitude;

    const location = new google.maps.LatLng(
      LOCATION.coords.latitude,
      LOCATION.coords.longitude
    );
    this.map.panTo(location);

    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: "Got you!",
      });
    } else {
      this.marker.setPosition(location);
    }
  }
  onlineTaxi(lat?, lng?) {
    let i;

    if (!lat) {
      // this.item = this.itemDoc.valueChanges();
      this.itemsCollection = this._fireStore.collection<any>("DRIVER_STATUS");
      // this.items = this.itemsCollection.valueChanges();
      this.items = this.itemsCollection.snapshotChanges().pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            // for (i = 0; i < this.taxiArray.length; i++) {

            //   if (data.id !== this.taxiArray[i].driverId) {
            //      // console.log('2.Unavailable', data.id);

            //   } else {
            //      // console.log('1.Unavailable', data.id);
            //   }

            // }

            return { id, ...data };
          })
        )
      );

      this.items.subscribe((res: any) => {
        // if (this.onlineDatas.length === 0) {
        //   this.onlineDatas = res;
        // } else {
        this.mapLoader = false;
        this.supperIdwise = [];
        this.supperIdwise = res.filter(
          (value) => value["SUPPLIER"] === this.userRole.data.supplierId
        );
        this.supperIdwise.forEach((e, idx) => {
          // console.log(e.LOCATION);
          if (e.LOCATION) {
            // const arr = e.LOCATION ? e.LOCATION.split(',') : e.LATITUDE;
            const latVal = parseFloat(e.LATITUDE);
            e.lat = latVal + lat;
            if (idx === 0) {
              //  // console.log(e.lat);
            }
            const lngVal = parseFloat(e.LONGITUDE);
            e.lng = lngVal + lng;
            e.LOCATION = e.lat + "," + e.lng;
            // tslint:disable-next-line:radix
            const driverId = parseInt(e.id);
            const onlineData = {
              lat: parseFloat(e.LATITUDE),
              lng: parseFloat(e.LONGITUDE),
              id: driverId,
              imageUrl: this.vehcileImageType(e),
              name: e.DRIVER_NAME,
              cartype: e.CAR_TYPE,
              phoneNumber: e.DRIVER_MOBILE_NUMBER,
              driverStatus: e[e.id] ? "Online" : "Offline",
            };
            //  console.log(onlineData);
            this.onlineDatas.push(onlineData);
            e.presence$ = this._presenceService.getPresence(driverId);

            // tslint:disable-next-line:radix
          }
        });

        // }
      });
    } else {
      this.itemsCollection = this._fireStore.collection<any>("DRIVER_STATUS");
      this.items = this.itemsCollection.snapshotChanges().pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );

      this.items.subscribe((res: any) => {
        this.supperIdwise1 = [];
        this.supperIdwise1 = res.filter(
          (value) => value["SUPPLIER"] === this.userRole.data.supplierId
        );
        this.supperIdwise1.forEach((e) => {
          for (i = 0; i < this.taxiArray.length; i++) {
            if (e.id === this.taxiArray[i].driverId) {
              //  // console.log('Available id', e.id.length);
              if ((e.id = true)) {
                //   // console.log('Online data', e.id);
                e.lat = parseFloat(e.LOCATION.split(",")[0]);
                e.lng = parseFloat(e.LOCATION.split(",")[1]);
                this.trackMe();
                //   // console.log('latitude longitutde22', e.LOCATION);
                //   // console.log('Itemsres - lat', e.LOCATION);
                //   // console.log('Itemsres - lng', e.lng);
              } else {
                // console.log('Offline data', this.taxiArray.length);
                // console.log('latitude longitutde11', e.LOCATION);
              }
            } else {
              //  // console.log('1.1Unavailable', e.id);
            }
          }
          if (e.LOCATION) {
            e.lat = parseFloat(e.LOCATION.split(",")[0]);
            e.lng = parseFloat(e.LOCATION.split(",")[1]);
          }
        });
      });
    }
  }
  adds(id) {
    // let item1 = taxiArray.find(i => i.id === 1);
    // console.log('array value', this.taxiArray);
    // console.log('Taxiid Value...', id);
    id = id;
    let i;
    for (i = 0; i < this.taxiArray.length; i++) {
      const entry = this.taxiArray[i];
      // console.log('Entry value', entry);
      if (id === this.taxiArray[i].id) {
        this.taxi.name = this.taxiArray[i].name;
        this.taxi.driverStatus = this.taxiArray[i].driverStatus;
        this.taxi.phoneNumber = this.taxiArray[i].phoneNumber;
        this.taxi.cartype = this.taxiArray[i].cartype;

        // console.log('Objechhhht id', this.taxiArray[i].name);
        return true;
      }
    }
  }

  // Get My taxis for Donut Chart Data
  getMyTaxis() {
    //  console.log('get my taxis : ', this.userRole.data.supplierId)
    if (this.userRole.data.supplierId) {
      this._onlineService
        .getTaxiPositionData(
          this.userRole.data.supplierId,
          this.userRole.data.id
        )
        .subscribe(
          (res: any) => {
            this.mapLoader = false;
            this.offlineDatas = res.data;
            this.taxiArray = this.offlineDatas;
            this.offlineDataList = res.data;
            localStorage.setItem("taxiArray", JSON.stringify(this.taxiArray));

            // console.log(this.offlineDatas);
            this.offlineDatas.forEach((e) => {
              e.presence$ = this._presenceService.getPresence(e.driverId);
            });

            const obj = {};

            const state = {};

            res.data.forEach((element) => {
              state[element.driverStatus] = 0;
            });

            // tslint:disable-next-line:forin
            for (const d in state) {
              res.data.forEach((element) => {
                if (d === element.driverStatus) {
                  state[d] = state[d] + 1;
                }
              });
            }

            res.data.forEach((element) => {
              obj[element.cartype] = 0;
            });

            // tslint:disable-next-line:forin
            for (const k in obj) {
              res.data.forEach((element) => {
                if (k === element.cartype) {
                  obj[k] = obj[k] + 1;
                }
              });
            }

            // console.log('Pie Object ==-', obj);
            this.types = obj;
            this.states = state;
            this.Taxi = this.types.Taxi;
            this.driverStatus = this.states.WAITING;
            this.offDutyDriver = this.states.STOP;
            // console.log('TAXIpp', this.types.Taxi);
            // console.log('WAITING :::::: ====', this.states.WAITING);

            // tslint:disable-next-line:forin
            for (const k in obj) {
              this.doughnutChartLabels.push(k);
              this.doughnutChartData.push(obj[k]);
            }
            this.showMyTaxisChart = true;
          },
          (err) => {
            this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
          }
        );
    }
  }
  cancel() {
    this.add = false;
    this.edited = false;
  }

  setMap(lat?, lng?) {
    let i;
    if (!lat) {
      // this.item = this.itemDoc.valueChanges();
      this.itemsCollection = this._fireStore.collection<any>("DRIVER_STATUS");
      // this.items = this.itemsCollection.valueChanges();
      this.items = this.itemsCollection.snapshotChanges().pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );

      this.items.subscribe((res: any) => {
        this.FirebaseData = res;
        // console.log("firebase data", this.FirebaseData);
        const i = 0;
        res.forEach((e, idx) => {
          let map;
          if (e.LOCATION) {
            const arr = e.LOCATION.split(",");
            const latVal = parseFloat(arr[0]);
            e.lat = latVal + lat;
            if (idx === 0) {
            }
            const lngVal = parseFloat(arr[1]);
            e.lng = lngVal + lng;
            e.LOCATION = e.lat + "," + e.lng;
            // tslint:disable-next-line:radix
            const id = e.id;
            const driverId = parseInt(e.id);
            const TimeStamp = e.LAST_LOGIN;
            const supplier = e.SUPPLIER;
            const onlineData = {
              lat: parseFloat(arr[0]),
              lng: parseFloat(arr[1]),
              id: driverId,
              TimeStamp: new Date(TimeStamp.seconds * 1000),
              imageUrl: "../../assets/img/type/taxi-cab.png",
              supplier: supplier,
              idd: id,
            };
            const fireBaseLocation = this.FirebaseData.filter(
              (value) => value.id === this.driverInfo
            );
            const previousTime = new Date().getTime();
            const PreviousTimeZone = new Date().getTimezoneOffset() * 60000;
            // tslint:disable-next-line:radix
            const currentTime =
              new Date(parseInt(this.timeInfo)).getTime() + 1 * 60 * 60 * 1000;
            // tslint:disable-next-line:radix
            const currentTimeZone =
              new Date(parseInt(this.timeInfo)).getTimezoneOffset() * 60000;

            // tslint:disable-next-line:radix
            if (onlineData.supplier === this.userRole.data.supplierId) {
              if (onlineData.id === driverId) {
                this.map1 = [];
                // console.log("idx true", e.id);

                this.map1.push(onlineData);
                // console.log("this.map1", this.map1.push(onlineData));

                this.points.push(onlineData);
                this.currentPos = onlineData;
                // console.log(" this.points",  this.points);
                e.presence$ = this._presenceService.getPresence(driverId);
                // this.initMap();
                this.onlineDatas.forEach((e) => {
                  e.presence$ = this._presenceService.getPresence(e.driverId);
                });
              }

              // e.presence$ = this._presenceService.getPresence(driverId);
            } else {
              this._alertService.warn(
                "Your token is expired on current date and time"
              );
            }
          }
        });
      });
    }
  }
  initMaprrr() {
    let map;
    map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(-33.91722, 151.23064),
      zoom: 16,
    });

    let icons = {
      info: {
        icon: "../../assets/img/type/taxi-cab.png",
      },
    };

    // Create markers.
    for (let i = 0; i < this.map1.length; i++) {
      const marker = new google.maps.Marker({
        position: this.map1[i].position,
        icon: icons[this.map1[i].type].icon,
        map: map,
      });
    }
  }
  mapClicked(e) {
    //  console.log(e);
  }
  imageStatus(modal): any {
    if (modal.driverStatus === 'STOP') {
      return '../../assets/img/status/offline.png';
    } else if (modal.driverStatus === 'WAITING') {
      return '../../assets/img/status/waiting.png';
    } else if (modal.driverStatus === 'START') {
      return '../../assets/img/status/online.png';
    }
  }
  fiterStatus(status, type) {
    this.mapLoader = true;
    //  console.log(type);
    if (status === 'START') {
      this.driverStatusForm.patchValue({ driverStart: type });
    } else if (status === 'WAITING') {
      this.driverStatusForm.patchValue({ driverWaiting: type });
    } else if (status === 'STOP') {
      this.driverStatusForm.patchValue({ driverOffline: type });
    }
    const start = this.driverStatusForm.value.driverStart ? 'START' : '';
    const waiting = this.driverStatusForm.value.driverWaiting ? 'WAITING' : '';
    const offline = this.driverStatusForm.value.driverOffline ? 'STOP' : '';
    if (this.mapDataMode === 'online') {
      this.onlineDatas = [];
      this.supperIdwise = this.supperIdwise.map((e) => {
        const driverId = parseInt(e.id);
        const onlineData = {
          lat: parseFloat(e.LATITUDE),
          lng: parseFloat(e.LONGITUDE),
          id: driverId,
          imageUrl: this.vehcileImageType(e),
          name: e.DRIVER_NAME,
          cartype: e.CAR_TYPE,
          phoneNumber: e.DRIVER_MOBILE_NUMBER,
          driverStatus: e[e.id] ? 'Online' : 'Offline',
          status: e[e.id] ? 'WAITING' : 'STOP',
        };
        return onlineData;
      });
      const onlineDate = this.supperIdwise.filter(
        (e) =>
          e.status === start || e.status === waiting || e.status === offline
      );
      onlineDate.map((e) => {
        console.log(e);
        this.onlineDatas.push(e);
        e.presence$ = this._presenceService.getPresence(e.id);
      });
    } else {
      this.offlineDatas = [];
      this.offlineDatas = this.offlineDataList.filter(
        (res) =>
          res.driverStatus === start ||
          res.driverStatus === waiting ||
          res.driverStatus === offline
      );
      //  console.log(this.offlineDatas);
    }
    this.mapLoader = false;
  }
  vehcileImageType(e): any{
    if(e[e.id]) {
      if(e.CAR_TYPE === 'Auto'){
        return '../../assets/img/type/auto.jpg';
      }else {
        return '../../assets/img/type/taxi-cab.png';
      }
    } else {
      return '../../assets/img/taxi-imgs/none.png';
    }
  }
  getCount(status): any {
    if (this.mapDataMode === 'online') {
      if (status === 'WAITING') {
        const WAITING = this.supperIdwise.filter((e) => e[e.id] === true);
        return WAITING.length > 0 ? WAITING.length : 0;
      } else if (status === 'STOP') {
        const STOP = this.supperIdwise.filter((e) => e[e.id] === false);
        return STOP.length > 0 ? STOP.length : 0;
      } else if (status === 'START') {
        const START = this.supperIdwise.filter((e) => e.IS_LOGIN === '');
        return START.length > 0 ? START.length : 0;
      } else if (status === '') {
        const TOTAL = this.supperIdwise;
        return TOTAL.length > 0 ? TOTAL.length : 0;
      }
    } else {
      if (status !== '') {
        const statusCount = this.offlineDataList.filter(
          (res) => res.driverStatus === status
        );
        return statusCount.length > 0 ? statusCount.length : 0;
      } else {
        const statusCount = this.offlineDataList;
        return statusCount.length > 0 ? statusCount.length : 0;
      }
    }
  }
  get() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (position) {
          this.currentlat = position.coords.latitude;
          this.currentlng = position.coords.longitude;
          this.getAddress = (this.currentlat, this.currentlng);
          console.log(position);
          this._mapsApiLoader.load().then(() => {
            const geocoder = new google.maps.Geocoder();
            const latlng = {
              lat: this.currentlat,
              lng: this.currentlng,
            };
            geocoder.geocode(
              {
                location: latlng,
              },
              function (results) {
                if (results[0]) {
                  this.currentLocation = results[0].formatted_address;
                  console.log(this.currentLocation);
                } else {
                  console.log('Not found');
                }
              }
            );
          });
        }
      });
    }
    this.agmMap.triggerResize(true);
    this.zoom = 16;
  }
}

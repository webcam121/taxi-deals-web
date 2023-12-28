import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService, DataStoreService } from 'src/app/@core/services';
import { MapsAPILoader } from '@agm/core';
import { AlertService } from 'src/app/@core/services/alert.service';
import { MessagingService } from 'src/app/@core/services/messaging.service';
import { AppUser } from 'src/app/@core/entities/authDataModel';
import { TranslateService } from '@ngx-translate/core';
import { CountryService } from 'ngx-international-phone-number';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { OfflineService } from '../offline/_services/_offline.component.services';
import { ProfileServices } from '../profile/_services/_profile.component.services';
import { GLOBAL_MESSAGES } from 'src/app/@core/entities/constants';

@Component({
  selector: 'app-direct-booking',
  templateUrl: './direct-booking.component.html',
  styleUrls: ['./direct-booking.component.css']
})
export class DirectBookingComponent implements OnInit {
  @ViewChild('sourcesearch') public sourceElement: ElementRef;
  @ViewChild('destinationsearch') public destinationElement: ElementRef;
  @ViewChild('myDiv') public myDiv: ElementRef;
  bookingSMSForm: FormGroup;
  userRole: AppUser;
  bookMyTaxi = [];
  public inputRequest: any = {
    company: 'string',
    destination: '',
    distance: 0,
    id: 'string',
    km: 0,
    latitude: 0,
    longitude: 0,
    notification: 'string',
    price: 0,
    source: '',
    type: 'string',
  };
  sourceAddress: string;
  destinationAddress: string;
  currentDriverId: number;
  public lat = 51.673858;
  public lng = 7.815982;
  zoom = 12;
  dlng: any;
  dlat: any;
  lat1 = 51.673858;
  lng1 = 7.815982;
  lat2: number;
  lng2: number;
  hide: boolean;
  km: any;
  results: any;
  date: string;
  currentName: String;
  numberPlate: any;
  driverNumber: any;
  phoneNumber: any;
  allowedCountries: ['IN', 'CH'];
  country: any;
  public edited = false;
  searchForm: FormGroup;
  myRide: any;
  totalKM: any;
  response: any;
  isEdit: boolean;
  messages: any;
  id: any;
  driverStatus: any;
  currentcartype: any;
  domain: any;
  distance: any;
  duration: any;
  times: any;
  sourceRegion: string;
  sourceCity: string;
  constructor(private _formBuilder: FormBuilder,
    private _offlineService: OfflineService,
    private _authService: AuthService,
    private _mapsApiLoader: MapsAPILoader,
    private _ngZone: NgZone,
    private _alertService: AlertService,
    private _messagingService: MessagingService,
    private translate: TranslateService,
    private _storeService: DataStoreService,
    private _router: Router,
    private _profileServices : ProfileServices,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.userRole = this._authService.getCurrentUser();
    this.formInitilize();
    this.searchAddress();
    this.getLocations();
     this.date = new Date().toISOString();
     this._storeService.currentStore.subscribe((value) => {
      if (value['language'] === 'es' || value['language'] === 'fr' || value['language'] === 'gr' || value['language'] === 'it') {
        this.translate.use(value['language']);
      } else {
        this.translate.use('en');
      }
    });
      }
  get f() { return this.bookingSMSForm.controls; }
  formInitilize() {
    this.bookingSMSForm = this._formBuilder.group({
      phoneNumber: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],
      source: [''],
      destination: [''],
      rolename: [''],
      userTotalPrice: [''],
      totalPrice: [''],
      originalDistance: [''],
          });
    this.searchForm = this._formBuilder.group({
      source: ['', Validators.required],
      destination: ['', Validators.required],
      cartype: [''],
    });
  }
  getMyTaxis() {
    if (this.userRole.data.supplierId && this.userRole.data.id) {
      const inputRequest = {
        supplierId: this.userRole.data.supplierId,
        userId: this.userRole.data.id
      };
      // console.log('user id : ', this.userRole.data.supplierId, this.userRole.data.id)
      this._offlineService.taxiPosition(inputRequest).subscribe((res: any) => {
        // console.log('book my taxi res : ', res.data)
        if (res.data) {
          this.bookMyTaxi = res.data;
        }

      }, _err => {
        // console.log('book my taxi error : ', _err)
      });
    }
  }
  getLocations() {
    this._mapsApiLoader.load().then(
      () => {
        const autocomplete = new google.maps.places.Autocomplete(this.sourceElement.nativeElement, { types: ['geocode'] });
        const destinationautocomplete = new google.maps.places.Autocomplete(this.destinationElement.nativeElement, { types: ['geocode'] });
        // Set initial restrict to the greater list of countries.
        autocomplete.setComponentRestrictions(
          { 'country': ['in', 'ch', 'gb'] });
        // Set initial restrict to the greater list of countries.
        destinationautocomplete.setComponentRestrictions(
          { 'country': ['in', 'ch', 'gb'] });

        autocomplete.addListener('place_changed', () => {
          this._ngZone.run(() => {
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
            this.sourceAddress = place.formatted_address;
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
             this.lat1 = place.geometry.location.lat();
             this.lng1 = place.geometry.location.lng();
            // this.zoom = 12;
          });
        });

        destinationautocomplete.addListener('place_changed', () => {
          this._ngZone.run(() => {
            const place: google.maps.places.PlaceResult = destinationautocomplete.getPlace();
            this.destinationAddress = place.formatted_address;
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            this.lat2 = place.geometry.location.lat();
            this.lng2 = place.geometry.location.lng();
            this.Init();
            this.initMap();
          });
        });
        autocomplete.addListener('place_changed', () => {
          this._ngZone.run(() => {
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
            this.sourceAddress = place.formatted_address;
            if(place.address_components.length > 0){
              place.address_components.filter(res => {
                if (res.types[0] === 'administrative_area_level_1') {
                  this.sourceRegion = res.long_name;
                } else if (res.types[0] === 'administrative_area_level_2') {
                  this.sourceRegion = res.long_name;
                } else if (res.types[0] === 'administrative_area_level_3') {
                  this.sourceRegion = res.long_name;
                } else if (res.types[0] === 'administrative_area_level_3') {
                  this.sourceRegion = res.long_name;
                }  else if (res.types[0] === 'locality') {
                  this.sourceCity = res.long_name;
                }
              });
            }
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            this.lat = place.geometry.location.lat();
            this.lng = place.geometry.location.lng();
            this.zoom = 12;
            // console.log(this.sourceRegion);
          });
        });

        destinationautocomplete.addListener('place_changed', () => {
          this._ngZone.run(() => {
            const place: google.maps.places.PlaceResult = destinationautocomplete.getPlace();
            const region: google.maps.places.PlaceResult = autocomplete.getPlace()['region'];
            // console.log(region);
            this.destinationAddress = place.formatted_address;
            // console.log(document.getElementsByClassName("region"));
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            this.lat1 = place.geometry.location.lat();
            this.lng1 = place.geometry.location.lng();
            this.bookMyTaxi = [];
            const validate = this.conditionValidation();
            if (validate) {
              const kmfortwo = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(this.lat, this.lng),
                new google.maps.LatLng(this.dlat, this.dlng)
              );
              // // console.log(kmfortwo);
              const metertoKM = kmfortwo ? (kmfortwo / 1000).toFixed(2) : 0;
              this.bookMyTaxi = [];
              const inputRequest = {
                category: "TAXI",
                dateTime: this.getDateFormat(this.searchForm.value['dateTime']),
                destination: this.destinationAddress,
                distance: (metertoKM) ? parseFloat(metertoKM) : 0,
                id: 0,
                km: (metertoKM) ? parseFloat(metertoKM) : 0,
                latitude: this.lat,
                longitude: this.lng,
                radius: 0,
                source: this.sourceAddress,
                type: this.searchForm.value['category'],
                region: this.sourceRegion + ',' + this.sourceCity ? this.sourceRegion + ',' + this.sourceCity : ''
                };
              this.getResult(inputRequest);
            }
          });
        });
      });
    // this.outputData = this.searchService.getResultData();

  }

  getSearchResult() {
    this.getLocations();
    this.initMap();
    document.getElementById("myForm").style.display = "block";
  }

  selectDriver(driverId) {
    this.currentDriverId = driverId;
    let allowedCountries = ['IN', 'CH'];
     for(let i=0; i<=this.bookMyTaxi.length; i++) {

       if (driverId === this.bookMyTaxi[i].driverId) {
         this.numberPlate = this.bookMyTaxi[i].id;
         this.currentName = this.bookMyTaxi[i].name;
         this.driverNumber = this.bookMyTaxi[i].phoneNumber;
         this.currentDriverId = this.bookMyTaxi[i].driverId;
         this.driverStatus = this.bookMyTaxi[i].status;
         this.currentcartype = this.bookMyTaxi[i].carType;
         this.edited = true;
         this.country = this.phoneNumber;
         let countries  = require('country-data').countries;
         for (let j=0; j<=allowedCountries.length; j++) {
           if (require('country-data') === allowedCountries) {
            this.country = require('country-data').countries.countryCallingCodes;
         } else {
          this.country = require('country-data').countries.countryCallingCodes;
         }
        }
      } else {

         // // console.log("current Namer else", this.currentName);
       }
     }

}
  bookBySMS() {
    let input = this.bookingSMSForm.value['phoneNumber'];
    this.bookingSMSForm.value['phoneNumber'] = input.substring(3, 13);
    if (this.bookingSMSForm.valid) {
      const inputRequest = {
        bookingId: "string",
        category: this.bookingSMSForm.value['category'],
        contact:  "string",
        country: "+91",
        destLatitude: this.lat2,
        destLongitude: this.lng2,
        destination: this.destinationAddress,
        display: "string",
        driverId: this.currentDriverId,
        driverName: this.currentName,
        driverPhoneNumber: this.driverNumber,
        id: 0,
        isMobile: "ANDROID",
        km: this.totalKM,
        otp: "string",
        source: this.sourceAddress,
        sourceLatitude: this.lat1,
        sourceLongitude: this.lng1,
        totalPrice: Number(this.bookingSMSForm.value['userTotalPrice']),
        userId: this.userRole.data.id ? this.userRole.data.id : 0,
        userName: this.bookingSMSForm.value['name'],
        userPhoneNumber: this.bookingSMSForm.value['phoneNumber'],
        vechileNumber: this.numberPlate
      };
      // console.log('offline booking sms parameters : ', inputRequest)
      this._offlineService.offlineSmsBooking(inputRequest).subscribe((res: any) => {
        // console.log('offline booking sms res : ', res)
        this.bookMyTaxi = [];
        this.formRest();
        this.totalKM = "";
        this.edited = false;
        // location.reload();
        this._alertService.success(res.message);
        },
        _err => {
          // console.log('offline booking sms error : ', _err)
          this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);

        }
      );
    } else {
      this._alertService.warn('Please enter all details');
    }
  }
  formRest() {
    this.bookingSMSForm.reset();
    this.formInitilize();
  }

  routeTo() {
    this._router.navigate(['pages/ride-calculation']);
  }

  getMyProfile() {
    this._profileServices.getProfileDetails(this.userRole.data.id).subscribe(
      (res: any) => {
        if (res.data) {
          this.domain = res.data.domain;
         }
      },

    );
  }

  Init(){
    var origin1 = {lat: this.lat1, lng: this.lng1};
    var destinationB = {lat: this.lat2, lng: this.lng2};
    var geocoder = new google.maps.Geocoder;

    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
      origins: [origin1],
      destinations: [ destinationB],
      travelMode: google.maps.TravelMode.DRIVING

    }, function(response, status) {
      if (status !== google.maps.DistanceMatrixStatus.OK) {

      } else {
        var originList = response.originAddresses;
        var destinationList = response.destinationAddresses;
        // var outputDiv = document.getElementById('output');
        var showGeocodedAddressOnMap = function(asDestination) {
       };

        for (var i = 0; i < originList.length; i++) {
          var results = response.rows[i].elements;

          // for (var j = 0; j < results.length; j++) {

          //   outputDiv.innerHTML += results[j].distance.text + ' in ' +
          //       results[j].duration.text + '<br>';
          //       this.durations = results[j].duration.text;
          // }
        }
      }
    });
  }

  initMap() {
    this.getMyProfile();
    // this.searchAddress();
    const pointA = new google.maps.LatLng(this.lat1, this.lng1),
      pointB = new google.maps.LatLng(this.lat2, this.lng2),
      myOptions = {
        zoom: 7,
        center: pointA
      },
      map = new google.maps.Map(document.getElementById('map-canvas'), myOptions),
      // Instantiate a directions service.
      directionsService = new google.maps.DirectionsService,
      directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
      }),
      markerA = new google.maps.Marker({
        position: pointA,
        title: 'point A',
        label: 'A',
        map: map
      }),
      markerB = new google.maps.Marker({
        position: pointB,
        title: 'point B',
        label: 'B',
        map: map
      });

    // get route from A to B
    // this.calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);

    directionsService.route({
      origin: pointA,
      destination: pointB,
      travelMode: google.maps.TravelMode.DRIVING
    }, this.destination.bind(this));

  }
  destination(response) {
   //  // // console.log("ride response",response);
    const pointA = new google.maps.LatLng(this.lat1, this.lng1),
      pointB = new google.maps.LatLng(this.lat2, this.lng2),
      myOptions = {
        zoom: 7,
        center: pointA
      },
      map = new google.maps.Map(document.getElementById('map-canvas'), myOptions),
      // Instantiate a directions service.
      directionsService = new google.maps.DirectionsService,
      directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
      }),
      markerA = new google.maps.Marker({
        position: pointA,
        title: 'point A',
        label: 'A',
        map: map
      }),
      markerB = new google.maps.Marker({
        position: pointB,
        title: 'point B',
        label: 'B',
        map: map
      });

    directionsDisplay.setDirections(response);
    if (response.status === 'OK') {
      directionsDisplay.setDirections(response);
      this.response = response;
      this.distance = response.routes[0].legs[0].distance.text;
      this.times = response.routes[0].legs[0].duration.text;
      let km = 1000;
      let km2 = this.distance;
      km2 = km2.replace(/ | /g,'')
      let totalkm = parseFloat(this.distance) / 1000;
      this.totalKM = totalkm * 1000;


      //duration calculation
      const duration = response.routes[0].legs[0].duration.text;
      let time = duration;
      time = time.replace(/ | /g,'')

       let num = parseInt(duration);
       let hours = (num / 60);
       let rhours = Math.floor(hours);
       let minutes = (hours - rhours) * 60;
       let rminutes = Math.round(minutes);
       this.duration = num;

      const inputRequest = {
        category: this.bookingSMSForm.value['category'],
        destination: "string",
        discount: 0,
        distance: this.totalKM,
        domain: this.domain,
        elapsedTime: 0,
        googleKm: this.totalKM,
        latitude: this.lat2,
        longitude: this.lng2,
        region: 'Tamil Nadu',
        rideId: 0,
        sourceLatitude: this.lat1,
        sourceLongitude: this.lng1,
        status: 'string',
        travelTime: 0,
        type: this.currentcartype,
        waitingTime: 0
      };
      this._offlineService.getFarResult(inputRequest).subscribe(
        (res: any) => {
          if (res.data) {
            this.myRide = res.data;
            this.bookingSMSForm.patchValue(this.myRide);
            this._alertService.success(this.messages);

            this.isEdit = true;
          }
        },
        (err) => {
          this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
        }
      );
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  }
  clearForm() {
    this.isEdit = false;
  }
  closeForm() {
    document.getElementById("myForm").style.display = "none";
  }
  onAdvancedSearch() {
    this.bookMyTaxi = [];
    setTimeout(() => {
         // // console.log(this.searchForm.value);
    const validate = this.conditionValidation();
    if (validate) {
      const kmfortwo = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(this.lat, this.lng),
        new google.maps.LatLng(this.dlat, this.dlng)
      );
      // // console.log(kmfortwo);
      const metertoKM = kmfortwo ? (kmfortwo / 1000).toFixed(2) : 0;
      this.bookMyTaxi = [];
      const inputRequest = {
        category: "TAXI",
        dateTime: this.getDateFormat(this.searchForm.value['dateTime']),
        destination: this.destinationAddress,
        distance: (metertoKM) ? parseFloat(metertoKM) : 0,
        id: 0,
        km: (metertoKM) ? parseFloat(metertoKM) : 0,
        latitude: this.lat2,
        longitude: this.lng2,
        radius: 0,
        source: this.sourceAddress,
        type: this.searchForm.value['category'],
        region: this.sourceRegion + ',' + this.sourceCity ? this.sourceRegion + ',' + this.sourceCity : ''
        };
      this.getResult(inputRequest);
    }
    }, 100);

  }
  getDateFormat(dateInfo: string | number | Date): any {
    return dateInfo ? this.datePipe.transform(dateInfo, 'yyyy.MM.dd HH:mm') : '';
  }
  conditionValidation(): boolean {
    if (!this.bookingSMSForm.value.source) {
      this._alertService.warn('Please enter source');
      return false;
    } else if (!this.bookingSMSForm.value.destination) {
      this._alertService.warn('Please enter destination');
      return false;
    }
    return true;
  }
  getResult(inputRequest) {
    // console.log('parameters : ', inputRequest);
    this._offlineService.getSearchResult(inputRequest).subscribe(
      (res) => {
        this.bookMyTaxi = res.data;
         },
      (err) => {
        // console.log('search result error : ', err)
        this._alertService.error(err);
      }
    );
  }
  searchAddress() {
    this._mapsApiLoader.load().then(
      () => {
        const sourceautocomplete = new google.maps.places.Autocomplete(this.sourceElement.nativeElement, { types: ['geocode'] });
        const destinationautocomplete = new google.maps.places.Autocomplete(this.destinationElement.nativeElement, { types: ['geocode'] });
        // const Sourceautocomplete = new google.maps.places.Autocomplete(this.SourceElement.nativeElement, { types: ['geocode'] });
        // const Sourcesautocomplete = new google.maps.places.Autocomplete(this.SourcesElement.nativeElement, { types: ['geocode'] });

        // Set initial restrict to the greater list of countries.
        sourceautocomplete.setComponentRestrictions(
          { 'country': ['in', 'ch', 'gb'] }
          );
        // Set initial restrict to the greater list of countries.
        destinationautocomplete.setComponentRestrictions(
          { 'country': ['in', 'ch', 'gb'] });

        // Set initial restrict to the greater list of countries.
        // Sourceautocomplete.setComponentRestrictions(
        //   { 'country': ['in', 'ch', 'gb'] });

        // // Set initial restrict to the greater list of countries.
        // Sourcesautocomplete.setComponentRestrictions(
        //   { 'country': ['in', 'ch', 'gb'] });

        sourceautocomplete.addListener('place_changed', () => {
          this._ngZone.run(() => {
            const place: google.maps.places.PlaceResult = sourceautocomplete.getPlace();
            this.sourceAddress = place.formatted_address;
            if(place.address_components.length > 0){
              place.address_components.filter(res => {
                if (res.types[0] === 'administrative_area_level_1') {
                  this.sourceRegion = res.long_name;
                } else if (res.types[0] === 'administrative_area_level_2') {
                  this.sourceRegion = res.long_name;
                } else if (res.types[0] === 'administrative_area_level_3') {
                  this.sourceRegion = res.long_name;
                } else if (res.types[0] === 'administrative_area_level_3') {
                  this.sourceRegion = res.long_name;
                }  else if (res.types[0] === 'locality') {
                  this.sourceCity = res.long_name;
                }
              });
            }
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            this.lat = place.geometry.location.lat();
            this.lng = place.geometry.location.lng();
            this.zoom = 12;
            // console.log(this.sourceRegion);
          });
        });

        destinationautocomplete.addListener('place_changed', () => {
          this._ngZone.run(() => {
            const place: google.maps.places.PlaceResult = destinationautocomplete.getPlace();
            const region: google.maps.places.PlaceResult = sourceautocomplete ? sourceautocomplete.getPlace()['region']: '';
            // console.log(region);
            this.destinationAddress = place.formatted_address;
            // console.log(document.getElementsByClassName("region"));
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            this.lat1 = place.geometry.location.lat();
            this.lng1 = place.geometry.location.lng();
          this.initMap();
          });
        });
      });
  }
}

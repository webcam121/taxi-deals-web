import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { DriverServices } from '../_services/_driver-info.component.services';
import { AppUser } from '../../../@core/entities/authDataModel';
import { AuthService } from '../../../@core/services/auth.service';
import { AlertService } from '../../../@core/services/alert.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { GLOBAL_MESSAGES } from '../../../@core/entities/constants';
import { TranslateService } from '@ngx-translate/core';
import { DataStoreService } from 'src/app/@core/services';
import { ProfileServices } from '../../profile/_services/_profile.component.services';
import * as carTypeJson from '../../_configuration/cartye.json';
import { filter } from 'rxjs/operators';

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-add-new-driver',
  templateUrl: './add-new-driver.component.html',
  styleUrls: ['./add-new-driver.component.css']
})
export class AddNewDriverComponent implements OnInit {
  @ViewChild('search') public searchElement: ElementRef;
  @ViewChild('ngOtpInput') ngOtpInputRef: any;//Get reference using ViewChild and the specified hash
  registerDriverForm: FormGroup;
  registerDriverNewForm: FormGroup;
  registerCarDetailsForm: FormGroup;
  searchAddress: string;
  lat: number;
  lng: number;
  addressArray: google.maps.GeocoderAddressComponent[];
  state: string;
  userRole: AppUser;
  imageChangedEvent: File;
  finalImage: File;
  croppedImage: any = '';
  showCropper = false;
  filename: string;
  imageBaseURL: string;
  myProfile: any;
  website: any;
  isEnable: boolean;
  isreceive: boolean;
  selectedSeat: string;
  selectedVehicleBrand: string;
  phone: any;
  otp: any;
  selectedFile: File;
  careTypeData = [];
  constructor(private _router: Router,
    private _driverService: DriverServices,
    private _mapsAPILoader: MapsAPILoader,
    private _ngZone: NgZone,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _alertService: AlertService,
    private translate: TranslateService,
    private _storeService: DataStoreService,
    private _profileService: ProfileServices) { }

  ngOnInit() {
    // const careTypeData = <any>carTypeJson.default;
    // this.careTypeData = careTypeData.filter(res => res.code !== 'All');
    this.getCategoryType();
    this.userRole = this._authService.getCurrentUser();
    // localStorage.getItem("website");
    this.formInitilize();
    this.searchLocation();
    this._storeService.currentStore.subscribe((value) => {
      if (value['language'] === 'es' || value['language'] === 'fr' || value['language'] === 'gr' || value['language'] === 'it') {
        this.translate.use(value['language']);
      } else {
        this.translate.use('en');
      }
    });

  }
  get f() { return this.registerDriverForm.controls; }
  getProfile() {
    this._profileService.getProfileDetails(this.userRole.data.id).subscribe(
      (res: any) => {
        this.myProfile = res.data;
        this.website = this.myProfile.domain;
        this.isreceive = false;
      }, err => {
        // console.log('profile data err : ', err)
      }
    );
  }
  getCategoryType() {
    this._profileService.getCategoryTypeAll().subscribe((res: any) => {
      // console.log('car type res : ', res)
      if (res) {
        this.careTypeData = res;
      }
    }, err => {
      // console.log('car type err : ', err)
      this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
    });

    this.careTypeData = [{ "id": 5128272962650112, "code": "Taxi", "name": "Seadan/(Seats4+1)", "description": "string", "lang": "en" }, { "id": 5135400863531008, "code": "Transport", "name": "Tempo Traveller(Seats12+1)", "description": "string", "lang": "en" }, { "id": 5452971672338432, "code": "Taxi4", "name": "Mini/Hatchback(Seats4+1)", "description": "string", "lang": "en" }, { "id": 5928679968342016, "code": "Taxi6", "name": "SUV-Innova(Seats7+1)", "description": "string", "lang": "en" }];

  }
  formInitilize() {
    this.getProfile();
    this.registerDriverForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength]],
      phoneNumber: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      address: ['', Validators.required],
      carType: ['', Validators.required],
      taxiNumber: ['', Validators.required],
      seats: ['', Validators.required],
      vehicleYear: ['', Validators.required],
      vehicleBrand: ['', Validators.required],
      // basePrice: ['', Validators.required],
      // price: ['', Validators.required],
      // peakPrice: ['', Validators.required],
      // photo: [''],
      // website: [ this.website, Validators.required],
      category: ['', Validators.required],
    });
    this.registerDriverNewForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength]],
      phoneNumber: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      address: ['', Validators.required],
      // photo: ['', Validators.required],
      carType: ['', Validators.required],
      taxiNumber: ['', Validators.required],
      seats: ['', Validators.required],
      vehicleYear: ['', Validators.required],
      vehicleBrand: ['', Validators.required],
      basePrice: ['', Validators.required],
      price: ['', Validators.required],
      peakPrice: ['', Validators.required],
      category: ['', Validators.required],
    });
    this.registerCarDetailsForm = this._formBuilder.group({
      car_type: [''],
      category: [''],
      taxi_no: [''],
      seats: [''],
      vehicle_yr: [''],
      vehicle_brand: [''],
      base_price: [''],
      price: [''],
      peak_price: [''],
      website: ['']
    });
  }
  searchLocation() {
    this._mapsAPILoader.load().then(
      () => {
        const autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types: ['address'] });
        // Set initial restrict to the greater list of countries.
        autocomplete.setComponentRestrictions(
          { 'country': ['in', 'ch', 'gb'] });

        autocomplete.addListener('place_changed', () => {
          this._ngZone.run(() => {
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
            this.searchAddress = place.formatted_address;
            if (place.geometry === undefined || place.geometry === null) {
              this.lat = place.geometry.location.lat();
              this.lng = place.geometry.location.lng();
              return;
            }
            this.lat = place.geometry.location.lat();
            this.lng = place.geometry.location.lng();
            this.addressArray = place.address_components;
            this.searchAddress = place.formatted_address;
            this.state = this.retriveAddressComponents('administrative_area_level_1');

          });
        });
      }
    );
  }
  retriveAddressComponents(type: any) {
    const res = this.addressArray.find(address_components => address_components.types[0] === type);
    const state = this.addressArray.find(geometry => geometry.types[0] === type);
    return state.short_name;
  }
  fileChangeEvent(file: any) {
    this.imageChangedEvent = file;
    const fileToLoad = file.srcElement.files[0];

    const fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent: any) => {
      // // console.log('>>>>>>>ed', fileLoadedEvent);
      // Base64Url
      this.selectedFile = fileLoadedEvent.target.result;

      const inputReq = {
        driver_name: 'string',
        image: file.srcElement.files[0],
        type: 'profile',
        userId: this.userRole.data.id
      }

      // console.log('input params : ', inputReq)
      this._driverService.uploadImage(inputReq).subscribe(
        (res) => {
          // console.log('image upload res : ', res)
        },
        (err) => {
          // console.log('image upload error : ', err)
        })
    };
    fileReader.readAsDataURL(fileToLoad);

  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.registerDriverForm.patchValue({ photo: this.croppedImage });
  }
  imageLoaded() {
    this.showCropper = true;
  }
  cropperReady() {
    // // console.log('Cropper ready');
  }
  loadImageFailed() {
    this._alertService.error('Image failed to upload');
  }
  dataURItoBlob(dataURI) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/png'
    });
  }
  loadImageFileAsURL(event) {
    // get the file name
    this.filename = this.registerDriverForm.value['photo'].replace(/^.*[\\\/]/, '');

    // converting to base64url
    if (this.registerDriverForm.value['photo'].length > 0) {
      const fileToLoad = event.srcElement.files[0];
      const fileReader = new FileReader();
      fileReader.onload = (fileLoadedEvent: any) => {
        // // console.log('>>>>>>>ed', fileLoadedEvent);
        // Base64Url
        this.selectedFile = fileLoadedEvent.target.result;

      };
      fileReader.readAsDataURL(fileToLoad);
    }
  }

  processFile(event) {
    // uploadImage
    // console.log('clicked')
    // let file = event.target.files[0]
    // const reader = new FileReader();
    // reader.event('load', (event: any) => {

    //   this.selectedFile = new ImageSnippet(event.target.result, file);

    //   const inputReq = {
    //     driver_name: 'string',
    //     image: this.selectedFile.file,
    //     type: 'profile',
    //     userId: this.userRole.data.id
    //   }

    //   // console.log('input params : ', inputReq)

    //   // this._driverService.uploadImage(this.selectedFile.file).subscribe(
    //   //   (res: any) => {

    //   //   },
    //   //   (err) => {

    //   //   })
    // });

    // reader.readAsDataURL(file);
  }

  uploadImage() {

    const params = {
      'blobkey': 'string',
      'fileName': this.filename,
      'imageUrl': this.croppedImage
    };
    this._driverService.uploadUrl(params).subscribe((res: any) => {
      // // console.log('uploadimageurl', res.message);
    }, err => {
      this._alertService.success(GLOBAL_MESSAGES.ERROR_MESSAGE);
    });
  }

  selectCategory(category) {
    if (category === 'TAXI') {
      this.registerDriverForm.patchValue({ basePrice: 0, peakPrice: 0, price: 0 });
      this.isEnable = false;
    } else {
      this.isEnable = true;
    }
  }
  selectSeat(selectSeat) {
    this.selectedSeat = selectSeat;

  }
  selectVehicleBrand(selectBrand) {
    this.selectedVehicleBrand = selectBrand;

  }
  addUpdateDriver() {
    if (this.registerDriverForm.valid) {
      // const parameters = {
      //   'address': this.searchAddress,
      //   'basePrice': 0,
      //   'carType': this.registerDriverForm.value['carType'],
      //   'category': this.registerDriverForm.value['category'],
      //   'code': this.state,
      //   'deviceId': 'string',
      //   'domain': this.website,
      //   'email': this.registerDriverForm.value['email'],
      //   'firstName': this.registerDriverForm.value['firstName'],
      //   'hourly': 0,
      //   'id': this.userRole.data.supplierId,
      //   'imageInfo': {
      //     'blobkey': 'string',
      //     'fileName': 'string',
      //     'imageUrl': 'string'
      //   },
      //   'isSocialUser': true,
      //   'lang': 'string',
      //   'lastName': this.registerDriverForm.value['lastName'],
      //   'latitude': this.lat,
      //   'licenseNumber': this.registerDriverForm.value['licenseNumber'],
      //   'loginStatus': 'string',
      //   'longitude': this.lng,
      //   'notification': 'string',
      //   'password': this.registerDriverForm.value['password'],
      //   'peakPrice': 0,
      //   'price': 0,
      //   'phoneNumber': this.registerDriverForm.value['phoneNumber'],
      //   'phoneVerified': 'string',
      //   'push': 'string',
      //   'restKey': 'string',
      //   'role': 'ROLE_DRIVER',
      //   'socialUser': true,
      //   'status': 'string',
      //   'seats': this.registerDriverForm.value['seats'],
      //   'taxiNumber': this.registerDriverForm.value['taxiNumber'],
      //   'vehicleBrand': this.registerDriverForm.value['vehicleBrand'],
      //   'vehicleYear': this.registerDriverForm.value['vehicleYear'],
      //   'website': this.website
      // };

      const parameters = {
        'carType': this.registerDriverForm.value['carType'],
        'category': this.registerDriverForm.value['category'],
        'domain': this.website,
        'email': this.registerDriverForm.value['email'],
        'firstName': this.registerDriverForm.value['firstName'],
        'id': this.userRole.data.supplierId,
        'lastName': this.registerDriverForm.value['lastName'],
        'latitude': this.lat,
        'longitude': this.lng,
        'password': this.registerDriverForm.value['password'],
        'phoneNumber': this.registerDriverForm.value['phoneNumber'],
        'phoneVerified': 'string',
        'role': 'ROLE_DRIVER',
        'token': 'string',
        'website': this.website,
        'seats': this.registerDriverForm.value['seats'],
        'taxiNumber': this.registerDriverForm.value['taxiNumber'],
        'vehicleBrand': this.registerDriverForm.value['vehicleBrand'],
        'vehicleYear': this.registerDriverForm.value['vehicleYear']
      }
      // console.log('parameters : ', parameters)
      this._driverService.addDriver(parameters).subscribe((res: any) => {
        // console.log('add driver res : ', res)
        if (res.status) {
          this._router.navigate(['/pages/driver-info/driver-status']);
          this._alertService.success(res.message);
        } else {
          this._alertService.error(res.message);
        }
        this.cancel();

      },
        err => {
          // console.log('add driver err : ', err)
          this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);

        }
      );
    } else {
      this._alertService.warn('Please enter login details');
    }
  }
  cancel() {
    this.registerDriverForm.reset();
    this.formInitilize();
    // this._router.navigate(['/pages/driver-info/driver-status']);
  }
  smsSend() {
    const parameters = {
      countryCode: "+91",
      password: "",
      phoneNumber: this.registerDriverForm.value['phoneNumber'],
      rideId: 0,
      role: "ROLE_DRIVER",
      token: "",
      userId: 0
    }
    this._driverService.smsSend(parameters).subscribe((res: any) => {
      // // console.log("SMS", res);
      this.isreceive = false;
      this.phone = this.registerDriverForm.value['phoneNumber'];
    })
  }

  smsreceive() {
    // // console.log("OTP", this.ngOtpInputRef.otpForm.value[4]);
    let i;
    this.otp = this.ngOtpInputRef.otpForm.value[4];
    // this.ngOtpInputRef.setValue(Number);
    const parameters = {
      countryCode: "+91",
      password: "",
      phoneNumber: this.phone,
      rideId: 0,
      role: "ROLE_DRIVER",
      token: this.ngOtpInputRef.otpForm.value[4],
      userId: 0
    }
    this._driverService.otpSend(parameters).subscribe((res: any) => {
      // // console.log("SMS", res);
      this._alertService.success(res.message);
    })
  }
}

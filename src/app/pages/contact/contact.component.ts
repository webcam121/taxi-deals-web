import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactServices } from './_services/_contact.component.services';
import { AlertService } from '../../@core/services/alert.service';
import { GLOBAL_MESSAGES } from '../../@core/entities/constants';
import { AppUser } from '../../@core/entities/authDataModel';
import { AuthService, DataStoreService } from 'src/app/@core/services';
import { PaginationInfo } from 'src/app/@core/entities/common.entities';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  contact: any;
  userRole: AppUser;
  filterText: string;
  paginationInfo: PaginationInfo = new PaginationInfo();
  previousPage: number;
  pager: any = {};
  pagedItems: any[];
  totalRecords: number;
  constructor(private _formBuilder: FormBuilder,
    private _contacts: ContactServices,
    private _alertService: AlertService,
    private _authService: AuthService) { }

  ngOnInit() {
    this.userRole = this._authService.getCurrentUser();
    this.saveContactForm();
  }

  saveContactForm() {
    this._contacts.contact(this.userRole.data.supplierId).subscribe(
      (res: any) => {
        // console.log('contact mail res : ', res)
        this.contact = res.data;
        this.totalRecords = this.contact.length ? this.contact.length : 0;
        this.setPage(1);
         // // console.log('Contaxts--', this.contact);
      }, err => {
        // console.log('contact mail error : ', err)
      }
    );
  }
  onChanged(pageInfo: any) {
    this.paginationInfo.pageNumber = pageInfo.page;
    this.paginationInfo.pageSize = pageInfo.itemsPerPage;
    this.setPage(pageInfo.page);
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.getPager(this.contact.length, page);

    // get current page of items
    this.pagedItems = this.contact.slice(this.pager.startIndex, this.pager.endIndex + 1);

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
    let pages = this.contact.length;
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
}

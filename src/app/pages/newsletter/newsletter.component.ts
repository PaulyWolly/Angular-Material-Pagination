import { NewsletterModalComponent } from './../newsletter-modal/newsletter-modal.component';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import {title} from 'process';

import { animate, state, style, transition, trigger} from '@angular/animations';

import { Optional } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit, AfterViewInit {

  isShown: boolean = true;
  showNewsLink: boolean = false;

  //dataSource: any;
  id: any;
  displayName: any;
  email: any;
  userDescription: any;
  editObj: any;
  sort: any;

  public dataSource = new MatTableDataSource([]);

  @ViewChild(MatSort) matSort: MatSort;

// private paginator: MatPaginator;
// @ViewChild(MatSort)
// sort!: MatSort;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  displayedColumns: any;
  length: number;
  pageSize: number=1;
  pageSizeOptions = [3, 5, 10, 50];

  @ViewChild(MatPaginator)
  paginator: MatPaginator;


  @ViewChild('btnShow')
  btnShow!: ElementRef;
  @ViewChild('btnClose')
  btnClose!: ElementRef;



    // pageEvent!: PageEvent;
    // pageSize = 3;
    // pageSizeOptions: number[] = [3, 5, 7, 10, 20];
    // expandedElement:any;

    // displayedColumns: string[] = ['Id', 'Name', 'PersonalInfo', 'editObj'];
    // dataSource: MatTableDataSource<any> = new MatTableDataSource()

  constructor(
    private store: AngularFirestore,
    public afAuth: AngularFireAuth,
    private route: Router,
    @Optional() private modal: NewsletterModalComponent
  ){}

  ngOnInit(){
    this.getAll();
    this.afAuth.onAuthStateChanged((user) => {
      // set up a subscription to always know the login status of the user
      if (user && user.email === 'pwelby@gmail.com') {
        console.log('ADMIN: Newsletter table showing');
        this.isShown = this.isShown;
      } else {
        this.isShown = !this.isShown;
        console.log('non-ADMIN: Newsletter table hidden');
        this.openDialog(title);
      }
    });

    //this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
   }

  openDialog(title: string){
    this.btnShow.nativeElement.click();
  }

  closeDialog(){
    this.modal.btnClose.nativeElement.click();
    // this.route.navigate(['/Login']);
  }

  clearEdit(){
    this.editObj = null;
    this.displayName = "";
    this.userDescription = "";
    this.email = "";
  }

  add(){
    if(this.editObj){
      this.store.collection('users')
        .doc(this.editObj.id)
        .update({displayName : this.displayName, userDescription : this.userDescription, email : this.email});
    } else {
      this.store.collection('users')
        .add({displayName : this.displayName, userDescription : this.userDescription, email : this.email});
    }
    this.closeDialog();

    // this.route.navigate(['/Login']);
    setTimeout(("alert('Your Newsletter info was saved'); ") , 5)

  }

  edit(id: string){
    this.store.collection('users')
      .doc(id)
      .get()
      .subscribe((response) => {
        this.editObj = Object.assign({id : response.id}, response.data());
        this.displayName = this.editObj.displayName;
        this.userDescription = this.editObj.userDescription;
        this.email = this.editObj.email;

        this.openDialog(title);
      })
  }

  delete(id : string){
    const result = confirm('Are you sure you wish to delete?');
    if (result) {
      this.store.collection('users').doc(id).delete();
    }
  }

  // set  up from https://javascript.plainenglish.io/pagination-in-angular-firestore-firebase-database-add-get-documents-14ca723e9c24
  // tableData will contains the document items get from collection
  // tableData: any[] = [];

  // // save first document in snapshot of items received
  // firstInResponse: any = [];

  // // save last document in snapshot of items received
  // lastInResponse: any = [];

  // // keep the array of first document of previous pages
  // prev_strt_at: any = [];

  // // maintain the count of clicks on Next Prev button
  // pagination_clicked_count = 0;

  // // two buttons will be needed by which next data or prev data will be loaded
  // // disable next and prev buttons
  // disable_next: boolean = false;
  // disable_prev: boolean = true;

  // constructor(private angularFirestore: AngularFirestore) {
  //     // initially load first 5 records/items from database
  //     this.loadItems();
  // }

  // getItems() {
  //   this.store.collection('users', ref => ref
  //     .limit(5)
  //     .orderBy('timestamp', 'desc')
  //   ).snapshotChanges()
  //     .subscribe(response => {
  //       if (!response.docs.length) {
  //         console.log("No Data Available");
  //         return false;
  //       }
  //       this.firstInResponse = response.docs[0];
  //       this.lastInResponse = response.docs[response.docs.length - 1];

  //       this.tableData = [];
  //       for (let item of response) {
  //         this.tableData.push(item.doc.data());
  //       }

  //       // initialize values
  //       this.prev_strt_at = [];
  //       this.pagination_clicked_count = 0;
  //       this.disable_next = false;
  //       this.disable_prev = false;

  //       // push first item to use for Previous action
  //       this.push_prev_startAt(this.firstInResponse);
  //     }, error => {
  //       console.log(error);
  //     });
  //   }, error => {
  //       console.log(error);
  //   });
  // }

  //   nextPage() {
  //     this.disable_next = true;
  //     this.angularFirestore.collection('People', ref => ref
  //       .limit(5)
  //       .orderBy('timestamp', 'desc')
  //       .startAfter(this.lastInResponse)
  //     ).get()
  //       .subscribe(response => {
  //         if (!response.docs.length) {
  //           console.log("No More Data Available");
  //           this.disable_next = true;
  //           return;
  //         }
  //         this.firstInResponse = response.docs[0];
  //         this.lastInResponse = response.docs[response.docs.length - 1];
  //         this.tableData = [];
  //         for (let item of response.docs) {
  //           this.tableData.push(item.data());
  //         }
  //         this.pagination_clicked_count++;
  //         this.push_prev_startAt(this.firstInResponse);
  //         if (response.docs.length < 5) {
  //             // disable next button if data fetched is less than 5 - means no more data left to load
  //             // because limit ti get data is set to 5
  //             this.disable_next = true;
  //         } else {
  //             this.disable_next = false;
  //         }
  //         this.disable_prev = false;
  //       }, error => {
  //         this.disable_next = false;
  //       });
  // }

  // prevPage() {
  //   this.disable_prev = true;
  //   this.angularFirestore.collection('People', ref => ref
  //     .orderBy('timestamp', 'desc')
  //     .startAt(this.get_prev_startAt())
  //     .endBefore(this.firstInResponse)
  //     .limit(5)
  //   ).get()
  //     .subscribe(response => {
  //       this.firstInResponse = response.docs[0];
  //       this.lastInResponse = response.docs[response.docs.length - 1];

  //       this.tableData = [];
  //       for (let item of response.docs) {
  //         this.tableData.push(item.data());
  //       }

  //       // maintaing page no.
  //       this.pagination_clicked_count--;

  //       // pop not required value in array
  //       this.pop_prev_startAt(this.firstInResponse);

  //       // enable buttons again
  //       if (this.pagination_clicked_count == 0) {
  //           this.disable_prev = true;
  //       } else {
  //           this.disable_prev = false;
  //       }
  //       this.disable_next = false;
  //     }, error => {
  //       this.disable_prev = false;
  //     });
  // }

  getAll(){
    this.store.collection('users'
    // , ref => ref
      //.limit(7)
      // .orderBy('timestamp', 'desc')
      )
      .snapshotChanges()
      .subscribe((response) => {
        // this.dataSource.data = this.projects;
        this.dataSource.data = response.map(item => {
        return Object.assign({id : item.payload.doc.id}, item.payload.doc.data())
      });
    })
  }

  goBack() {
    window.history.go(-1);
  }

  onMatSortChange() {
    this.dataSource.sort = this.sort;
  }

}

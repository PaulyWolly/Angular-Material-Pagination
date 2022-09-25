import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import { MatSort } from '@angular/material/sort';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';


/**
 * @title Table with pagination
 */
@Component({
  selector: "table-pagination-example",
  styleUrls: ["table-pagination-example.css"],
  templateUrl: "table-pagination-example.html"
})
export class TablePaginationExample implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["position", "name", "weight", "symbol", "edit"];
  dataSource = new MatTableDataSource<PeriodicElement>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  id : any;
  displayName : any;
  email: any;
  userDescription : any;
  editObj : any;

  @ViewChild('btnShow')
  btnShow!: ElementRef;
  @ViewChild('btnClose')
  btnClose!: ElementRef;

  @ViewChild(MatSort)
    sort!: MatSort;

  constructor(
    private store: AngularFirestore,
    private auth: AngularFireAuth,
    private route: Router
  ) {}

  ngOnInit() {
    of(ELEMENT_DATA)
      .pipe(delay(500))
      .subscribe(data => {
        this.dataSource.data = data;
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  openDialog(){
    this.btnShow.nativeElement.click();
  }

  closeDialog(){
    this.btnClose.nativeElement.click();
    this.route.navigate(['/Login']);
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

        this.openDialog();
      })
  }

  add(){
    if(this.editObj){
      this.store.collection('users')
        .doc(this.editObj.id)
        .update({name : this.displayName, personalInfo : this.userDescription, email : this.email});
    } else {
      this.store.collection('users')
        .add({name : this.displayName, userDescription : this.userDescription, email : this.email});
    }
    this.closeDialog();

    // this.route.navigate(['/Login']);
    setTimeout(("alert('Your Newsletter info was saved'); ") , 5)

  }

  delete(id : string){
    const result = confirm('Are you sure you wish to delete?');
    if (result) {
      this.store.collection('users').doc(id).delete();
    }
  }
}

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
  edit: any;
  delete: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: "Hydrogen", weight: 1.0079, symbol: "H", edit: "pencil", delete: "trashcan" },
  { position: 2, name: "Helium", weight: 4.0026, symbol: "He", edit: "pencil", delete: "trashcan" },
  { position: 3, name: "Lithium", weight: 6.941, symbol: "Li", edit: "pencil", delete: "trashcan" },
  { position: 4, name: "Beryllium", weight: 9.0122, symbol: "Be", edit: "pencil", delete: "trashcan" },
  { position: 5, name: "Boron", weight: 10.811, symbol: "B", edit: "pencil", delete: "trashcan" },
  { position: 6, name: "Carbon", weight: 12.0107, symbol: "C", edit: "pencil", delete: "trashcan" },
  { position: 7, name: "Nitrogen", weight: 14.0067, symbol: "N", edit: "pencil", delete: "trashcan" },
  { position: 8, name: "Oxygen", weight: 15.9994, symbol: "O", edit: "pencil", delete: "trashcan" },
  { position: 9, name: "Fluorine", weight: 18.9984, symbol: "F", edit: "pencil", delete: "trashcan" },
  { position: 10, name: "Neon", weight: 20.1797, symbol: "Ne", edit: "pencil", delete: "trashcan" },
  { position: 11, name: "Sodium", weight: 22.9897, symbol: "Na", edit: "pencil", delete: "trashcan" },
  { position: 12, name: "Magnesium", weight: 24.305, symbol: "Mg", edit: "pencil", delete: "trashcan" },
  { position: 13, name: "Aluminum", weight: 26.9815, symbol: "Al", edit: "pencil", delete: "trashcan" },
  { position: 14, name: "Silicon", weight: 28.0855, symbol: "Si", edit: "pencil", delete: "trashcan" },
  { position: 15, name: "Phosphorus", weight: 30.9738, symbol: "P", edit: "pencil", delete: "trashcan" },
  { position: 16, name: "Sulfur", weight: 32.065, symbol: "S", edit: "pencil", delete: "trashcan" },
  { position: 17, name: "Chlorine", weight: 35.453, symbol: "Cl", edit: "pencil", delete: "trashcan" },
  { position: 18, name: "Argon", weight: 39.948, symbol: "Ar", edit: "pencil", delete: "trashcan" },
  { position: 19, name: "Potassium", weight: 39.0983, symbol: "K", edit: "pencil", delete: "trashcan" },
  { position: 20, name: "Calcium", weight: 40.078, symbol: "Ca", edit: "pencil", delete: "trashcan" }
];




/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */

import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IndexDbService } from '../services/index-db.service';
import * as moment from 'moment';
import { DatePickerComponent } from '../shared/date-picker/date-picker.component';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  constructor(private _indexeddbService: IndexDbService, private _router: Router, private _activateRoute: ActivatedRoute) {
    this._indexeddbService.initializeDatabase();
  }
  roleList: any[] = ['Product Designer', 'Flutter Developer', 'QA Tester', 'Product Owner'];
  selectedRole: any = 'Select an item';
  isDropdownOpen: boolean = false;
  selectedDate1: any;
  selectedDate2: any;
  employeeName: any;
  employeeList: any[] = [];
  header = DatePickerComponent;
  editID: any;
  isMobileView: any;

  ngOnInit(): void {  
    this.getData();
    this._activateRoute.queryParams.subscribe((params: any) => {
      if (params.id !== undefined) {
        this.editID = params.id;
        this.getByID();
      } else {
        this.editID = undefined;
        this.employeeName = '';
        this.selectedRole = 'Select an item';
        this.selectedDate1 = undefined;
        this.selectedDate2 = undefined;
      } 
    });
  }

  addData() {
    this._indexeddbService
      .addData({ id: this.employeeList.length === 0 ? 1 : this.employeeList.length - 1, name: this.employeeName, role: this.selectedRole, selectedDate1: moment(this.selectedDate1).format('LL'), selectedDate2: moment(this.selectedDate2).format('LL')})
      .then(() => this._router.navigate(['/']))
      .catch((error) => console.error('Error adding data:', error));
      this.getData();
  }

  getData() {
    this._indexeddbService
      .getData()
      .then((data) => {
        this.employeeList = data; console.log("test", data)
      })
      .catch((error) => console.error('Error retrieving data:', error));
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectItem(item: string) {
    this.selectedRole = item;
    this.isDropdownOpen = false;
  }

  cancel() {
    this._router.navigate(['/']);
  }

  getByID() {
    let id = Number(this._activateRoute.snapshot.queryParamMap.get('id'));
    this._indexeddbService
      .getByID(id)
      .then((data) => {
        this.employeeName = data.name;
        this.selectedDate1 = new Date(data.selectedDate1);
        this.selectedDate2 = new Date(data.selectedDate2);
        this.selectedRole = data.role;
      })
      .catch((error) => console.error('Error retrieving data:', error));
  }

  updateData() {
    this._indexeddbService
    .edit({ id: parseInt(String(this.editID)), name: this.employeeName, role: this.selectedRole, selectedDate1: this.selectedDate1, selectedDate2: this.selectedDate2})
    .then(() => this._router.navigate(['/']))
    .catch((error) => console.error('Error adding data:', error));
    this.getData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkMobileView();
  }

  private checkMobileView() {
    this.isMobileView = window.innerWidth < 768; 
  }

}

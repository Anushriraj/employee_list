import { ChangeDetectorRef, Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IndexDbService } from './services/index-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, DoCheck {
  employeeList: any[] = [];
  transform = 'translateX(0px)';
  constructor(private _router: Router, private _indexeddbService: IndexDbService, private cdr: ChangeDetectorRef) {
    this._indexeddbService.initializeDatabase();
  }

  showNoResults = true;
  swipedIndex: any;


  ngOnInit(): void {
    setTimeout(() => {
      this.getData();
    }, 500)
    // setTimeout(() => {
    //   this.deleteItem(1);
    // }, 5000)
  }

  onClickAdd() {
    this.showNoResults = false;
    this._router.navigate(['/add-employee'])
  }

  ngDoCheck(): void {
      if (this._router.url === '/') {
        this.showNoResults = true;
      }
  }

  getData() {
    this._indexeddbService
      .getData()
      .then((data) => { 
          this.employeeList = data;
          console.log('Data retrieved:', data) 
      })
      .catch((error) => console.error('Error retrieving data:', error));
      this.cdr.detectChanges();
  }

  onSwipeLeft(item: any) {
    this.swipedIndex = item; 
   // this.transform = `translateX(-100px)`;
  }

  onSwipeRight(item: any) {
    if (this.swipedIndex === item) {
      this.swipedIndex = null; 
    }
   // this.transform = `translateX(10px)`;
  }

  deleteItem(id: number) {
    this._indexeddbService.deleteRecordById(id);
    this.swipedIndex = null; 
    this.getData();
  }

  onClickEdit(id: number) {
    this.showNoResults = false;
    this._router.navigate(['/add-employee'], {queryParams: {id: id}})
  }
}

import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatCalendar, MatDatepicker } from '@angular/material/datepicker';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent<D> {
  selectedDate1: any;
  selectedDate2: any;
  private _destroyed = new Subject<void>();
  
  constructor( private _datePicker: MatDatepicker<D>,
    private _calendar: MatCalendar<D>, private _dateAdapter: DateAdapter<D>,   @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    cdr: ChangeDetectorRef) {
      _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
    }

  public todayClicked() {
    this._calendar.activeDate = this._dateAdapter.today();
    this._datePicker.select(this._dateAdapter.today());
    this._datePicker.close();
  }

  public noDateClicked() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilNextMonday = (7 - dayOfWeek + 1) % 7;
    console.log("test", dayOfWeek)
    const nextMonday: any = new Date();
    nextMonday.setDate(new Date().getDate() + daysUntilNextMonday);
    this._calendar.activeDate = nextMonday;
    this._datePicker.select(nextMonday);
    this._datePicker.close();
  }

}

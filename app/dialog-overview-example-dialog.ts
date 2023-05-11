import {Component, Inject, ViewChild, ElementRef, EventEmitter, Renderer2, AfterViewInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatTableDataSource} from '@angular/material';

import { Subject } from 'rxjs/Subject';
import { take, takeUntil } from 'rxjs/operators';

interface Vendor {
 code: string;
 name: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['dialog-overview-example-dialog.scss'],
})
export class DialogOverviewExampleDialog implements AfterViewInit  {
  vendors: Vendor[] = [];
  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource(this.vendors);
  displayNoRecords = false;
  _value: string;
  placeholderLabel = 'Search';
  @ViewChild('innerSelectSearch', {read: ElementRef}) innerSelectSearch: ElementRef;
  @ViewChild('searchSelectInput', {read: ElementRef}) searchSelectInput: ElementRef;
  @ViewChild('itemSelection', { read: ElementRef }) itemSelection: ElementRef;

  onChange: Function = (_: any) => {};

  vendorCode = '';
  private change = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.vendors = data.vendors;
    for (let i = 0; i < 1000; i++) {
      this.vendors[i] = {name: 'Bank ' + i + ' (BankName' + i + ')', code: 'A' + i};
    }

    this.vendorCode = data.vendorCode;
    this.vendors[2].name = '1234s aslkdf;alj ljkas;ldfkjas sdf asd asdfsadfsadfasdf sdfdf';
    this.dataSource = new MatTableDataSource(this.vendors);
  }
  
  ngAfterViewInit() {
    let width = this.itemSelection.nativeElement.offsetWidth;
    console.log(width);
    this.renderer.setStyle(
        this.innerSelectSearch.nativeElement, 
        'width', 
        `${width}px`
      );
    console.log(this.itemSelection.nativeElement.offsetWidth);
    console.log(this.innerSelectSearch.nativeElement.offsetWidth);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.filteredData.length==0) {
      this.displayNoRecords=true;
    } else {
      this.displayNoRecords=false;
    }
    // this.value = this.dataSource.filter;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  onInputChange(value) {
    const valueChanged = value !== this._value;
    if (valueChanged) {
      this._value = value;
      this.onChange(value);
      this.change.emit(value);
    }
  }

  private focus() {
    if (!this.searchSelectInput) {
      return;
    }
    // focus
    this.searchSelectInput.nativeElement.focus();
  }

  public _reset(focus?: boolean) {
    this.searchSelectInput.nativeElement.value = '';
    this.onInputChange('');
    this.applyFilter('');
    this.focus();
  }
  
  getRecord(vendor: string): void {
    this.dialogRef.close(vendor);
  }
}
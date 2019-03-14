import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {FiColType, FiEditorType} from './FiTableEnums';
import {FiTableCol, FiTableConfig} from './fiTableInterfaces';
import {FiFilterBase} from './fiFilterBase';
import {DatePipe} from '@angular/common';


@Component({
    selector: 'fi-table',
    styleUrls: ['./fi-table.css'],
    templateUrl: './fi-table.component.html',
})
export class FiTableComponent implements OnInit {

    // Input and Outputs(Events)

    // Table'ın Datası rows alanındadır.
    // @Input() public rows: Array<any> = [];
    // @Input() public allowRemoteFilter = false;

    @Output() public tableChanged: EventEmitter<any> = new EventEmitter();
    @Output() public cellClicked: EventEmitter<any> = new EventEmitter();

    // Table values

    public rowsFiltered: any[] = [];
    private _rows: any[] = [];

    public page = 1;
    public pageSize = 10;

    //public itemsPerPage = 10;
    //public maxSize = 5;
    //public numPages = 1;
    //public length = 0;

    public currentItem: any;
    public currentColumnToSort: FiTableCol;

    public showFilterRow = false;

    private _columns: FiTableCol[] = [];
    private _config: FiTableConfig = {};

    // Template'den Enum ve Tiplere ulaşmak için tanımlandı.
    fiEditorType = FiEditorType;
    fiColtype = FiColType;
    dateFormat = 'dd/MM/yyyy';

    public constructor(private sanitizer: DomSanitizer,private datepipe: DatePipe) {

    }

    ngOnInit() {
        //this.onChangeTable(this.config);
        //this.rowsFiltered = this.rows;
    }

    @Input()
    public set rows(rowsData: any[]) {

        if (!rowsData) {
            rowsData=[];
        }

        for (let index = 0; index < rowsData.length; index++) {
            const element = rowsData[index];
            element.fiIndex = index + 1;
        }

        console.log('Rows Yeniden Set Edildi.');

        this._rows = rowsData;
        this.rowsFiltered = rowsData;
        this.filterAndSortTable();
    }

    public get rows(): any[] {
        return this._rows;
    }

    @Input()
    public set config(conf: FiTableConfig) {

        // FIXME class diger string olarak gönderilebilir
        // Classname array olarak gelmişse onlar birleştirilir.
        if (!conf.className) {
            conf.className = 'table-bordered';  // table-striped is removed.
        }
        if (conf.className instanceof Array) {
            conf.className = conf.className.join(' ');
        }

        conf.columns.forEach(value => {

            if(conf.filterAuto) {
                if(!value.filtering) {
                    value.filtering = new FiFilterBase();
                }
            }

        });

        if(conf.pageSize) {
            this.pageSize = conf.pageSize;
        }

        this._config = conf;

        //col ve row input ile almalı, burada alınca değişimleri takip etmiyor, non-reactive
        //this.columns = conf.columns;
        //this.rows = conf.rows;

    }

    public get config(): FiTableConfig {
        return this._config;
    }

    @Input()
    public set columns(fiColumns: FiTableCol[]) {

        fiColumns.forEach((value: FiTableCol) => {

            if (value.filtering) {
                this.showFilterRow = true;
            }

            if (value.className && value.className instanceof Array) {
                value.className = value.className.join(' ');
            }

            const column = this._columns.find((col: any) => col.field === value.field);
            if (column) {
                Object.assign(column, value);
            }
            if (!column) {
                this._columns.push(value);
            }
        });

    }

    public get columns(): FiTableCol[] {
        return this._columns;
    }

    public sanitize(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    public get configColumns(): any {

        const sortColumns: any[] = [];

        this.columns.forEach((column: any) => {
            if (column.sort) {
                sortColumns.push(column);
            }
        });

        return {columns: sortColumns};
    }

    // sortchange için kullanılıyordu, değiştirildi, onsortchange metoduna yönlenir sort eylemi
    public onChangeTable(column: FiTableCol): void {

        this._columns.forEach((col: FiTableCol) => {
            if (col.field !== column.field && col.sort !== false) {
                col.sort = '';
            }
        });

        this.tableChanged.emit({sorting: this.configColumns});
    }

    public filterAndSortTable(): void {

        //console.log('Filter and Sort');

        let columnToSort = this.currentColumnToSort;

        let columnToSortName = '';

        if (this.currentColumnToSort !== undefined) {
            columnToSortName = this.currentColumnToSort.field;
        }

        // diger sütunlar sort alanı(property) temizlenir.
        this._columns.forEach((col: FiTableCol) => {

            let colNameBinded = false;

            if (!colNameBinded && columnToSortName === '') {
                col.sort = '';
                colNameBinded = true;
            }

            if (!colNameBinded && col.field !== columnToSortName && col.sort !== false) {
                col.sort = '';
            }

        });

        // this.tableChanged.emit({sorting: this.configColumns});

        // onchange Table Metodu
        // if (this.config.filtering) {
        //   Object.assign(this.config.filtering, this.config.filtering);
        // }

        // if (this.config.sorting) {
        // Object.assign(hedef,kaynaklar...)
        //   Object.assign(this.config.sorting, this.config.sorting);
        // }
        //console.log('rows:',this._rows );
        //console.log('config:', this.config);

        const filteredData = this.filterData(this._rows, this.config);
        const sortedData = this.changeSort(filteredData, columnToSort);
        // FIXME buradaki eski yapı düzeltilmedi
        // this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
        this.rowsFiltered = sortedData;
        // FIXME buradaki eski yapı düzeltilmedi
        // this.length = sortedData.length;

        // this.tableChanged.emit({sorting: this.configColumns});
    }




    public onSortTable(columnToSort: FiTableCol): void {

        this.currentColumnToSort = columnToSort;

        this.filterAndSortTable();

    }

    public changeSort(filteredData: any[], columnToSort: FiTableCol): any {

        if (columnToSort === undefined) {
            return filteredData;
        }

        if (!this.config.sorting) {
            return filteredData;
        }

        const columns = this.config.sorting.columns || [];
        let columnName: string = void 0;
        let sort: string = void 0;

        // for (let i = 0; i < columns.length; i++) {

        //   if (columns[i].sort === "" && columns[i].sort !== false){
        //     console.log('fi Index set');
        //     columnName= "fiIndex";
        //     sort = 'asc';
        //   }

        //   if (columns[i].sort !== '' && columns[i].sort !== false) {
        //     columnName = columns[i].name;
        //     sort = columns[i].sort;
        //   }
        // }

        //console.log(columnToSort);

        // if(columnToSort.sort==false){
        //   return data;
        // }

        if (columnToSort.sort === '') {
            // console.log('fi Index set');
            columnName = 'fiIndex';
            sort = 'asc';
        }

        if (columnToSort.sort !== '' && columnToSort.sort !== false) {
            columnName = columnToSort.field;
            sort = columnToSort.sort;
        }

        if (!columnName) {
            return filteredData;
        }

        // console.log(filteredData);

        // if (filteredData[0].fiIndex === undefined) {
        //   console.log('fi Index baglandı');
        //   for (let index = 0; index < filteredData.length; index++) {
        //     const element = filteredData[index];
        //     element.fiIndex = index;
        //   }

        // }

        //console.log(filteredData);

        // simple sorting
        return filteredData.sort((previous: any, current: any) => {
            if (previous[columnName] > current[columnName]) {
                return sort === 'desc' ? -1 : 1;
            } else if (previous[columnName] < current[columnName]) {
                return sort === 'asc' ? -1 : 1;
            }
            return 0;
        });
    }


    public filterData(data: any, config: FiTableConfig): any {

        let filteredData: any[] = data;

        //uncomm  -- aynı objeyi işaret ediyorlar
        //console.log('this columns:', this.columns );
        //console.log('config columns:', config.columns );

        this.columns.forEach((column: FiTableCol) => {

            if (!column.filtering) {
                return;
            }

            // false olanları filtreliyor,kaldırıyor, true olanlar kalıyor sadece
            filteredData = filteredData.filter((item: any) => {

                // filterstring yoksa filtreleme yapmıyor
                if(!column.filtering.filterString) {
                    return true;
                }

                let cellValue = item[column.field].toLocaleLowerCase();

                if(column.colType === FiColType.date) {
                    // TODO note pipe fonksiyon olarak kullanma : github
                    cellValue = this.datepipe.transform(cellValue, this.dateFormat);
                }

                return cellValue.match(column.filtering.filterString.toLocaleLowerCase());

            });
        });

        // if (!config.filtering) {
        //     return filteredData;
        // }
        //
        // if (config.filtering.columnName) {
        //     return filteredData.filter((item: any) =>
        //         item[config.filtering.columnName].toLocaleLowerCase().match(this.config.filtering.filterString.toLocaleLowerCase()));
        // }
        //
        // const tempArray: any[] = [];
        // filteredData.forEach((item: any) => {
        //     let flag = false;
        //     this.columns.forEach((column: any) => {
        //         //if (item[column.name].toString().match(this.config.filtering.filterString)) {
        //         //console.log('303 ngtablecomp');
        //         //console.log(item[column.name].toString().toLocaleLowerCase());
        //         //console.log(this.config.filtering.filterString.toLocaleLowerCase());
        //         item[column.field] = '' + item[column.field];  // ??? no errors from number types
        //         this.config.filtering.filterString = '' + this.config.filtering.filterString;
        //         if (item[column.field].toString().toLocaleLowerCase().match(this.config.filtering.filterString.toLocaleLowerCase())) {
        //             flag = true;
        //         }
        //     });
        //     if (flag) {
        //         tempArray.push(item);
        //     }
        // });
        // filteredData = tempArray;

        return filteredData;
    }

    public getData(row: any, column: FiTableCol): string {

        const propertyName: string = column.field;

        // if dot seperator is used in a field name
        //let cellvalue = propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);

        let cellvalue = row[propertyName];

        if (column.colType === FiColType.double) {

            //console.log('type of',typeof(cellvalue));

            if (typeof (cellvalue) === 'number') {
                cellvalue = cellvalue.toFixed(2);
            }

            if (typeof (cellvalue) === 'string') {
                cellvalue = parseFloat(cellvalue).toFixed(2);
            }

        }

        if (column.colType === FiColType.boolean) {

        }

        return cellvalue;
    }

    public cellClick(row: any, column: any): void {
        //console.log('cell click event on Table Component');
        this.cellClicked.emit({row, column});
    }

    public rowClick(event: any, item: any) {
        //console.log('row click event:');
        //console.log(event);
        this.currentItem = item;
    }

    pageChanged(config: FiTableConfig, $event: number) {
        //console.log('config', config);
        //console.log('$event', $event);
    }

    editorUserRenderer(column: FiTableCol, row: any, cellValue: any, fiComp: any) {

        if (column.editorRenderer) {
            column.editorRenderer(row, cellValue, fiComp);
        }

    }

    onFilterUserAction(column: FiTableCol, filterComp: HTMLInputElement) {
        if (column.filterAction) {
            column.filterAction(column,filterComp);
        }
    }


    styleTableCell(fiTableTd: HTMLTableDataCellElement, column: FiTableCol) {

        if(column.colType===FiColType.double || column.colType===FiColType.integer) {
            fiTableTd.style.textAlign = 'right';
        }

    }

    styleTableRow(fiTableTr: HTMLTableRowElement, row: any) {

    }

    styleFiTableHeader(fiTableHeader: HTMLTableHeaderCellElement, column: FiTableCol) {

        if(column.prefSize) {
            //fiTableHeader.style.width = String(column.prefSize);
        }

    }
}

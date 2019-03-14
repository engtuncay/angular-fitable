import {FiEditorType, FiColType} from './FiTableEnums';

export interface FiTableConfig {

    /**
     *
     */
    paging?: boolean;
    pageSize?:number;

    /**
     * Type: Any = Boolean or String
     *
     * if defined , sorting will be done
     * Sort ype is identified as asc,desc,...
     *
     * Sorting yapılıp yapılmayacağına veya
     * Sorting tipini (asc veya desc) belirtir
     */
    sorting?: any;

    /**
     *
     */
    //filtering?: FiFilter;

    /**
     * Table alacağı stil sınıfları
     * Tek String veya String array oluyor
     */
    className?: any;

    /**
     * FIXME zorunlu olması lazım
     * Tablonun sütunları
     */
    columns?: FiTableCol[];
    rows?: any[];
    filterAll?: FiFilter;
    filterAuto?:boolean;


}

export interface FiTableCol {

    title: string;
    field: string;
    filtering?: FiFilter;
    autoFilter?:boolean;
    sort?: any;
    sortable?:boolean;
    className?: any;
    colType?: FiColType;
    colClassName?: string;
    sortPrevious?: string;
    editorType?: FiEditorType;  /*string verilince de kabul etti*/
    editorHeader?: string;
    editorRenderer?: (row: any, cellValue: any, fiComp: any)=>void;
    editorAction?: (row: any,cellValue: any, ficolumn:FiTableCol , fiComp: any)=>void;
    prefSize?:string;
    printSize?:number;
    minSize?:string;
    summaryType?:string;  /* FiEditorType gibi yapılabilir*/
    summaryFunc?: any;
    fiEditable?:boolean;
    fiHidden?:boolean;
    filterAction?: (ficolumn:FiTableCol , fiComp: any)=>void;
    /* In excel,or print it should be highlighted with yellow or soft grey*/
    isHighlighted?:boolean;

    /*
	String comment;
	Map<String, String> mapStyle;    // ColStyle,String şeklindeydi

	String cellFactoryClass;
	// excelden sütunları ayarlar opsiyonel sütunların belinmesi için , vs..
	Boolean isOptional;
	// excekde sütunun bulunduğunu gösterir
	Boolean isExist;

	Boolean colFilterable;
	// Tablo başlıklarındaki filtre için ve formlar daki comp.ler için
	String colFxNodeHeader;
	String colFxNodeClass;
	Node colFxNode;
	// Tablo başlığındaki filtre editoründe enter basılınca işlenecek event
	EventHandler<KeyEvent> colEditorEnterFn;
	// excel kaçıncı sütunda olduğunu gösterir
	Integer colIndex;

	// For Forms, entity is edit value for the field
	N entity;
	// Formlarda değer tutmak için veya default değer atamak için
	Object fiValue;

	// experimental
	Function<Object, String> funcFormatter;
	Format formatter;

	// For Excel Reading, the field shows whether or not column exists in the excel
	Boolean colEnabled;
	Consumer<N> cellFactoryAction;

	FxVBox vboxHeader;
	// oztable dan fxtablecol a convert işlemi buraya kadar yapıldı.

	BiConsumer<Object, Node> cellFactoryNodeBiAction;
	BiConsumer<Object, Node> cellFactoryNodeRendererFn;
	*/
}

export interface FiFilter {

    filterString?: string;
    placeholder?: string;
    columnName?:string;
    filterValue?:string;

}



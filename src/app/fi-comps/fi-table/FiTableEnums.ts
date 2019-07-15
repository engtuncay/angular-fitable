export enum FiColType {
  double = 1
  ,string = 2
  ,integer = 3
  ,boolean = 4
  ,date = 5
  ,datetime = 6
}

export class FiEditorType {
  static Button = 'Button';
  static CheckBox = 'Checkbox';
  static TextBox = 'TextBox';
  static NgSelect = 'NgSelect';
  static NgbDatePicker = 'NgbDatePicker';
}

export enum FiTableDataType {
  plainTable = 1,
  pagingWithLocalData=2,
  pagingWithCachedData=3,
  pagingWithRemoteData=4,
}



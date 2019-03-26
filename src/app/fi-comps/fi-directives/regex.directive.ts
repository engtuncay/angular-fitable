



import {Directive, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Directive({
  selector: '[myNumberOnly2]'
})
export class NumberOnlyDirective2 implements OnInit,OnDestroy {

  private keyPressed = new Subject();
  private subscription: Subscription;
  private pattern: RegExp;
  private regexMap = { // add your own
    999: /^([0-9]){0,3}$/g,
    9999: /^([0-9]){0,4}$/g,
    sayi: /^-?[0-9]+(\.[0-9]*){0,1}$/g,
  };

  private specialKeys: string[] = ['Backspace', 'Tab', 'End', 'Home'];
  private validationFormat= 999;

  constructor(private el: ElementRef) {
  }

  public ngOnInit() {
    this.subscription = this.keyPressed.pipe(debounceTime(300)).subscribe(
      (event) => this.checkRegExpression(event)
    );
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('keypress', ['$event'])
  public nInput(event: KeyboardEvent) {
    console.log('keypress',event);

    event.preventDefault();
    event.stopPropagation();
    this.keyPressed.next(event);

  }

  private checkRegExpression(event) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    this.pattern = /^([0-9]){0,3}/g;   // this.regexMap[this.validationFormat];
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.pattern)) {
      event.preventDefault();
    }
  }


}

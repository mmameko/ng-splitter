import {Directive, ElementRef, HostBinding, Input, OnInit, Sanitizer} from '@angular/core';

@Directive({
  selector: '[splitter]'
})
export class SplitterDirective implements OnInit {
  @Input() dir;
  @Input() size = 11;

  @HostBinding('class') private wrapperCls = 'splitter-wrapper';
  @HostBinding('style.width') get setWidth() {
    return this.dir === 'horizontal' ? `${this.size}px` : ``;
  }
  @HostBinding('style.height') get setHeight() {
    return this.dir === 'horizontal' ? `` : `${this.size}px`;
  }

  constructor(public elementRef: ElementRef) {}

  ngOnInit() {}
}

import {Directive, ElementRef, HostBinding, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[split-area]'
})
export class SplitAreaDirective {
  @Input() set order(v) {
    this._renderer.setStyle(this.elementRef.nativeElement, 'order', v);
  }
  @Input() set basis(v) {
    this._renderer.setStyle(this.elementRef.nativeElement, 'flexBasis', v);
  }
  @Input() set minWidth(v) {
    this._renderer.setStyle(this.elementRef.nativeElement, 'minWidth', `${v}px`);
  }

  @HostBinding('style.overflow') private overflow = 'auto';
  @HostBinding('class') private wrapperCls = 'split-area';

  constructor(public elementRef: ElementRef,
              private _renderer: Renderer2) {}
}

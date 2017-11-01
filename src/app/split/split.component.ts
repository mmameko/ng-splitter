import {
  Component, Input, ContentChildren, ChangeDetectionStrategy,
  AfterContentInit, ViewEncapsulation, ViewChildren, AfterViewInit, ViewContainerRef, ViewChild, Renderer2
} from '@angular/core';

import {SplitAreaDirective} from './split-area.directive';
import {SplitterDirective} from './splitter.directive';

type Direction = 'horizontal' | 'vertical';

@Component({
  selector: 'split',
  styleUrls: ['./split.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #container class="splitter" [ngClass]="direction">
    <ng-content></ng-content>
    <ng-template ngFor let-area [ngForOf]="areas" let-last="last" let-i="index">
      <div splitter
           draggable="false"
           [dir]="direction"
           [size]="splitSize"
           [style.order]="i*2+1"
           (mousedown)="dragStart(i*2+1)"
           *ngIf="!last"></div>
    </ng-template>
  </div>`
})
export class SplitComponent implements AfterViewInit, AfterContentInit {
  @Input() direction: Direction = 'horizontal';
  @Input() splitSize = 11;
  @Input() minSize = 100;

  @ViewChild('container') container;
  @ContentChildren(SplitAreaDirective) areas;
  @ViewChildren(SplitterDirective) splitters;

  private _moveLn;
  private _downLn;
  private _inMove;

  constructor(private _vcRef: ViewContainerRef,
              private _renderer: Renderer2) {}

  ngAfterViewInit() {}

  ngAfterContentInit() {
    const aCount = this.areas.length;

    this.areas.forEach((area, id) => {
      area.minWidth = this.minSize;
      area.order = id * 2;
      area.basis = `calc((100% - ${this.splitSize * (aCount  - 1)}px) / ${aCount})`;
    });
  }

  dragStart($event) {
    this._inMove = ($event - 1) / 2;
    this._moveLn = this._renderer.listen('document', 'mousemove', this.move.bind(this));
    this._downLn = this._renderer.listen('document', 'mouseup', this.dragEnd.bind(this));
  }

  move(e) {
    let {x, y} = e;
    const areas = this.areas.toArray();
    const areaA = areas[this._inMove];
    const areaB = areas[this._inMove + 1];
    const splitEl = this.splitters.toArray()[this._inMove];
    const {left, top, width, height} = this.container.nativeElement.getBoundingClientRect();

    x -= left;
    y -= top;

    x = x < 0 ? 0 : x;
    x = x > width ? width : x;

    y = y < 0 ? 0 : y;
    y = y > height ? height : y;

    if (this.direction === 'horizontal') {
      const leftEdge = areaA.elementRef.nativeElement.getBoundingClientRect().right;
      const delta = leftEdge - x;
      const leftWidth = areaA.elementRef.nativeElement.getBoundingClientRect().width - delta;
      const rightWidth = areaB.elementRef.nativeElement.getBoundingClientRect().width + delta;

      if (leftWidth < this.minSize || rightWidth < this.minSize) {
        this._renderer.addClass(splitEl.elementRef.nativeElement, 'error');
        return;
      } else {
        this._renderer.removeClass(splitEl.elementRef.nativeElement, 'error');
      }

      this.setStyles(areaA.elementRef.nativeElement, {
        flexBasis: `${leftWidth}px`,
        width: `${leftWidth}px`
      });
      this.setStyles(areaB.elementRef.nativeElement, {
        flexBasis: `${rightWidth}px`,
        width: `${rightWidth}px`
      });
    } else {
      const bottomEdge = areaA.elementRef.nativeElement.getBoundingClientRect().bottom;
      const delta = bottomEdge - y;
      const leftBottom = areaA.elementRef.nativeElement.getBoundingClientRect().height - delta;
      const rightBottom = areaB.elementRef.nativeElement.getBoundingClientRect().height + delta;

      if (leftBottom < this.minSize || rightBottom < this.minSize) {
        this._renderer.addClass(splitEl.elementRef.nativeElement, 'error');
        return;
      } else {
        this._renderer.removeClass(splitEl.elementRef.nativeElement, 'error');
      }

      this.setStyles(areaA.elementRef.nativeElement, {
        flexBasis: `${leftBottom}px`,
        height: `${rightBottom}px`
      });
      this.setStyles(areaB.elementRef.nativeElement, {
        flexBasis: `${rightBottom}px`,
        height: `${rightBottom}px`
      });
    }
  }

  dragEnd() {
    this._moveLn();
    this._downLn();
  }

  private setStyles(el, styles: Object) {
    for (const style in styles) {
      this._renderer.setStyle(el, style, styles[style]);
    }
  }
}

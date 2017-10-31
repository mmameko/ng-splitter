import {
  Component, Input, ContentChildren,
  AfterContentInit, ViewEncapsulation, ViewChildren, AfterViewInit, ViewContainerRef, ViewChild, Renderer2
} from '@angular/core';

import {SplitAreaDirective} from './split-area.directive';
import {SplitterDirective} from './splitter.directive';

type Direction = 'horizontal' | 'vertical';

@Component({
  selector: 'split',
  styleUrls: ['./split.component.css'],
  encapsulation: ViewEncapsulation.None,
  template: `<div #container class="splitter" [ngClass]="direction">
    <ng-content></ng-content>
    <ng-template ngFor let-area [ngForOf]="areas" let-last="last" let-i="index">
      <div splitter
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
      area.order = id * 2;
      area.basis = `calc((100% - ${this.splitSize * (aCount  - 1)}px) / ${aCount})`;
    });
  }

  dragStart($event) {
    this._moveLn = this._renderer.listen('document', 'mousemove', this.move.bind(this));
    this._downLn = this._renderer.listen('document', 'mouseup', this.dragEnd.bind(this));
    this._inMove = ($event - 1) / 2;
  }

  move(e) {
    let {x, y} = e;
    const areas = this.areas.toArray();
    const leftAreaEl = areas[this._inMove];
    const rightAreaEl = areas[this._inMove + 1];
    const {left, top, width, height} = this.container.nativeElement.getBoundingClientRect();

    x -= left;
    y -= top;

    x = x < 0 ? 0 : x;
    x = x > width ? width : x;

    y = y < 0 ? 0 : y;
    y = y > height ? height : y;

    if (this.direction === 'horizontal') {
      const leftEdge = leftAreaEl.elementRef.nativeElement.getBoundingClientRect().right;
      const delta = leftEdge - x;
      const leftWidth = leftAreaEl.elementRef.nativeElement.getBoundingClientRect().width - delta;
      const rightWidth = rightAreaEl.elementRef.nativeElement.getBoundingClientRect().width + delta;

      this._renderer.setStyle(leftAreaEl.elementRef.nativeElement, 'flexBasis', `${leftWidth}px`);
      this._renderer.setStyle(rightAreaEl.elementRef.nativeElement, 'flexBasis', `${rightWidth}px`);
    } else {
      console.log(y);
    }
  }

  dragEnd() {
    this._moveLn();
    this._downLn();
  }
}

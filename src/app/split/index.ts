import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SplitComponent} from './split.component';
import {SplitAreaDirective} from './split-area.directive';
import {SplitterDirective} from './splitter.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [SplitComponent, SplitAreaDirective, SplitterDirective],
  exports: [SplitComponent, SplitAreaDirective]
})
export class SplitModule {}

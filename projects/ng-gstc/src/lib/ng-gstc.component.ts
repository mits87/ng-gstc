import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Config } from 'gantt-schedule-timeline-calendar';
import GSTC from 'gantt-schedule-timeline-calendar/dist/index.esm';

@Component({
  selector: 'ng-gstc',
  template: `<div class="gstc" #gstc></div>`,
  styleUrls: ['../../../../node_modules/gantt-schedule-timeline-calendar/dist/style.css'],
  encapsulation: ViewEncapsulation.None
})
export class NgGstcComponent implements AfterViewInit, OnDestroy {
  @Input() config: Config;
  @ViewChild('gstc') calendarEl: ElementRef;

  private gstc: any;
  private state: any;

  constructor() { }

  ngAfterViewInit() {
    const element = this.calendarEl.nativeElement;
    this.state = GSTC.api.stateFromConfig(this.config);
    // this.onState.emit(this.state);
    this.gstc = GSTC({
      element,
      state: this.state
    });
  }

  ngOnDestroy() {
    this.state.destroy();
    this.gstc.app.destroy();
  }
}

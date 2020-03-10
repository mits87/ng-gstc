import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  Actions,
  Chart,
  ClassNames,
  Components,
  Config,
  List,
  Locale,
  Plugin,
  Scroll,
  Slots,
  Wrappers
} from 'gantt-schedule-timeline-calendar';
import GSTC from 'gantt-schedule-timeline-calendar/dist/index.esm';

@Component({
  selector: 'ng-gstc',
  template: `<div class="gstc" #gstc></div>`,
  styleUrls: ['../../../../node_modules/gantt-schedule-timeline-calendar/dist/style.css'],
  encapsulation: ViewEncapsulation.None
})
export class NgGstcComponent implements OnChanges, OnDestroy {
  @Input() plugins: Plugin[];
  @Input() plugin: unknown;
  @Input() height: number;
  @Input() headerHeight: number;
  @Input() components: Components;
  @Input() wrappers: Wrappers;
  @Input() slots: Slots;
  @Input() list: List;
  @Input() scroll: Scroll;
  @Input() chart: Chart;
  @Input() classNames: ClassNames;
  @Input() actions: Actions;
  @Input() locale: Locale;
  @Input() utcMode: boolean;
  @Input() usageStatistics: boolean;

  @ViewChild('gstc', { static: true }) calendarEl: ElementRef;

  private gstc: any;
  private state: any;

  constructor() { }

  ngOnDestroy() {
    this.state.destroy();
    this.gstc.app.destroy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.init();
  }

  private init() {
    const config: Config = {};

    if (this.plugins) {
      config.plugins = this.plugins;
    }

    if (this.plugin) {
      config.plugin = this.plugin;
    }

    if (this.height) {
      config.height = this.height;
    }

    if (this.headerHeight) {
      config.headerHeight = this.headerHeight;
    }

    if (this.components) {
      config.components = this.components;
    }

    if (this.wrappers) {
      config.wrappers = this.wrappers;
    }

    if (this.slots) {
      config.slots = this.slots;
    }

    if (this.list) {
      config.list = this.list;
    }

    if (this.scroll) {
      config.scroll = this.scroll;
    }

    if (this.chart) {
      config.chart = this.chart;
    }

    if (this.classNames) {
      config.classNames = this.classNames;
    }

    if (this.actions) {
      config.actions = this.actions;
    }

    if (this.locale) {
      config.locale = this.locale;
    }

    if (this.utcMode !== undefined) {
      config.utcMode = this.utcMode;
    }

    if (this.usageStatistics !== undefined) {
      config.usageStatistics = this.usageStatistics;
    }

    const element = this.calendarEl.nativeElement;
    this.state = GSTC.api.stateFromConfig(config);
    // this.onState.emit(this.state);
    this.gstc = GSTC({
      element,
      state: this.state
    });
  }
}

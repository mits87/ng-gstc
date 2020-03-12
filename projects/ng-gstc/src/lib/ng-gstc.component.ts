import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnChanges,
  OnDestroy, Output,
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

interface Handler {
  event: string;
  handler: (...args) => any;
}

@Component({
  selector: 'ng-gstc',
  template: `<div class="gstc" #gstc></div>`,
  styleUrls: ['../../../../node_modules/gantt-schedule-timeline-calendar/dist/style.css'],
  encapsulation: ViewEncapsulation.None
})
export class NgGstcComponent implements AfterViewInit, OnChanges, OnDestroy {
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

  @Input() customEventHandlers: Handler[];

  @Output() heightChange: EventEmitter<any> = new EventEmitter();
  @Output() headerHeightChange: EventEmitter<any> = new EventEmitter();
  @Output() componentsChange: EventEmitter<any> = new EventEmitter();
  @Output() wrappersChange: EventEmitter<any> = new EventEmitter();
  @Output() listChange: EventEmitter<any> = new EventEmitter();
  @Output() scrollChange: EventEmitter<any> = new EventEmitter();
  @Output() chartChange: EventEmitter<any> = new EventEmitter();
  @Output() classNamesChange: EventEmitter<any> = new EventEmitter();
  @Output() actionsChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('gstc', { static: true }) calendarEl: ElementRef;

  private gstc: any;
  private state: any;

  private props = [
    { key: 'plugins' },
    { key: 'plugin' },
    { key: 'height' },
    { key: 'headerHeight' },
    { key: 'components' },
    { key: 'wrappers' },
    { key: 'slots' },
    { key: 'list' },
    { key: 'scroll' },
    { key: 'chart' },
    { key: 'classNames' },
    { key: 'actions' },
    { key: 'locale' },
    { key: 'utcMode' },
    { key: 'usageStatistics' },
  ];

  constructor() { }

  ngAfterViewInit(): void {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.state) {
      const keys = Object.keys(changes);

      keys.forEach(key => {
        this.state.update(
          `config.${key}`,
          entry => Object.assign(entry, changes[key].currentValue)
        );
      });
    }
  }

  ngOnDestroy() {
    this.state.destroy();
    this.gstc.app.destroy();
  }

  private getConfig(): Config {
    return this.props
      .reduce(
        (config, { key }) => {
          if (this[key] !== undefined) {
            config[key] = this[key];
          }

          return config;
        },
      {});
  }

  private initEventListeners() {
    this.props.forEach(({ key }) => {
      const action = `${key}Change`;
      if (this[action] && this[action] instanceof EventEmitter) {
        this.state.subscribe(`config.${key}`, entry => this[action].emit(entry));
      }
    });

    if (this.customEventHandlers) {
      this.customEventHandlers.forEach(({ event, handler }) => {
        this.state.subscribe(event, handler);
      });
    }
  }

  private init() {
    const config: Config = this.getConfig();

    const element = this.calendarEl.nativeElement;
    this.state = GSTC.api.stateFromConfig(config);
    // this.onState.emit(this.state);
    this.gstc = GSTC({
      element,
      state: this.state
    });

    this.initEventListeners();
  }
}

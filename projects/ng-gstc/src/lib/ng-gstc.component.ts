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
import ItemMovement from 'gantt-schedule-timeline-calendar/dist/ItemMovement.plugin.js'
import GSTC from 'gantt-schedule-timeline-calendar/dist/index.esm';
import { Handler } from './ng-gstc';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

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
  @Input() actions: Actions = {} as Actions;
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

  @Output() itemMoved: Observable<any>;

  @Output() itemClick: EventEmitter<any> = new EventEmitter();

  @ViewChild('gstc', { static: true }) calendarEl: ElementRef;

  private itemMoved$: Subject<any> = new Subject<any>();

  private gstc: any;
  private state: any;

  private props = [
    'plugins',
    'plugin',
    'height',
    'headerHeight',
    'components',
    'wrappers',
    'slots',
    'list',
    'scroll',
    'chart',
    'classNames',
    'actions',
    'locale',
    'utcMode',
    'usageStatistics',
  ];

  constructor() {
    this.itemMoved = this.itemMoved$
      .pipe(distinctUntilChanged((old, current) => {
        return old.rowId === current.rowId &&
          old.time.start === current.time.start &&
          old.time.end === current.time.end;
      }));
  }

  ngAfterViewInit(): void {
    if (!this.plugins) {
      this.plugins = [];
    }

    this.plugins.push(ItemMovement({
      moveable: true,
      resizable: true,
      // resizerContent: '<div class="resizer">-></div>',
      ghostNode: false,
      // snap item start time to start of the day
      snapStart: (time, diff, item) => {
        return GSTC.api
          .date(time)
          .add(diff, 'milliseconds')
          .startOf('day')
          .valueOf();
      },
      // snap item end time to end of the day
      snapEnd: (time, diff, item) => {
        this.itemMoved$.next({ ...item, time: { ...item.time } });

        return GSTC.api
          .date(time)
          .add(diff, 'milliseconds')
          .endOf('day')
          .valueOf();
      }
    }));

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

  addAction(source: string, event: string, handler: (event: any, data: any) => any) {
    function action(element, data) {
      const listener = (e) => handler(e, data);

      element.addEventListener(event, listener);

      return {
        update(el: HTMLElement, newData) {
          data = newData; // data from parent scope updated
        },
        destroy(el: HTMLElement) {
          el.removeEventListener(event, listener);
        }
      };
    }

    if (!this.actions) {
      this.actions = {} as Actions;
    }

    if (this.actions[source]) {
      return this.actions[source].push(action);
    }

    this.actions[source] = [ action ];
  }

  private getConfig(): Config {
    return this.props
      .reduce(
        (config, key) => {
          if (this[key] !== undefined) {
            config[key] = this[key];
          }

          return config;
        },
      {});
  }

  private initEventListeners() {
    this.props.forEach((key) => {
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
    this.addAction('chart-timeline-items-row-item', 'click', (event, data) => this.itemClick.emit({ event, data }));
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

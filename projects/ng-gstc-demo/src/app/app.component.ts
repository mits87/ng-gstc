import { Component, OnInit } from '@angular/core';
import { Handler } from 'ng-gstc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-gstc-demo';

  config: any;
  gstcState: any;

  events: Handler[] = [
    {
      event: 'config.list.rows',
      handler: this.onRowChange
    }
  ];

  ngOnInit() {
    const iterations = 20;

    // GENERATE SOME ROWS

    const rows = {};
    for (let i = 0; i < iterations; i++) {
      const withParent = i > 0 && i % 2 === 0;
      const id = i.toString();
      rows[id] = {
        id,
        label: 'Room ' + i,
        parentId: withParent ? (i - 1).toString() : undefined,
        expanded: false
      };
    }

    const dayLen = 24 * 60 * 60 * 1000;

    // GENERATE SOME ROW -> ITEMS

    const items = {};
    for (let i = 0; i < iterations; i++) {
      const id = i.toString();
      const start = new Date().getTime();
      items[id] = {
        id,
        label: 'User id ' + i,
        time: {
          start: start + i * dayLen,
          end: start + (i + 2) * dayLen
        },
        rowId: id
      };
    }

    // LEFT SIDE LIST COLUMNS

    const columns = {
      percent: 100,
      resizer: {
        inRealTime: true
      },
      data: {
        label: {
          id: 'label',
          data: 'label',
          expander: true,
          isHtml: true,
          width: 230,
          minWidth: 100,
          header: {
            content: 'Room'
          }
        }
      }
    };

    this.config = {
      height: 800,
      list: {
        rows,
        columns
      },
      chart: {
        items
      }
    };


    setTimeout(() => {
      this.config.list.rows[1].label = 'ROOOOW CHANGED';
      this.config.list = { ...this.config.list };
    }, 4000);
  }

  // GET THE GANTT INTERNAL STATE

  onState(state) {
    this.gstcState = state;

    // YOU CAN SUBSCRIBE TO CHANGES

    this.gstcState.subscribe('config.list.rows', rows => {
      console.log('rows changed', rows);
    });

    this.gstcState.subscribe(
      'config.chart.items.:id',
      (bulk, eventInfo) => {
        if (eventInfo.type === 'update' && eventInfo.params.id) {
          const itemId = eventInfo.params.id;
          console.log(
            `item ${itemId} changed`,
            this.gstcState.get('config.chart.items.' + itemId)
          );
        }
      },
      { bulk: true }
    );
  }

  addItem() {
    const id = Math.floor(Math.random() * 10000000).toString();
    const dayLen = 24 * 60 * 60 * 1000;
    const start = new Date().getTime();
    this.config.chart = {
      ...this.config.chart,
      items: {
        ...this.config.chart.items,
        [id]: {
          id,
          label: 'User id ' + id,
          time: {
            start: start + 3 * dayLen,
            end: start + 5 * dayLen
          },
          rowId: Math.floor(Math.random() * 20).toString()
        }
      }
    };
  }

  listChange($event: any) {
    console.log('listChange', $event);
  }

  onRowChange(arg) {
    console.log(arg);
  }

  itemClick($event: any) {
    console.log('itemClick', $event);
  }
}

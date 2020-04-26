import { Component, OnInit } from '@angular/core';
import { Handler } from 'ng-gstc';
declare const dayjs;
// const dayjs = require('dayjs');


const MOCKED_DATA = [
  {
    id: 1,
    name: 'Double Room',
    meta: [
      [1, 2, 3, null, 4, 5, 10, null],
      [null, '-', null],
    ],
    units: [
      {
        id: 1,
        name: 'Unit 1',
      },
      {
        id: 2,
        name: 'Unit 2',
        bookings: [
          {
            id: 1,
            name: 'Tam Marston / 280,00 EUR',
            from: dayjs().startOf('month').add(1, 'day').add(12, 'hour').valueOf(),
            to: dayjs().startOf('month').add(10, 'day').add(12, 'hour').valueOf(),
            color: '#84E3DC',
          },
          {
            id: 2,
            name: 'John Doe / 300,00 EUR',
            from: dayjs().startOf('month').add(12, 'day').add(12, 'hour').valueOf(),
            to: dayjs().startOf('month').add(18, 'day').add(12, 'hour').valueOf(),
            color: '#A0F0CC',
          },
        ]
      },
      {
        id: 3,
        name: 'Unit 3',
      },
    ],
  },
  {
    id: 2,
    name: 'One Bedroom',
    meta: [],
    units: [
      {
        id: 4,
        name: 'Unit 4',
      },
      {
        id: 5,
        name: 'Unit 5',
      },
      {
        id: 6,
        name: 'Unit 6',
      },
    ],
  },
  {
    id: 3,
    name: 'Two Bedroom',
    meta: [],
    units: [
      {
        id: 7,
        name: 'Unit 7',
        bookings: [
          {
            id: 123,
            name: 'Tam Marston / 280,00 EUR',
            from: dayjs().startOf('month').add(1, 'day').add(12, 'hour').valueOf(),
            to: dayjs().startOf('month').add(4, 'day').add(12, 'hour').valueOf(),
          }
        ]
      },
      {
        id: 8,
        name: 'Unit 8',
      },
      {
        id: 9,
        name: 'Unit 9',
      },
    ],
  },
];

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

    const { rows, items } = this.prepareData();

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

  prepareData() {
    const results = [];
    const items = {};
    MOCKED_DATA.forEach((property) => {
      const id = `p${property.id}`;
      const meta = ['Price per night', 'Minimum stay'];
      results.push({
        id,
        label: property.name,
        resizeable: false,
        // moveable: false,
        expanded: true,
      });
      meta.forEach((el, index) => {
        results.push({
          id: `${id}_m${index + 1}`,
          label: el,
          isMeta: true,
          resizeable: false,
          // moveable: false,
          parentId: id,
          style: {
            current: `background: #fefefe;`,
          },
        });
      });
      property.units.forEach(unit => {
        results.push({
          id: `${id}_u${unit.id}`,
          label: unit.name,
          parentId: id,
        });
        if (unit.hasOwnProperty('bookings')) {
          unit.bookings.forEach(booking => {
            items[booking.id] = {
              id: booking.id,
              label: booking.name,
              rowId: `${id}_u${unit.id}`,
              moveable: true,
              style: {
                current: booking.color ? `background: ${booking.color};` : '',
              },
              time: {
                start: booking.from,
                end: booking.to,
              }
            };
          });
        }
      });
    });

    const rows = results.reduce((obj, item) => {
      obj[item.id] = item;
      return obj;
    }, {});
    return { rows, items };
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

  itemMoved(item: any) {
    console.log('item MOVED', item);
  }
}

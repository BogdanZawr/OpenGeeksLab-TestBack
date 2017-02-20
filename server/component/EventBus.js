import * as _ from 'lodash';
import util  from 'util';
import EventEmitter  from 'events';

class EventBusObj {
  constructor () {
    EventEmitter.call(this);
    this.queue = [];
    this.useQueue = [];
    this.current = this.nest = null;
  }

  emit (eventName) {
    let self = this
      , args = arguments;

    console.log('Emitting ' + eventName + '...');
    if (~eventName.indexOf('::')) {
        let nest = function(eventName, level) {
          let tmpEvent = eventName.split('::', level).join('::');
          EventEmitter.prototype.emit.apply(self, [tmpEvent].concat([].slice.call(args, 1)).concat([function(err) {
            if (err) {
              return console.log(err);
            }

            tmpEvent != eventName && nest(eventName, ++level);
          }]));
        };

        nest(eventName, 1);
    } else {
      return EventEmitter.prototype.emit.apply(this, arguments);
    }
  }

  use (eventName, listener) {
    this.useQueue.push(eventName);
    this.onSeries(eventName, listener);
  }

  onSeries (eventName, listener) {
    let self = this;

    EventEmitter.prototype.on.call(this, eventName, function(data) {
      if (listener.length !== 2) {
        return listener.apply(this, arguments);
      }

      self.queue.push({
        data: data,
        listener: listener,
        eventName: eventName,
        arguments: arguments
      });

      next.call(self);
    });
  }
}

util.inherits(EventBusObj, EventEmitter);

function next() {
  let self = this
    , item = this.queue[0];

  if (!item){
    self.nest && typeof self.nest == 'function' && self.nest();
    return this.emit("bus:queue-empty", {});
  }

  if (item !== this.current) {
    this.current = item;
    item.listener.call(this, item.data, function(err, result) {
      if (err) { throw err; }

      !_.isEmpty(result) && _.extend(self.queue[0].data, result);
      self.queue.shift();
      self.current = self.nest = null;
      if (~self.useQueue.indexOf(item.eventName)) {
        self.useQueue.shift();
      }

      if (!self.queue.length && !~self.useQueue.indexOf(item.eventName)) {
        let argsArr = [].slice.call(item.arguments);
        self.nest = argsArr[argsArr.length - 1];
      }
      next.call(self);
    });
  }
}



export let EventBus = new EventBusObj();

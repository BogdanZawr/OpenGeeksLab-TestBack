import * as _ from 'lodash';
import util  from 'util';
import CoEvent  from 'eventemitter-co';


let Generator = (function*(){yield undefined;}).constructor;

class EventBusObj extends CoEvent {

  emit (eventName) {
    let self = this;

    console.log('Emitting ' + eventName + '...');
    return CoEvent.prototype.emit.apply(self, arguments);
  }

  on (eventName, listener) {
    let self = this;

    if (listener instanceof Generator) {
      return CoEvent.prototype.on.call(this, eventName, function * (data) {
        console.log('Executing ' + eventName + '...');
        yield listener (data);
      });
    }
    else if (listener && typeof listener === 'function' ) {
      return CoEvent.prototype.on.call(this, eventName, function * (data) {
        console.log('Executing ' + eventName + '...');
        listener (data);
      });
    }

  }
}

export let eventBus = new EventBusObj();

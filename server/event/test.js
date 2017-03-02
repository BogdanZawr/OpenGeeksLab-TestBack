import {eventBus}  from '../component/eventBus';
import {test}  from "../action/test";

eventBus.on('eventTestGen', test.testEventGen);
eventBus.on('eventTestFun', test.testEventFun);
eventBus.on('eventTestAsync', test.testEventAsync);

import {EventBus}  from '../component/EventBus';
import {Test}  from "../action/test";
let test = new Test();

EventBus.on('eventTestGen', test.testEventGen);
EventBus.on('eventTestFun', test.testEventFun);
EventBus.on('eventTestAsync', test.testEventAsync);

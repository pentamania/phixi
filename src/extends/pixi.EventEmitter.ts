import { utils } from 'pixi.js';
import { addMethod } from './utils';

declare module 'pixi.js' {
  namespace utils {
    export interface EventEmitter {
      /**
       * Calls each of the listeners registered for a given event.
       * Alias method for `emit`
       * @alias emit
       */
      flare(event: string | symbol, ...args: any[]): boolean;
    }
  }
}

/**
 * PIXI.utils.EventEmitter.flare
 */
addMethod(
  utils.EventEmitter.prototype,
  'flare',
  function (event: string | symbol, ...args) {
    return this.emit.call(this, event, ...args);
  }
);

// PIXI.utils.EventEmitter.prototype.has = function(eventName) {
//   return this.eventNames().includes(eventName);
// }

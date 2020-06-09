/// <reference path='./pixi.js.extend.d.ts'/>
import * as PIXI from "pixi.js"
import { addMethod } from "./utils"

/**
 * PIXI.utils.EventEmitter.flare
 */
addMethod(PIXI.utils.EventEmitter.prototype, "flare", function (event: string | symbol, ...args) {
  return this.emit.call(this, event, ...args);
})

// PIXI.utils.EventEmitter.prototype.has = function(eventName) {
//   return this.eventNames().includes(eventName);
// }

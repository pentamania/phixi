/// <reference path='./pixi.js.extend.d.ts'/>
import * as PIXI from "pixi.js"
import { addMethod } from "./utils"

/**
 * PIXI.utils.EventEmitter.flare
 */
addMethod(PIXI.utils.EventEmitter.prototype, "flare", function (...args) {
  return this.emit.call(this, ...args);
})

// PIXI.utils.EventEmitter.prototype.has = function(eventName) {
//   return this.eventNames().includes(eventName);
// }

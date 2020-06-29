import { RendererOptions } from "pixi.js";

export interface AppParam extends RendererOptions {
  fps?: number
}

export enum PhinaEvent {
  Enterframe = "enterframe",
  EnterScene = "enter",
  AccessoryAttached = "attached",
  AccessoryDetached = "detached",
  Removed = "removed",
  // ACCESSORY_ATTACHED = "attached",
  // ACCESSORY_DETACHED = "detached",
}

export interface PhinaKeyBoardEvent {
  keyCode: KeyboardEvent["keyCode"]
}

export enum TweenerUpdateType {
  Normal = "normal",
  Delta = "delta",
  FPS = "fps",
}

export enum AssetType {
  Pixi = "pixi",
  // Image = "image",
  // Sound = "sound",
}
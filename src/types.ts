export interface AppParam extends PIXI.RendererOptions {
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
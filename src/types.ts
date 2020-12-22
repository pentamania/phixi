// import { RendererOptions } from "pixi.js"; 

// 以前はあったはず…？だが、無いので直接コピペ
type RendererOptions = {
  width?: number;
  height?: number;
  view?: HTMLCanvasElement;
  transparent?: boolean;
  autoDensity?: boolean;
  antialias?: boolean;
  resolution?: number;
  clearBeforeRender?: boolean;
  preserveDrawingBuffer?: boolean;
  backgroundColor?: number;
  powerPreference?: string;
  context?: any;
}

export interface AppParam extends RendererOptions {
  fps?: number
}

export enum PhinaEvent {
  // Element events
  Enterframe = "enterframe",
  AccessoryAttached = "attached",
  AccessoryDetached = "detached",
  // ACCESSORY_ATTACHED = "attached",
  // ACCESSORY_DETACHED = "detached",
  Removed = "removed",

  // Scene events
  EnterScene = "enter",
  ExitScene = "exit",
  ScenePaused = "pause",

  // App events
  AppChangeScene = "changescene",
  AppPushScene = "push",
  AppScenePushed = "pushed",
  AppPopScene = "pop",
  AppScenePoped = "poped",
  AppResume = "resume",
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
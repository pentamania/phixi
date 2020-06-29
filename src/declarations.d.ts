// Quick fix for absence of phina.js esm version
declare module "phina.js" {
  export var EventDispatcher: phina.util.EventDispatcherStatic;
  export var Flow: phina.util.FlowStatic;
  export var Ticker: phina.util.TickerStatic;
  export var Random: phina.util.RandomStatic;
  export var Support: phina.util.SupportStatic;
  export var Grid: phina.util.GridStatic;
  export var Tween: phina.util.TweenStatic;
  export var QueryString: phina.util.QueryStringStatic;
  export var Color: phina.util.ColorStatic;
  export var ChangeDispatcher: phina.util.ChangeDispatcherStatic;
  export var Ajax: phina.util.AjaxStatic;

  export var Vector2: phina.geom.Vector2Static;
  export var Rect: phina.geom.RectStatic;
  export var Circle: phina.geom.CircleStatic;
  export var Matrix33: phina.geom.Matrix33Static;
  export var Collision: phina.geom.CollisionStatic;
  export var Vector3: phina.geom.Vector3Static;

  export var Canvas: phina.graphics.CanvasStatic;

  export var Mouse: phina.input.MouseStatic;
  export var Touch: phina.input.TouchStatic;
  export var TouchList: phina.input.TouchListStatic;
  export var Keyboard: phina.input.KeyboardStatic;
  export var GamePad: phina.input.GamepadStatic;
  export var Accelometer: phina.input.AccelerometerStatic;

  export var Updater: phina.app.UpdaterStatic;
  export var Interactive: phina.app.InteractiveStatic;
  export var Element: phina.app.ElementStatic;
  export var Scene: phina.app.SceneStatic;
  export var BaseApp: phina.app.BaseAppStatic;
  export var Object2D: phina.app.Object2DStatic;

  export var DomApp: phina.display.DomAppStatic;
  export var CanvasApp: phina.display.CanvasAppStatic;
  export var CanvasRenderer: phina.display.CanvasRendererStatic;
  export var DisplayScene: phina.display.DisplaySceneStatic;
  export var DisplayElement: phina.display.DisplayElementStatic;
  export var Sprite: phina.display.SpriteStatic;
  export var PlainElement: phina.display.PlainElementStatic;
  export var CanvasLayer: phina.display.CanvasLayerStatic;
  export var Shape: phina.display.ShapeStatic;
  export var Label: phina.display.LabelStatic;

  export var Tweener: phina.accessory.TweenerStatic;
  export var Accessory: phina.accessory.AccessoryStatic;
  export var FrameAnimation: phina.accessory.FrameAnimationStatic;
  export var Draggable: phina.accessory.DraggableStatic;
  export var Flickable: phina.accessory.FlickableStatic;
  export var Physical: phina.accessory.PhysicalStatic;

  export var AssetLoader: phina.asset.AssetLoaderStatic;
  export var AssetManager: phina.asset.AssetManagerStatic;
  export var Asset: phina.asset.AssetStatic;
  export var File: phina.asset.FileStatic;
  export var Texture: phina.asset.TextureStatic;
  export var SpriteSheet: phina.asset.SpriteSheetStatic;
  export var Font: phina.asset.FontStatic;
  export var Script: phina.asset.ScriptStatic;
  export var SoundManager: phina.asset.SoundManagerStatic;

  export var Button: phina.ui.ButtonStatic;
  export var Gauge: phina.ui.GaugeStatic;
  export var LabelArea: phina.ui.LabelAreaStatic;

  export var Wave: phina.display.WaveStatic;

  export var Twitter: phina.social.TwitterStatic;
}

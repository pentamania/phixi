import { AssetLoader, Flow } from "phina.js"
import { AssetType } from "../types";
import { loadPixiAsset } from "../helpers";

/**
 * AssetLoader extend: pixi
 */
AssetLoader.register(AssetType.Pixi, (key, path) => {
  return new Flow(async (resolve) => {
    const arg = await loadPixiAsset(key, path);
    return resolve(arg);
  });
});
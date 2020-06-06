import * as PIXI from "pixi.js"

/**
 * pixi.js関係のアセットをロード
 * pixiのloaderは並列ロードができないため、アセットごとにloaderを生成する
 * TODO: エラーハンドリング
 * 
 * @param key 
 * @param path 
 */
export function loadPixiAsset(
  key: string, 
  path: string
): Promise<PIXI.loaders.Resource> {
  return new Promise((resolve)=> {
    const pixiLoader = new PIXI.loaders.Loader();
    pixiLoader.add(key, path).load((_loader, resources) => {
      resolve(resources[key]);
    });
  })
}
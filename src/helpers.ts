import { Loader } from 'pixi.js';

/**
 * pixi.js loader wrapper function
 *
 * [EN]
 * Generally used to load assets used in pixi.
 *
 * [JP]
 * pixi.js関係のアセットをロードする際に使用
 *
 * @example
 * (async ()=> {
 *   const bunnyResrc = await loadPixiAsset('bunny', 'data/bunny.png')
 *   new PIXI.TilingSprite(bunnyResrc.texture)
 * })();
 *
 * Pixi Loader reference:
 * https://pixijs.download/dev/docs/PIXI.Loader.html
 *
 * @param key
 * @param path
 */
export function loadPixiAsset(
  key: string,
  path: string
): Promise<PIXI.LoaderResource> {
  return new Promise((resolve, reject) => {
    // Since PIXI.Loader can't load while it is busy loading other asset,
    // we have to create loader for each asset...
    // TODO: Cache loader to reuse?
    const pixiLoader = new Loader();

    pixiLoader.add(key, path).load((_loader, resources) => {
      const resrc = resources[key];
      if (!resrc) {
        reject(`Loader error: Cannot find key:"${key}" in resources`);
      } else {
        resolve(resrc);
      }
    });

    pixiLoader.onError.add(reason => {
      reject(reason);
    });
  });
}

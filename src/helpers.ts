import { Loader } from 'pixi.js';

/**
 * pixi.js関係のアセットをロード
 * pixiのloaderは並列ロードができないため、アセットごとにloaderを生成する
 * TODO: エラーハンドリング
 * TODO: ローダーはキャッシュする？
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

import phina from 'phina.js';
import { Gauge } from '../ui/Gauge';
import { Scene } from '../app/Scene';
import { PhinaAssetLoaderLoadParam, PhinaEvent } from '../core/types';

interface LoadingSceneInterface {
  load: (assets: PhinaAssetLoaderLoadParam) => any;
}

/**
 * Built-in LoadingSceen
 * WIP
 */
export class LoadingScene extends Scene implements LoadingSceneInterface {
  gauge: Gauge;

  constructor() {
    super();
    this.gauge = new Gauge({
      height: 12,
    });
    this.once(PhinaEvent.EnterScene, () => {
      // 幅修正
      this.gauge.width = this.screenWidth;
    });
  }

  /**
   * ロード後は
   * @param assets
   */
  load(assets: PhinaAssetLoaderLoadParam) {
    var loader = phina.asset.AssetLoader();
    loader.on('progress', (e: any) => {
      this.gauge.value = e.progress * 100;
    });
    loader.on('load', () => {
      this.flare(PhinaEvent.LoadingSceneLoaded);
    });
    loader.load(assets);
  }
}

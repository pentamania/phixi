import phina from 'phina.js';
import { AssetType } from '../core/types';
import { loadPixiAsset } from './loader';

/**
 * AssetLoader extend: pixi
 */
phina.asset.AssetLoader.register(AssetType.Pixi, (key, path) => {
  return phina.util.Flow(async resolve => {
    const arg = await loadPixiAsset(key, path);
    return resolve(arg);
  });
});

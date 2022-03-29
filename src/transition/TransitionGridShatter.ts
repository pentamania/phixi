import { DEG_TO_RAD, Rectangle, Sprite } from 'pixi.js';
import { Sprite as PhixiSprite } from '../Sprite';
import { Scene } from '../';
import { TransitionScene, TransitionSceneOptions } from './TransitionScene';

class GridRect extends Rectangle {
  col: number = 0;
  row: number = 0;
}

/**
 * @param width
 * @param height
 * @param col
 * @param row
 * @returns
 */
function gridSlice(
  width: number,
  height: number,
  col: number,
  row: number
): GridRect[] {
  const gridWidth = width / col;
  const gridHeight = height / row;
  const slices = [];
  for (let ri = 0; ri < row; ri++) {
    const y = gridHeight * ri;
    for (let ci = 0; ci < col; ci++) {
      const rect = new GridRect(gridWidth * ci, y, gridWidth, gridHeight);
      rect.col = ci;
      rect.row = ri;
      slices.push(rect);
    }
  }
  return slices;
}

export interface TransitionGridShatterOptions extends TransitionSceneOptions {
  fadeInterval: number;
  sliceNum: number;
}

/**
 * Cross-fade scene with shattering effect
 */
export class TransitionGridShatter extends TransitionScene {
  fadeInterval: number;
  sliceNum: number;

  constructor(nextScene: Scene, options: TransitionGridShatterOptions) {
    options = {
      ...{
        fadeInterval: 50,
        sliceNum: 8,
      },
      ...options,
    };
    super(nextScene, options);
    this.fadeInterval = options.fadeInterval;
    this.sliceNum = options.sliceNum;
  }

  /**
   * @override
   */
  async transit(prevScene: Scene, nextScene: Scene) {
    // Add nextScene Sprite on background
    new Sprite(nextScene.getRenderTexture()).setOrigin(0, 0).addChildTo(this);

    // Setup prevScene sliced sprites
    const psrt = prevScene.getRenderTexture();
    const animWaitProp = Symbol('animWaitProp');
    const prevSceneSlicedSprites = gridSlice(
      psrt.width,
      psrt.height,
      this.sliceNum,
      this.sliceNum
    ).map(gr => {
      const prevScenePieceSprite = new PhixiSprite(prevScene.getRenderTexture())
        .setPosition(gr.width / 2 + gr.x, gr.height / 2 + gr.y)
        .addChildTo(this);
      prevScenePieceSprite.srcRect.copyFrom(gr);
      prevScenePieceSprite.texture.updateUvs();
      prevScenePieceSprite.setOrigin(0.5, 0.5);
      // @ts-ignore
      prevScenePieceSprite[animWaitProp] = gr.col + gr.row;
      return prevScenePieceSprite;
    });

    // Animation with tweener
    return Promise.all(
      prevSceneSlicedSprites.map((sp, _i) => {
        return new Promise<void>(resolve => {
          sp.tweener
            .clear()
            // @ts-ignore
            .wait(sp[animWaitProp] * this.fadeInterval)
            .to(
              {
                scaleX: 0,
                scaleY: 0,
                rotation: 720 * DEG_TO_RAD,
              },
              400,
              'easeOutExpo'
            )
            .call(() => {
              sp.remove();
              resolve();
            });
        });
      })
    );
  }
}

export interface StyleOption {
  /**
   * Overrides DisplayObject.rotation setter
   * and setRotation to recognize passed value as degree unit
   */
  rotationAsDegree: boolean;

  /**
   * Enables Updater to execute "update" method for active elements,
   * and refuges original pixi objects "update" methods
   */
  enableUpdateMethod: boolean;
}

export const defaultOption: StyleOption = Object.freeze({
  rotationAsDegree: true,
  enableUpdateMethod: true,
});

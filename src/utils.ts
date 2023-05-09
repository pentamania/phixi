/**
 * Event stop helper
 * @param e
 */
export const stopEvent = function (e: Event) {
  e.preventDefault();
  e.stopPropagation();
};

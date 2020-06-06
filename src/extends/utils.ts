/**
 * 任意のオブジェクトにgetterを追加する
 */
export function addGetter<T>(
  obj: T, 
  prop: string, 
  getter: (this: T) => any
) {
  Object.defineProperty(obj, prop, {
    get: getter,
    enumerable: false,
    configurable: true,
  })
}

/**
 * 任意のオブジェクトにgetter及びsetterを追加する
 */
export function addAccessor<T>(
  obj: T,
  prop: string, 
  accessor: {
    get: (this: T) => any,
    set: (this: T, v:any) => any,
  }
) {
  Object.defineProperty(obj, prop, {
    get: accessor.get,
    set: accessor.set,
    enumerable: false,
    configurable: true,
  })
}

/**
 * 任意のオブジェクトにメソッドを追加する
 * REVIEW: メソッドを遠回しに生やすため、obj.prototype.fooのように
 * 
 * @param obj target object
 * @param prop property name
 * @param methodFunc
 */
export function addMethod<T>(
  obj: T, 
  prop: string, 
  methodFunc: (this: T, ...args: any) => any
) {
  Object.defineProperty(obj, prop, {
    value: methodFunc,
    enumerable: false,
    writable: true
  })
}
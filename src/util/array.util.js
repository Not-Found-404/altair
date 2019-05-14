export class ArrayUtil {
  static remove(array, index) {
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  }

  static notEmpty(array) {
    return !this.isEmpty(array);
  }

  static isEmpty(array) {
    return array === null || !(array) ? true :
      array.length === null ? true :
        array.length <= 0;
  }
}

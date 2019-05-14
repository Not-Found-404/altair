export class StringUtil {
  static isEmpty = (str) => {
    return !(str)|| str === null || str === "";
  };

  static notEmpty = (str) => {
    return !this.isEmpty(str);
  };
}

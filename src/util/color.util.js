import React from "react";

export class ColorUtil {
  static ACTIVE = "#28CC3B";

  static IN_ACTIVE = "#E5242E";

  static INIT = "#839B9E";

  static getSpan = (status, activeText, inActiveText, initText) => {
    if (status === 1) {
      return (<span style={{"color": ColorUtil.ACTIVE}}>{activeText}</span>)
    } else if (status === -1) {
      return (<span style={{"color": ColorUtil.IN_ACTIVE}}>{inActiveText}</span>)
    } else if (status === 0) {
      return (<span style={{"color": ColorUtil.INIT}}>{initText}</span>)
    }
  }
}

const utils = {
  trim: (str: string, length: number) => {
    let val = "";
    if (str.length > length) {
      val = str.substring(0, length);
      val += "...";
      return val;
    }

    return str;
  },
};

export default utils;

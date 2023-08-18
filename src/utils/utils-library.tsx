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
  sleep: async (ms: number) => {
    return new Promise((res, rej) => {
      setTimeout(res, ms);
    });
  },
};

export default utils;

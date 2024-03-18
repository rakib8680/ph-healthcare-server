



// ki korsi nijeo bujte parsi na
// if it works then it's fine xD 
const pick = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Partial<T> => {
    const newObj: Partial<T> = {};
    for (const key of keys) {
      if (obj && Object.hasOwnProperty.call(obj, key)) {
        newObj[key] = obj[key];
      }
    }
  
    return newObj;
  };


  export default pick;
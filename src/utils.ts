const OPERATORS = ['$and', '$or'];
import { ObjectId } from 'mongodb';

export const isObject = (item: any) =>
  item && typeof item === 'object' && !Array.isArray(item) && !(item instanceof Date) && !(item instanceof RegExp);

export const mergeDeep = (target: object, ...sources: object[]) => {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
};

export const cleanQuery = (doc: object) => {
  for (const key in doc) {
    if (doc.hasOwnProperty(key)) {
      const value = doc[key];
      if ('$and' === key) {
        for (const subdoc of value) {
          doc = mergeDeep(doc, cleanQuery(subdoc));
        }
        delete doc[key];
      } else if ('$or' === key) {
        doc[key] = value.map(v => cleanQuery(v));
      }
    }
  }
  return doc;
};

export const objectToDotNotation = (obj: object, current: string, res = {}) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = current ? current + '.' + key : key;
      if (value && typeof value === 'object') {
        objectToDotNotation(value, newKey, res);
      } else {
        res[newKey] = value;
      }
    }
  }
  return res;
};

export const parseObjectIds = (input: any) => {
  if (typeof input === 'string' && ObjectId.isValid(input)) {
    return new ObjectId(input);
  }
  if (typeof input !== 'object' && !Array.isArray(input)) {
    return input;
  }
  for (const key in input) {
    if (input.hasOwnProperty(key)) {
      const value = input[key];
      if (typeof value === 'string' && ObjectId.isValid(value)) {
        input[key] = new ObjectId(value);
      } else if (Array.isArray(value)) {
        input[key] = value.map(v => parseObjectIds(v));
      } else if (typeof value === 'object' && !(value instanceof RegExp)) {
        input[key] = parseObjectIds(value);
      }
    }
  }
  return input;
};

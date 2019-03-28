import * as assert from 'assert';
import * as mongodb from 'mongodb';
import InvalidQueryParamException from './exceptions/InvalidQueryParamException';
import * as parsers from './parsers';

export interface ISelect {
  [key: string]: 0 | 1;
}

export interface ISort {
  [key: string]: -1 | 1;
}

export interface IFilter {
  [key: string]: any;
}

export interface IRawQuery {
  limit?: string | number;
  skip?: string | number;
  filter?: string;
  select?: string;
  sort?: string;
}

export interface IQueryParams {
  limit: number;
  skip: number;
  filter: IFilter;
  select: ISelect;
  sort: ISort;
}

export class MongoDbQueryParams {
  static get defaultLimit() {
    return 99999;
  }

  public static parseSkip(rawSkip: string | number): number {
    try {
      return typeof rawSkip === 'number' ? rawSkip : parseInt(rawSkip, 10);
    } catch (error) {
      throw new InvalidQueryParamException('skip', rawSkip);
    }
  }

  public static parseLimit(rawLimit: string | number): number {
    try {
      return typeof rawLimit === 'number' ? rawLimit : parseInt(rawLimit, 10);
    } catch (error) {
      throw new InvalidQueryParamException('limit', rawLimit);
    }
  }

  public static parseSelect(rawSelect): ISelect {
    try {
      rawSelect = rawSelect.trim();
      const parser = parsers.getSelectGrammar();
      const [select] = parser.feed(rawSelect).results;
      return select;
    } catch (error) {
      throw new InvalidQueryParamException('fields', rawSelect);
    }
  }

  public static parseSort(rawSort): ISort {
    try {
      assert(typeof rawSort === 'string' || rawSort instanceof String);
      rawSort = rawSort.trim();
      const parser = parsers.getSortGrammar();
      const [sort] = parser.feed(rawSort).results;
      return sort;
    } catch (error) {
      throw new InvalidQueryParamException('sort', rawSort);
    }
  }

  public static parseFilter(rawFilter: string): IFilter {
    try {
      rawFilter = rawFilter.trim();
      if (!rawFilter) {
        return {};
      }
      const parser = parsers.getFilterGrammar();
      const [filter] = parser.feed(rawFilter).results;
      for (const key in filter) {
        if (filter.hasOwnProperty(key)) {
          const operation = filter[key];
          for (const operator in operation) {
            if (operation.hasOwnProperty(operator)) {
              const value = operation[operator];
              if (typeof value === 'string' && mongodb.ObjectId.isValid(value)) {
                operation[operator] = new mongodb.ObjectId(value);
              }
            }
          }
        }
      }
      return filter;
    } catch (error) {
      throw new InvalidQueryParamException('filter', rawFilter);
    }
  }

  public static parseQueryParams(raw: IRawQuery): IQueryParams {
    return {
      skip: raw.skip ? this.parseSkip(raw.skip) : 0,
      limit: raw.limit ? this.parseLimit(raw.limit) : this.defaultLimit,
      sort: raw.sort ? this.parseSort(raw.sort) : {},
      select: raw.select ? this.parseSelect(raw.select) : {},
      filter: raw.filter ? this.parseFilter(raw.filter) : {},
    };
  }
  constructor() {
    throw new Error('This class is not meant to be initialized, is static');
  }
}

export default MongoDbQueryParams;

import * as assert from 'assert';
import InvalidQueryParamException from './exceptions/InvalidQueryParamException';
import * as parsers from './parsers';

interface ISelect {
  [key: string]: -1 | 1;
}

interface ISort {
  [key: string]: -1 | 1;
}

interface IFilter {
  [key: string]: any;
}

interface IRawQuery {
  limit?: string | number;
  skip?: string | number;
  filter?: string;
  select?: string;
  sort?: string;
}

interface IQueryParams {
  limit: number;
  skip: number;
  filter: IFilter;
  select: ISelect;
  sort: ISort;
}

export default class MongoDbQueryParams {
  public static parseSkip(rawSkip: string | number): number {
    try {
      return typeof rawSkip === 'number' ? rawSkip : parseInt(rawSkip);
    } catch (error) {
      throw new InvalidQueryParamException('skip', rawSkip);
    }
  }

  public static parseLimit(rawLimit: string | number): number {
    try {
      return typeof rawLimit === 'number' ? rawLimit : parseInt(rawLimit);
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
      return filter;
    } catch (error) {
      throw new InvalidQueryParamException('filter', rawFilter);
    }
  }

  public static getQueryParams(raw: IRawQuery): IQueryParams {
    return {
      skip: raw.skip ? this.parseSkip(raw.skip) : 0,
      limit: raw.limit ? this.parseLimit(raw.limit) : 999999,
      sort: raw.sort ? this.parseSort(raw.sort) : {},
      select: raw.select ? this.parseSelect(raw.select) : {},
      filter: raw.filter ? this.parseFilter(raw.filter) : {},
    };
  }
  constructor() {
    throw new Error('This class is not meant to be initialized, is static');
  }
}

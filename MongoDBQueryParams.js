const assert = require('assert'),
  parsers = require('./parsers'),
  InvalidQueryParamException = require('./exceptions/InvalidQueryParamException');

class QueryParams {
  constructor() {
    throw new Error('This class is not meant to be initialized, is static');
  }

  static parseSkip(rawSkip) {
    try {
      assert(!isNaN(rawSkip));
      return parseInt(rawSkip);
    } catch (error) {
      throw new InvalidQueryParamException('skip', rawSkip);
    }
  }

  static parseLimit(rawLimit) {
    try {
      assert(!isNaN(rawLimit));
      return parseInt(rawLimit);
    } catch (error) {
      throw new InvalidQueryParamException('limit', rawLimit);
    }
  }

  static parseSelect(rawSelect) {
    try {
      rawSelect = rawSelect.trim();
      const parser = parsers.getSelectGrammar();
      const [select] = parser.feed(rawSelect).results;
      return select;
    } catch (error) {
      throw new InvalidQueryParamException('fields', rawSelect);
    }
  }

  static getSort(rawSort) {
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

  static getFilter() {
    try {
      var rawFilter = this.rawData.filter || '';
      assert(typeof rawFilter === 'string' || rawFilter instanceof String);
      rawFilter = rawFilter.trim();
      if (!rawFilter) return {};
      const parser = parsers.getFilterGrammar();
      const [filter] = parser.feed(rawFilter).results;
      return filter;
    } catch (error) {
      throw new InvalidQueryParamException('filter', rawFilter);
    }
  }

  static getQueryOptions() {
    return {
      skip: this.getSkip(),
      limit: this.getLimit(),
      sort: this.getSort(),
      projection: this.getProjection()
    };
  }
}

module.exports = QueryParams;

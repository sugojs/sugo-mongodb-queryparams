import * as chai from 'chai';
import InvalidQueryParamException from '../exceptions/InvalidQueryParamException';
import MongoDbQueryParams from '../MongoDBQueryParams';
chai.should();

// Our parent block
describe('MongoDBQueryParams', () => {
  describe(`limit`, () => {
    it('It should parse correcly strings', async () => {
      const { limit } = MongoDbQueryParams.parseQueryParams({
        limit: '321',
      });
      limit.should.be.eql(321);
    });

    it('It should accept numbers', async () => {
      const { limit } = MongoDbQueryParams.parseQueryParams({
        limit: 321,
      });
      limit.should.be.eql(321);
    });

    it('If no limit is passed, the default should be returned', async () => {
      const { limit } = MongoDbQueryParams.parseQueryParams({});
      limit.should.be.eql(MongoDbQueryParams.defaultLimit);
    });
  });

  describe(`skip`, () => {
    it('It should parse correcly strings', async () => {
      const { skip } = MongoDbQueryParams.parseQueryParams({
        skip: '321',
      });
      skip.should.be.eql(321);
    });

    it('It should accept numbers', async () => {
      const { skip } = MongoDbQueryParams.parseQueryParams({
        skip: 321,
      });
      skip.should.be.eql(321);
    });

    it('If no skip is passed, the default should be returned', async () => {
      const { skip } = MongoDbQueryParams.parseQueryParams({});
      skip.should.be.eql(0);
    });
  });

  describe(`select`, () => {
    it('It should return an empty object if no string is passed', async () => {
      const { select } = MongoDbQueryParams.parseQueryParams({});
      Object.keys(select).length.should.be.eql(0);
    });

    it('It should accept multiple words', async () => {
      const { select } = MongoDbQueryParams.parseQueryParams({
        select: 'foo fighters is an awesome band',
      });
      select.foo.should.be.eql(1);
      select.fighters.should.be.eql(1);
      select.is.should.be.eql(1);
      select.an.should.be.eql(1);
      select.awesome.should.be.eql(1);
      select.band.should.be.eql(1);
    });

    it('It should accept multiple words with excludes', async () => {
      const { select } = MongoDbQueryParams.parseQueryParams({
        select: '-foo fighters -is an -awesome band',
      });
      select.foo.should.be.eql(-1);
      select.fighters.should.be.eql(1);
      select.is.should.be.eql(-1);
      select.an.should.be.eql(1);
      select.awesome.should.be.eql(-1);
      select.band.should.be.eql(1);
    });
  });

  describe(`sort`, () => {
    it('should return an empty object if no string is passed', async () => {
      const { sort } = MongoDbQueryParams.parseQueryParams({});
      Object.keys(sort).length.should.be.eql(0);
    });

    it('should return the sort object with 1 for asc and -1 for desc (case insensitive)', async () => {
      const { sort } = MongoDbQueryParams.parseQueryParams({ sort: 'foo:asc bar:ASC see:desc test:DESC' });
      sort.foo.should.be.eql(1);
      sort.bar.should.be.eql(1);
      sort.see.should.be.eql(-1);
      sort.test.should.be.eql(-1);
    });
  });

  describe(`filter`, () => {
    it('It should return an empty object if no string is passed', async () => {
      const { filter } = MongoDbQueryParams.parseQueryParams({});
      Object.keys(filter).length.should.be.eql(0);
    });

    it('should create a mongodb query with one parameter', async () => {
      const { filter } = MongoDbQueryParams.parseQueryParams({ filter: 'foo:eq:awesome' });
      filter.foo.should.have.property('$eq');
      filter.foo.$eq.should.be.eql('awesome');
    });

    it('should create a $eq search with the ":eq:" and a value', async function() {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:eq:4',
      });

      filter.should.have.property('number');
      filter.number.should.have.property('$eq');
      filter.number.$eq.should.be.eql(4);
    });

    it('should create a $ne search with the ":neq:" and a value', async function() {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:neq:4',
      });

      filter.should.have.property('number');
      filter.number.should.have.property('$ne');
      filter.number.$ne.should.be.eql(4);
    });

    it('should create a $gt search with the ":gt:" and a value', async function() {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:gt:4',
      });
      filter.should.have.property('number');
      filter.number.should.have.property('$gt');
      filter.number.$gt.should.be.eql(4);
    });

    it('should create a $gte search with the ":gte:" and a value', async function() {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:gte:4',
      });
      filter.should.have.property('number');
      filter.number.should.have.property('$gte');
      filter.number.$gte.should.be.eql(4);
    });

    it('should create a $lt search with the ":lt:" and a value', async function() {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:lt:4',
      });

      filter.should.have.property('number');
      filter.number.should.have.property('$lt');
      filter.number.$lt.should.be.eql(4);
    });

    it('should create a $lte search with the ":lte:" and a value', async function() {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:lte:4',
      });

      filter.should.have.property('number');
      filter.number.should.have.property('$lte');
      filter.number.$lte.should.be.eql(4);
    });

    it('should chain $and and $or tags, parsing parenthesis', async function() {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:lte:4 AND number:gte:1 OR (boolean:eq:false)',
      });
      filter.should.have.property('$or');
      filter.$or.should.be.an('array');
      filter.$or.length.should.be.eql(2);
      console.log(filter);
    });
  });
});

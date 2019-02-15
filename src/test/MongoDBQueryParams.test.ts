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
});

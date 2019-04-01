import * as chai from 'chai';
import * as mongodb from 'mongodb';
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
      select.foo.should.be.eql(0);
      select.fighters.should.be.eql(1);
      select.is.should.be.eql(0);
      select.an.should.be.eql(1);
      select.awesome.should.be.eql(0);
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

    describe('Value parsing', () => {
      it('should parse the value as a integer', async () => {
        const { filter } = MongoDbQueryParams.parseQueryParams({
          filter: 'foo:eq:4',
        });

        filter.should.have.property('foo');
        filter.foo.should.have.property('$eq');
        filter.foo.$eq.should.be.eql(4);
      });

      it('should parse the value as a float (Passing a "." separated decimal) ', async () => {
        const { filter } = MongoDbQueryParams.parseQueryParams({
          filter: 'foo:eq:4.4',
        });

        filter.should.have.property('foo');
        filter.foo.should.have.property('$eq');
        filter.foo.$eq.should.be.eql(4.4);
      });

      it('should parse the value as a date if passed a date', async () => {
        const { filter } = MongoDbQueryParams.parseQueryParams({
          filter: 'foo:eq:2018-10-10',
        });

        filter.should.have.property('foo');
        filter.foo.should.have.property('$eq');
        filter.foo.$eq.should.be.eql(new Date('2018-10-10'));
      });

      it('should parse the value as true', async () => {
        const { filter } = MongoDbQueryParams.parseQueryParams({
          filter: 'foo:eq:true',
        });

        filter.should.have.property('foo');
        filter.foo.should.have.property('$eq');
        filter.foo.$eq.should.be.eql(true);
      });

      it('should parse the value as false', async () => {
        const { filter } = MongoDbQueryParams.parseQueryParams({
          filter: 'foo:eq:false',
        });

        filter.should.have.property('foo');
        filter.foo.should.have.property('$eq');
        filter.foo.$eq.should.be.eql(false);
      });

      it('should parse the value as string (Without quotes)', async () => {
        const { filter } = MongoDbQueryParams.parseQueryParams({
          filter: 'foo:eq:Hello',
        });

        filter.should.have.property('foo');
        filter.foo.should.have.property('$eq');
        filter.foo.$eq.should.be.eql('Hello');
      });

      it('should parse the value as string (With quotes)', async () => {
        const { filter } = MongoDbQueryParams.parseQueryParams({
          filter: 'foo:eq:"Hello world"',
        });

        filter.should.have.property('foo');
        filter.foo.should.have.property('$eq');
        filter.foo.$eq.should.be.eql('Hello world');
      });

      it('should parse the value as string (With a quoted number)', async () => {
        const { filter } = MongoDbQueryParams.parseQueryParams({
          filter: 'foo:eq:"4"',
        });

        filter.should.have.property('foo');
        filter.foo.should.have.property('$eq');
        filter.foo.$eq.should.be.eql('4');
      });

      it('should parse the value as a date if passed a datetime', async () => {
        const { filter } = MongoDbQueryParams.parseQueryParams({
          filter: 'foo:eq:2018-10-10T10:10:10',
        });
        filter.should.have.property('foo');
        filter.foo.should.have.property('$eq');
        filter.foo.$eq.should.be.eql(new Date('2018-10-10T10:10:10'));
      });

      it('should parse a MongoDB ObjectId is given a valid string', async () => {
        const { filter } = MongoDbQueryParams.parseQueryParams({
          filter: 'foo:eq:5c9cac76536b87092f83f52f',
        });
        filter.should.have.property('foo');
        filter.foo.should.have.property('$eq');
        filter.foo.$eq.should.be.instanceof(mongodb.ObjectId);
        filter.foo.$eq.toHexString().should.be.eql('5c9cac76536b87092f83f52f');
      });

      it('should parse an array if given comma separated values within brackets', async () => {
        const { filter } = MongoDbQueryParams.parseQueryParams({
          filter: 'foo:in:[4,5,6,7]',
        });

        filter.should.have.property('foo');
        filter.foo.should.have.property('$in');
        filter.foo.$in.length.should.be.eql(4);
        Array.isArray(filter.foo.$in).should.be.eq(true);
      });
    });
  });

  describe(`Operators`, () => {
    it('should create a simple value query if only given the value', async () => {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:4',
      });

      filter.should.have.property('number');
      filter.number.should.be.eql(4);
    });

    it('should create a $eq search with the ":eq:" and a value', async () => {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:eq:4',
      });

      filter.should.have.property('number');
      filter.number.should.have.property('$eq');
      filter.number.$eq.should.be.eql(4);
    });

    it('should create a $ne search with the ":ne:" and a value', async () => {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:ne:4',
      });

      filter.should.have.property('number');
      filter.number.should.have.property('$ne');
      filter.number.$ne.should.be.eql(4);
    });

    it('should create a $gt search with the ":gt:" and a value', async () => {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:gt:4',
      });
      filter.should.have.property('number');
      filter.number.should.have.property('$gt');
      filter.number.$gt.should.be.eql(4);
    });

    it('should create a $gte search with the ":gte:" and a value', async () => {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:gte:4',
      });
      filter.should.have.property('number');
      filter.number.should.have.property('$gte');
      filter.number.$gte.should.be.eql(4);
    });

    it('should create a $lt search with the ":lt:" and a value', async () => {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:lt:4',
      });

      filter.should.have.property('number');
      filter.number.should.have.property('$lt');
      filter.number.$lt.should.be.eql(4);
    });

    it('should create a $lte search with the ":lte:" and a value', async () => {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:lte:4',
      });

      filter.should.have.property('number');
      filter.number.should.have.property('$lte');
      filter.number.$lte.should.be.eql(4);
    });

    it('should create a $regex search with the ":regex:" and a value', async () => {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:regex:foo',
      });

      filter.should.have.property('number');
      filter.number.should.have.property('$regex');
      filter.number.$regex.should.be.eql(new RegExp('foo'));
    });

    it('should create a case insensitive $regex search with the ":iregex:" and a value', async () => {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:iregex:foo',
      });

      filter.should.have.property('number');
      filter.number.should.have.property('$regex');
      filter.number.$regex.should.be.eql(new RegExp('foo', 'i'));
    });

    it('should create an $exists search with the ":exists:" and a value', async () => {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:exists:true',
      });

      filter.should.have.property('number');
      filter.number.should.have.property('$exists');
      filter.number.$exists.should.be.eql(true);
    });

    it('should create an $in search with the ":in:" and a value', async () => {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:in:[3,4]',
      });

      filter.should.have.property('number');
      filter.number.should.have.property('$in');
      filter.number.$in.should.be.eql([3, 4]);
    });

    it('should create an $nin search with the ":nin:" and a value', async () => {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:nin:[3,4]',
      });

      filter.should.have.property('number');
      filter.number.should.have.property('$nin');
      filter.number.$nin.should.be.eql([3, 4]);
    });
  });

  describe(`Union`, () => {
    it('should chain $and and $or tags, parsing parenthesis', async () => {
      const { filter } = MongoDbQueryParams.parseQueryParams({
        filter: 'number:lte:4 AND number:gte:1 OR (boolean:eq:false)',
      });
      filter.should.have.property('$or');
      filter.$or.should.be.an('array');
      filter.$or.length.should.be.eql(2);
    });
  });

  describe(`integration`, () => {
    it('should create a complex query', async () => {
      const query = MongoDbQueryParams.parseQueryParams({
        filter: 'name AND email:eq:hola AND number:eq:4',
        sort: 'name:asc email:desc',
        limit: 10,
        skip: 50,
        select: 'name -email number',
      });
      query.should.have.property('filter');
      query.should.have.property('sort');
      query.should.have.property('limit');
      query.should.have.property('skip');
      query.should.have.property('select');
    });
  });
});

import * as chai from 'chai';
import { cleanQuery, mergeDeep } from '../utils';
chai.should();

// Our parent block
describe('Clean Query methods', () => {
  describe('mergeDeep', () => {
    it('It should merge objects with 2 levels of recursion filled with primitives', async () => {
      const result = mergeDeep(
        { one: 1, letters: { a: 'A' }, same: true },
        { two: 2, letters: { b: 'B' }, same: false },
      );
      result.should.have.property('one');
      result.should.have.property('two');
      result.should.have.property('letters');
      result.should.have.property('same');
      result.same.should.be.eql(false);
      result.letters.should.have.property('a');
      result.letters.should.have.property('b');
    });

    it('It should merge objects with 2 levels of recursion filled with Dates', async () => {
      const result = mergeDeep(
        { birthdate: new Date('1991-10-28:10:10'), dates: { promotion: new Date('2018-10-10T10:10:10') } },
        {
          birthdate: new Date('1991-10-28:10:10'),
          dates: { wedding: new Date('2017-09-09T10:10:10') },
          deathday: new Date('2100-10-10T10:10:10'),
        },
      );
      result.should.have.property('birthdate');
      result.should.have.property('dates');
      result.should.have.property('deathday');

      result.birthdate.should.be.instanceof(Date);
      result.deathday.should.be.instanceof(Date);
      result.dates.wedding.should.be.instanceof(Date);
      result.dates.promotion.should.be.instanceof(Date);
    });

    it('It should merge objects with 2 levels of recursion filled with RegExp', async () => {
      const result = mergeDeep(
        { birthdate: new RegExp('foo'), dates: { promotion: new RegExp('fighters') } },
        {
          birthdate: new RegExp('all'),
          dates: { wedding: new RegExp('time') },
          deathday: new RegExp('low'),
        },
      );
      result.should.have.property('birthdate');
      result.should.have.property('dates');
      result.should.have.property('deathday');

      result.birthdate.should.be.instanceof(RegExp);
      result.deathday.should.be.instanceof(RegExp);
      result.dates.wedding.should.be.instanceof(RegExp);
      result.dates.promotion.should.be.instanceof(RegExp);
    });
  });

  describe('cleanQuery', () => {
    it('It should remove rendundat $and', async () => {
      const result = cleanQuery({ $and: [{ $and: [{ foo: { $eq: true } }] }], bar: { $eq: false } });
      result.should.have.property('foo');
      result.should.have.property('bar');
    });

    it('It should remove rendundat $and before any $or', async () => {
      const result: any = cleanQuery({
        $and: [
          {
            $and: [
              {
                $or: [
                  {
                    chao: {
                      $gte: true,
                    },
                  },
                  {
                    hello: {
                      $lte: false,
                    },
                  },
                ],
              },
              {
                foo: {
                  $eq: true,
                },
              },
            ],
          },
          {
            bar: {
              $eq: 1,
            },
          },
        ],
      });
      result.should.have.property('$or');
      result.should.have.property('bar');
      result.should.have.property('foo');
      result.$or[0].should.have.property('chao');
      result.$or[1].should.have.property('hello');
    });

    it('It should merge $ands even after an $or', async () => {
      const result: any = cleanQuery({
        $or: [
          {
            $and: [
              {
                $and: [
                  {
                    chao: {
                      $gte: true,
                    },
                  },
                  {
                    hello: {
                      $lte: false,
                    },
                  },
                ],
              },
              {
                foo: {
                  $eq: true,
                },
              },
            ],
          },
          {
            bar: {
              $eq: 1,
            },
          },
        ],
      });
      result.should.have.property('$or');
      result.$or[0].should.have.property('chao');
      result.$or[0].should.have.property('hello');
      result.$or[0].should.have.property('foo');
      result.$or[1].should.have.property('bar');
    });

    it('It should conserve $or', async () => {
      const result: any = cleanQuery({
        $or: [
          {
            $or: [
              {
                $or: [
                  {
                    chao: {
                      $gte: true,
                    },
                  },
                  {
                    hello: {
                      $lte: false,
                    },
                  },
                ],
              },
              {
                foo: {
                  $eq: true,
                },
              },
            ],
          },
          {
            bar: {
              $eq: 1,
            },
          },
        ],
      });
      result.should.have.property('$or');
      result.$or[0].should.have.property('$or');
      result.$or[0].$or[0].should.have.property('$or');
    });
  });
});

# **sugo-mongodb-queryparams**

Querystring parser that follows a simple ruleset to form querystrings and them builds the apropiate queries for mongodb databases.

## **How to install**

```shell
npm install --save @sugo/mongodb-queryparams
```

## **Query parameters**

- **skip:** Number. Used for pagination. Defines how many documents of the result query must be skipped before returing the objects.
- **limit:** Number. Used for pagination. Defines how many documents can fit in the result set.
- **select:** String. Used for projection. Defines which fields of the objects must be returned. Useful for optimizing queries. The "-" symbol is used to exclude a field
- **sort:** String. Used for sorting.
- **filter:** String. Used for filtering the query.

## **select**

`<field> <field> -<field>...`

## **sort syntax**

`<field>:<direction> <field>:<direction> <field>:<direction> ...`

## **filter syntax**

`<field>:<operator><value>`

## **Value parsing**

The Values are parsed to their correspoding types.

- foo:eq:4 -----> { foo: { \$eq: 4 } }
- foo:eq:3.4 -----> { foo: { \$eq: 3.4 } }
- foo:eq:3,4 -----> { foo: { \$eq: 3.4 } }
- foo:eq:2018-10-10T10:10:10 -----> { foo: { \$eq: new Date('2018-10-10T10:10:10') } }
- foo:eq:2018-10-10 -----> { foo: { \$eq: new Date('2018-10-10') } }
- foo:eq:true -----> { foo: { \$eq: true } }
- foo:eq:false -----> { foo: { \$eq: false } }
- foo:eq:"Foo Fighters is an awesome band" -----> { foo: { \$eq: "Foo Fighters is an awesome band" } }

**If the value does fit in any of the previous cases, it is parsed as a string**

- foo:eq:awesome -----> { foo: { \$eq: "awesome" } }

### **Supported Operators**

- gte
- gt
- lte
- lt
- eq
- neq

**Examples:**

- "foo:eq:fighter"
- "foo:gte:fighter"

## **Example**

```typescript
import MongoDbQueryParams from 'mongodb-queryparams';
const { filter, sort, limit, select, skip } = MongoDbQueryParams.parseQueryParams({
  filter: 'email:eq:hola AND number:eq:4',
  sort: 'name:asc email:desc',
  limit: 10,
  skip: 50,
  select: 'name -email number',
});
```

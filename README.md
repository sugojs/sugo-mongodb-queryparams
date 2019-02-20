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

## **sort Sintax**

`<field>:<direction> <field>:<direction> <field>:<direction> ...`

## **filter Sintax**

The sintax is very similar to elastic search. There are 3 types of filters:

- Operator Search: `<field>:<operator><value>`

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
  filter: 'name AND email:eq:hola AND number:eq:4',
  sort: 'name:asc email:desc',
  limit: 10,
  skip: 50,
  select: 'name -email number',
});
```

# **sugo-mongodb-queryparams**

Querystring parser that follows a simple ruleset to form querystrings and them builds the apropiate queries for mongodb databases.

## **How to install**

```shell
npm install --save @sugo/mongodb-queryparams
```

# **QueryParams**

Abstract class meant to be used as a super class for specific queryparam implementations

## **Options**

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

- Text Search: `<field> <field>`
- Equality Search: `<field>:value`
- Operator Search: `<field>:<operator><value>` (SUPPORTED OPERATORS: >, >=, <, <=, ==, !=)

**Examples:**

- "foo fighter bar"
- "foo:fighter"
- "foo:>=fighter"

## **Methods**

- **get filterRegExp():** Obtains the Regular Expression used to parse the filter parameter.

- **get sortRegExp():** Obtains the Regular Expression used to parse the sort parameter.

- **get defaultOperatorRegExp():** Obtains the Regular Expression used to parse the defaultOperator parameter.

- **getSkip():** Obtains and parses the skip parameter into the appropiate query format.

- **getLimit():** Obtains and parses the limit parameter into the appropiate query format.

- **getFields():** Obtains and parses the fields parameter into the appropiate query format.

- **getDefaultOperator():** Obtains and parses the defaultOperator parameter into the appropiate query format.

## **MongoDbQueryParams**

Implementation of the CRAF queryparams processing for the MongoDB driver.

As this class is aimed for the MongoDB driver it is recommended to read the Api's documentation.

http://mongodb.github.io/node-mongodb-native/3.1/api/index.html

## **Methods**

- **mapToMongoOperator():** Returns the corresponding mongodb operator based on the querystring operator

- **mapToMongoSort():** Returns the corresponding mongodb sort direction value based on the querystring.

- **getQuery():** Obtains the filter to be passed to the mongodb query.

- **getProjection():** Alias for getFields().

- **getQueryOptions():** Returns the fully formed query options to be passed to mongoDB

## **Example**

```javascript
const queryParams = new MongoDBQueryParams(req.query),
  query = queryParams.getQuery(),
  queryOptions = queryParams.getQueryOptions(),
  mongodb = new MongoLeroyDriver(servers, database, options),
  objects = await mongodb.find(collectionName, query, queryOptions);
```

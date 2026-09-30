const monk = require('monk');

const dbUrl = process.env.DB_URL;
const useStubDb = process.env.USE_STUB_DB === 'true';

function createInMemoryDb() {
  const collections = new Map([
    ['employees', [
      { _id: '1', name: 'Alice Johnson', job: 'Frontend Developer' },
      { _id: '2', name: 'Brian Smith', job: 'Backend Developer' },
      { _id: '3', name: 'Carla White', job: 'QA Engineer' },
    ]],
    ['user', [
      { _id: '4', name: 'Demo User', role: 'admin' },
    ]],
  ]);
  let idCounter = 5;

  const ensureCollection = (name) => {
    if (!collections.has(name)) {
      collections.set(name, []);
    }
    return collections.get(name);
  };

  const matchQuery = (doc, query = {}) => Object.keys(query)
    .every((key) => doc[key] === query[key]);

  return {
    get(name) {
      const collection = ensureCollection(name);

      return {
        async find(query = {}) {
          return collection.filter((doc) => matchQuery(doc, query));
        },
        async findOne(query = {}) {
          return collection.find((doc) => matchQuery(doc, query)) || null;
        },
        async insert(data) {
          const newDoc = { ...data, _id: String(idCounter) };
          idCounter += 1;
          collection.push(newDoc);
          return newDoc;
        },
        async distinct(field) {
          const values = collection
            .map((doc) => doc[field])
            .filter((value) => value !== undefined);
          return [...new Set(values)];
        },
        async update(query = {}, updateDoc = {}) {
          const index = collection.findIndex((doc) => matchQuery(doc, query));
          if (index === -1) {
            return null;
          }

          const patch = updateDoc.$set || {};
          collection[index] = { ...collection[index], ...patch };
          return collection[index];
        },
        async remove(query = {}) {
          for (let i = collection.length - 1; i >= 0; i -= 1) {
            if (matchQuery(collection[i], query)) {
              collection.splice(i, 1);
            }
          }
        },
      };
    },
  };
}

const stubDb = createInMemoryDb();

if (useStubDb || !dbUrl) {
  console.log('Stub DB enabled');
  module.exports = stubDb;
} else {
  const db = monk(dbUrl);

  db.then(() => {
    console.log('Connected correctly to server');
  }).catch((error) => {
    console.error('Mongo connection failed, switching to stub DB:', error.message);
  });

  db.on('error', (error) => {
    console.error('Mongo runtime error, using stub DB for new requests:', error.message);
  });

  module.exports = new Proxy(db, {
    get(target, prop, receiver) {
      if (prop === 'get') {
        return (...args) => {
          try {
            return target.get(...args);
          } catch (error) {
            console.error('Collection access failed, fallback to stub DB:', error.message);
            return stubDb.get(...args);
          }
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}

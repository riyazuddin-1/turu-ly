import client from "../config/db.js";

class Database {
  constructor(database, collection) {
    this.client = client;
    this.database = database;
    this.collection = this.client.db(database).collection(collection);

    return new Proxy(this, {
      get(target, prop) {
        if (prop in target) {
          return target[prop];
        }

        let value = target.collection[prop];

        if (typeof value === 'function') {
          return value.bind(target.collection);
        }

        return value;
      }
    })
  }

  async insertOne(payload, options = {}) {
    const now = new Date();
    const document = {
      ...payload,
      createdAt: now,
      updatedAt: now,
    };

    return this.collection.insertOne(document, options);
  }

  async updateOne(filter, updates, options = {}) {
    const now = new Date();
    updates.$set = {
      ...updates.$set,
      updatedAt: now,
    };

    return this.collection.updateOne(filter, updates, options);
  }
}

export default Database;

import client from "../config/db.js";

class Database {
  constructor(database, collection) {
    this.client = client;
    this.database = database;
    this.collection = this.clientclient.db(database).collection(collection);
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

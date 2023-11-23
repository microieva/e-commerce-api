import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"

jest.mock('../utils/connectDb', () => {
  return {
    connectDb: jest.fn()
  }
})
async function connect() {
  const mongod = await MongoMemoryServer.create()
  const uri = await mongod.getUri()

  await mongoose.connect(uri)

  return {
    closeDatabase: async () => {
      await mongoose.connection.dropDatabase()
      await mongoose.connection.close()
      await mongod.stop()
      await mongoose.disconnect()
    },
    clearDatabase: async () => {
      const collections = mongoose.connection.collections

      for (const key in collections) {
        const collection = collections[key]
        await collection.deleteMany({}) // Ensure await here
      }
    },
  }
}

export default connect

export type MongoHelper = {
  closeDatabase: () => Promise<void>
  clearDatabase: () => Promise<void>
}

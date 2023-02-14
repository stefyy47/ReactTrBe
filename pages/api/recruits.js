import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(request, response) {
  const { database } = await connectToDatabase();
  const collection = database.collection(process.env.NEXT_ATLAS_RECRUIT_QUEUE_COLLECTION);
  const result = await collection.find(request.query).toArray();
  response.status(200).json(result);
}

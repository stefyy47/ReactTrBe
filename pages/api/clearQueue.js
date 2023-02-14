import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.status(200).send({ message: "Only POST requests allowed" });
    return;
  }
  const { database } = await connectToDatabase();
  const { worldName, playerId, villageId, screen } = request.body;
  if (screen == "building") {
    const collection = database.collection(
      process.env.NEXT_ATLAS_QUEUE_COLLECTION
    );
    await collection.deleteOne({ worldName, playerId, villageId });
  }
  if (screen == "recruit") {
    const collection = database.collection(
      process.env.NEXT_ATLAS_RECRUIT_QUEUE_COLLECTION
    );
    await collection.updateOne(
      { worldName, playerId, villageId },
      { $set: { recruits: {} } }
    );
  }
  response.status(200).json("Done");
}

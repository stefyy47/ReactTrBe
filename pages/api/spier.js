import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.status(200).send({ message: "Only POST requests allowed" });
    return;
  }
  const { database } = await connectToDatabase();
  const { worldName, playerId, villageId, minPop, maxPop, spiesNumber } = request.body;
  const collection = database.collection(
    process.env.NEXT_ATLAS_SPIER_QUEUE_COLLECTION
  );
    await collection.insertOne({
      worldName,
      playerId,
      villageId,
      spiesNumber,
      minPop,
      maxPop
    });
  response.status(200).json({});
}

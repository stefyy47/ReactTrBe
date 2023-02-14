import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.status(200).send({ message: "Only POST requests allowed" });
    return;
  }
  const { database } = await connectToDatabase();
  const { worldName, playerId, villageId, recruits } = request.body;
  const collection = database.collection(
    process.env.NEXT_ATLAS_RECRUIT_QUEUE_COLLECTION
  );
  const result = await collection.findOne({ worldName, playerId, villageId });
  if (!result) {
    await collection.insertOne({
      worldName,
      playerId,
      villageId,
      recruits: recruits,
    });
  } else {
    await collection.updateOne(
      { _id: result._id },
      { $set: { recruits: { ...result?.recruits, ...recruits } } }
    );
  }
  response.status(200).json(result);
}

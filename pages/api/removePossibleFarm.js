import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.status(200).send({ message: "Only POST requests allowed" });
    return;
  }
  const { database } = await connectToDatabase();
  const { worldName, playerId, villageId } = request.body;
  const collection = database.collection(
    process.env.NEXT_ATLAS_POSSIBLE_FARMS_COLLECTION
  );
  const result = await collection.findOne({ worldName, playerId });
  if (result) {
    let newPossibleFarms = { ...result?.villages };
    delete newPossibleFarms[villageId];
    await collection.updateOne(
      { _id: result._id },
      { $set: { villages: newPossibleFarms } }
    );
  }

  response.status(200).json(result);
}

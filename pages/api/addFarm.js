import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.status(200).send({ message: "Only POST requests allowed" });
    return;
  }
  const { database } = await connectToDatabase();
  const { worldName, playerId, villageId, tribe, troops, x_coord, y_coord } =
    request.body;
  const collection = database.collection(
    process.env.NEXT_ATLAS_FARMS_COLLECTION
  );
  const collection2 = database.collection(
    process.env.NEXT_ATLAS_POSSIBLE_FARMS_COLLECTION
  );
  const result = await collection.findOne({ worldName, playerId });
  const result2 = await collection2.findOne({ worldName, playerId });
  if (!result) {
    await collection.insertOne({
      worldName,
      playerId,
      villages: {
        [villageId]: { tribe, troops, coordinates: { x_coord, y_coord } },
      },
    });
  } else {
    await collection.updateOne(
      { _id: result._id },
      {
        $set: {
          villages: {
            ...result?.villages,
            [villageId]: { tribe, troops, coordinates: { x_coord, y_coord } },
          },
        },
      }
    );
  }
  let newPossibleFarms = {...result2?.villages}
  delete newPossibleFarms[villageId]
  await collection2.updateOne({_id: result2._id}, {$set: {villages: newPossibleFarms}})
  response.status(200).json(result);
}

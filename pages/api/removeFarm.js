import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.status(200).send({ message: "Only POST requests allowed" });
    return;
  }
  const { database } = await connectToDatabase();
  const { worldName, playerId, x_coord, y_coord } = request.body;
  const collection = database.collection(
    process.env.NEXT_ATLAS_FARMS_COLLECTION
  );
  const result = await collection.findOne({ worldName, playerId });
  if (result) {
    let newFarms = { ...result?.villages };
    let villageId = "";
    Object.keys(newFarms).forEach((f) => {
      if (
        newFarms[f].coordinates?.x_coord == x_coord &&
        newFarms[f].coordinates?.y_coord == y_coord
      ) {
        villageId = f;
      }
    });
    if (villageId != "") {
      delete newFarms[villageId];
      await collection.updateOne(
        { _id: result._id },
        { $set: { villages: newFarms } }
      );
    }
  }

  response.status(200).json(result);
}

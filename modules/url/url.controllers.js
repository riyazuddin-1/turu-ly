import shortId from "shortid";
import Database from "../../shared/services/db.js";

const db = new Database("vector").collection("short_urls");

export const generateShortId = async (req, res) => {
  const { url } = req.body;
  const short_id = shortId.generate();

  await db.insertOne({
    url,
    short_id,
    clicks: 0,
  });

  return res.status(200).send({
    success: true,
    message: "Created short url successfully",
    data: {
      shortId: short_id,
    },
  });
};

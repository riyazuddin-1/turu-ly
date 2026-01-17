import shortId from "shortid";
import Database from "../../shared/services/db.js";

const db = new Database("vector", "short_urls");

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

export const forwardToUrl = async (req, res) => {
  const { short } = req.params;
  const record = await db.findOne({
    short_id: short
  }, {
    projection: {
      url: 1
    }
  });

  if (!record) {
    res.status(404).send({
      success: false,
      message: "Url not found with given id"
    })
  }

  res.redirect(301, record.url);
};

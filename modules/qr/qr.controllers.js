import qrcode from "qrcode";

export const generateQR = async (req, res) => {
  const { data } = req.body;
  const buffer = await qrcode.toBuffer(data);
  res.type("png");
  res.status(200).send(buffer);
};

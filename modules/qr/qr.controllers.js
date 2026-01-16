import qrcode from "qrcode";

export const getQR = (req, res) => {
  const { data } = req.body;
  const buffer = qrcode.toBuffer(data);
  res.type("png");
  res.status(200).send(buffer);
};

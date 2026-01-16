export const validateData = (req, res, next) => {
  const data = req.body.data;
  if (!data) {
    return res.status(400).send({
      message: "Data for qr cannot be empty",
    });
  }

  next();
};

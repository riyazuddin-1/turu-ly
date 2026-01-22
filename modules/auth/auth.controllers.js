import Database from "../../shared/services/db";
import Hashing from "../../shared/services/hashing";
import JWT from "../../shared/services/jwt";

const Users = await Database("vector", "users");
const hashing = new Hashing();
const jwt = new JWT();

export const loginHandler = async (req, res) => {
  const { username, email, password } = req.body;
  const { app } = req.params;

  const user = await Users.findOne(
    {
      $or: [{ username }, { email }],
      app,
    },
    {
      projection: {
        password: 1,
        name: 1,
        first_name: 1,
        last_name: 1,
      },
    },
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User not found on ${app}`,
    });
  }

  if (!hashing.compare(password, user.password)) {
    return res.status(401).json({
      success: false,
      message: "Password is incorrect",
    });
  }

  const payload = {
    ...(username ? { username } : { email }),
    ...(user.name
      ? { name: user.name }
      : { first_name: user.first_name, last_name: user.last_name }),
    app,
  };

  const token = jwt.create(payload);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    data: payload,
  });
};

export const signupHandler = async (req, res) => {
  const { username, email, password, name, first_name, last_name } = req.body;
  const { app } = req.params;

  const hashed = hashing.create(password);

  const payload = {
    ...(name ? { name } : { first_name, last_name }),
    ...(username && { username }),
    ...(email && { email }),
    password: hashed,
    app,
  };

  const inserted = await Users.insertOne(payload);

  console.log("User doc created:", inserted, payload);

  if (!inserted) {
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }

  delete payload.password;

  const token = jwt.create(payload);

  return res.status(200).json({
    success: true,
    message: `User signed up with ${app} successfully!`,
    token,
    data: payload,
  });
};

export const verifyUsername = (req, res) => {};

export const updateUser = (req, res) => {};

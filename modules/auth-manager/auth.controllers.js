import { ObjectId } from "mongodb";
import Database from "../../shared/services/db.js";
import Hashing from "../../shared/services/hashing.js";
import JWT from "../../shared/services/jwt.js";
import { checkUsername } from "../../helpers/username.js";

const Users = new Database("vector", "users");
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
    userid: user._id,
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
  payload.userid = inserted.insertedId;

  const token = jwt.create(payload);

  return res.status(200).json({
    success: true,
    message: `User signed up with ${app} successfully!`,
    token,
    data: payload,
  });
};

export const verifyUsername = async (req, res) => {
  const { username } = req.body;
  const { app } = req.params;

  const found = await checkUsername(app, username);

  if (found) {
    return res.status(409).json({
      success: false,
      message: "Username already exists",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Username available",
  });
};

export const updateUser = async (req, res) => {
  const payload = req.body;
  const { userid } = req.user;

  /**
   * TODO:
   * Handle email updation, to verify email
   */

  const updated = await Users.updateOne(
    {
      _id: new ObjectId(userid),
    },
    {
      $set: payload,
    },
  );

  if (updated.modifiedCount == 0) {
    return res.status(404).json({
      success: false,
      message: "Could not update user",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User details updated successfully",
  });
};

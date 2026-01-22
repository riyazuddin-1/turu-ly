import bcrypt from "bcryptjs";

class Hashing {
  create(data) {
    if (typeof data !== "string") {
      data = JSON.stringify(data);
    }
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(data, salt);
  }

  async compare(data, hash) {
    return bcrypt.compareSync(data, hash);
  }
}

export default Hashing;

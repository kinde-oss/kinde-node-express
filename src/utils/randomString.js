const crypto = require("crypto");

const randomString = () => crypto.randomBytes(28).toString("hex");

export { randomString };

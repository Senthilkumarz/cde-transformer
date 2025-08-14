const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  bim360Token: process.env.BIM360_TOKEN || "",
  procoreToken: process.env.PROCORE_TOKEN || "",
  rateLimitDelayMs: 50
};

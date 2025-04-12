const express = require("express");
const settings = require("./config/settings");
const app = express();

app.listen(settings.port, () => {
  console.log(`Server is running on port ${settings.port}`);
});

const express = require("express");
const exphbs = require("express-handlebars");
const SettingsBill = require("./Settings-bill");
const moment = require("moment");
moment().format();
const app = express();

const helpers = {
  warning: function() {
    if (settingsbill.whichLevel() === "warning") {
      return true;
    } else {
      return false;
    }
  },

  crtical: function() {
    if (settingsbill.whichLevel() === "danger") {
      return true;
    } else {
      return false;
    }
  }
};

const handlebarSetup = exphbs({
  partialsDir: "./views/partials",
  viewPath: "./views",
  layoutsDir: "./views/layouts",
  helpers
});

app.engine("handlebars", handlebarSetup);
app.set("view engine", "handlebars");

const settingsbill = SettingsBill();

app.use(express.static("public"));
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", function(req, res) {
  res.render("index", {
    settings: settingsbill.displaySettings(),
    totals: settingsbill.totals()
  });
});

//routes
app.post("/settings", function(req, res) {
  settingsbill.updateSettings({
    callCost: req.body.callCost,
    smsCost: req.body.smsCost,
    warningLevel: req.body.warningLevel,
    criticalLevel: req.body.criticalLevel
  });
  console.log(settingsbill.displaySettings());
  res.redirect("/");
});

app.post("/action", function(req, res) {
  if (req.body.actionType) {
    settingsbill.bill(req.body.actionType);
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

app.get("/actions", function(req, res) {
  let time = settingsbill.displayActions();
  for (const iterator of time) {
    iterator.ago = moment(iterator.timestamp).fromNow();
  }
  res.render("actions", {
    actions: time
  });
});

app.get("/actions/:actionType", function(req, res) {
  const actionType = req.params.actionType;
  let time = settingsbill.actionsFor(actionType);
  for (const iterator of time) {
    iterator.ago = moment(iterator.timestamp).fromNow();
  }
  res.render("actions", {
    actions: time
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("App started at port:", PORT);
});

const express = require("express"),
  app = express(),
  port = process.env.PORT || 8080,
  cors = require("cors");

const bodyParser = require("body-parser");
const fs = require("fs").promises;

// This code block returns a message once the application is runninng.
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.listen(port, () => console.log("Backend server live on " + port));

// Code returns this lone once a GET request to the specific route has been made.
app.get("/", (req, res) => {
  res.send({ message: "Connected to Backend server!" });
});

// This code makes a call the addItem function onoce a POST request is made.
app.post("/add/item", addItem);

// Takes in a request from Todo List and converts it into a new json object.
// This json object is then added to our database.
async function addItem(request, response) {
  try {
    // Converting Javascript object (Task Item) to a JSON string
    const id = request.body.jsonObject.id;
    const task = request.body.jsonObject.task;
    const curDate = request.body.jsonObject.currentDate;
    const dueDate = request.body.jsonObject.dueDate;
    const newTask = {
      ID: id,
      Task: task,
      Current_date: curDate,
      Due_date: dueDate,
    };

    const data = await fs.readFile("database.json");
    const json = JSON.parse(data);
    json.push(newTask);
    await fs.writeFile("database.json", JSON.stringify(json));
    console.log("Successfully wrote to file");
    response.sendStatus(200);
  } catch (err) {
    console.log("error: ", err);
    response.sendStatus(500);
  }
}

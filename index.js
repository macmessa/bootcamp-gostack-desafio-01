const express = require("express");
const server = express();
const projects = [];
let requests = 0; // Number of requests

// Set json model to requests and responses
server.use(express.json());

// Log how many requests have been made so far
server.use((req, res, next) => {
  requests++;
  console.log(`Requests: ${requests}`);
  next();
});

// Check if project id exists
function checkProjectExists(req, res, next) {
  // Find the index of the project with required id
  req.index = projects.findIndex(project => project.id === req.params.id);

  if (req.index === -1)
    return res.status(400).json({ error: "Project not found" });

  next();
}

// Create new project in array
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id: id, title: title, tasks: [] });

  return res.send(`Project <strong>${title}</strong> created`);
});

// List all projects and tasks
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// Update existing project title
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { title } = req.body;

  const oldTitle = projects[req.index].title;
  projects[req.index].title = title;

  return res.send(
    `Project's title has been updated from <strong>${oldTitle}</strong> to <strong>${title}</strong>`
  );
});

// Delete a project
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const title = projects[req.index].title;
  projects.splice(req.index, 1);

  return res.send(`Project <strong>${title}</strong> has been deleted`);
});

// Create a task in project's tasks
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { title } = req.body;

  projects[req.index].tasks.push(title);

  return res.json(projects[req.index]);
});

server.listen(3000);

const express = require('express');
const router = express.Router();

// require the Drone model here
const Drone = require("../models/Drone.model");
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lab-express-drones";
const { default: mongoose, Mongoose, mongo } = require('mongoose');

router.get('/drones', (req, res, next) => {
  // Iteration #2: List the drones
  mongoose
    .connect(MONGO_URI)
    .then((x) => {
      console.log(x.connections[0].name);
      return Drone.find()
    })
    .then((droneList) => {
      console.log(droneList);
      return res.render("drones/list", {droneList})
    })
    .then(() => mongoose.connection.close(() => console.log("Mongo Disconnected")))
    .catch(err => console.log("Error connecting to mongo: ", err))
});

router.get('/drones/create', (req, res, next) => {
  // Iteration #3: Add a new drone
  res.render("drones/create-form")
});

router.post('/drones/create', (req, res, next) => {
  // Iteration #3: Add a new drone
  //console.log("req.body", req.body);
  const {name, propellers, maxSpeed} = req.body;
  mongoose
    .connect(MONGO_URI)
    .then(x => {
      console.log(x.connections[0].name);
      return Drone.create({name, propellers, maxSpeed})
    })
    .then(newDrone => {
      console.log(`New Drone created: ${newDrone.name}`)
      return res.redirect("/drones")
  })
    .catch(err => next(err))
});

router.get('/drones/:id/edit', (req, res, next) => {
  // Iteration #4: Update the drone
  const { id } = req.params;
  mongoose
  .connect(MONGO_URI)
  .then(x => {
    console.log(x.connections[0].name);
    return Drone.findById(id)
  })
  .then(foundDrone => {
    console.log(foundDrone);
    return res.render("drones/update-form", foundDrone)
  })
  .then(() => mongoose.connection.close(() => console.log("Mongo Disconnected")))
  .catch(err => next(err));
});

router.post('/drones/:id/edit', (req, res, next) => {
  // Iteration #4: Update the drone
  const { id } = req.params;
  const { name, propellers, maxSpeed } = req.body; 

  mongoose
    .connect(MONGO_URI)
    .then(x => {
      console.log(x.connections[0].name);
      return Drone.findByIdAndUpdate(id, { name, propellers, maxSpeed }, { new: true })
    })
    .then(updatedDrone => res.redirect("/drones"))
    .then(() => mongoose.connection.close(() => console.log("Mongo Disconnected")))
    .catch(err => next(err));
});

router.post('/drones/:id/delete', (req, res, next) => {
  // Iteration #5: Delete the drone
  const { id } = req.params;

  mongoose
    .connect(MONGO_URI)
    .then(x => {
      console.log(x.connections[0].name);
      return Drone.findByIdAndDelete(id)
    })
    .then(() => res.redirect("/drones"))
    .then(() => mongoose.connection.close())
    .catch(err => next(err));
});

module.exports = router;

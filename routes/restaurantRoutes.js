const express = require('express');
const router  = express.Router();
const Restaurant    = require('../models/restaurantModel');
const yelp = require('yelp-fusion');
const apiKey = "p9DUdMWqeE_Kt6rgKTr-937X5EjLB24wNr0FO9QgCd2WwwUVhZcCClTjCjdrg65U2skbdoadwKNZ7xK8zVSmJbSEH6L7XgdDH3HeAE6LVlBvN3Uwhwtg_S7tDVYZXHYx"
const client = yelp.client(apiKey);
 


router.get('/restaurants', (req, res, next) => {

    console.log(req.query)

  Restaurant.find()
      .then((allTheRestaurants) => {

        client.search({
            term:req.query.q, //make these variables 
            location: 'miami fl' //this one too zip code? 
          }).then(response => {

            let obj = {
                allTheRestaurants:allTheRestaurants,
                yelp:response.jsonBody
            }
            console.log(obj)
            //res.json(allTheRestaurants)
            res.json({obj:obj})

          }).catch(e => {
            console.log(e);
          });
          
      })
      .catch((err) => {
          res.json(err);
      })
});



router.get('/restaurants/details/:id', (req, res, next) => {
  Restaurant.findById(req.params.id)
      .then((theRestaurant) => {
          res.json(theRestaurant);
      })
      .catch((err) => {
          res.json(err);
      })
})

router.post('/restaurants/add-new', (req, res, next) => {
  Restaurant.create({
    name: req.body.name,
    description: req.body.description,
    foodType: req.body.foodType,
    location: req.body.location,
    owner: req.user._id
      })
      .then((response) => {
          res.json(response);
      })
      .catch((err) => {
          res.json(err);
      })
})

router.post('/restaurants/edit/:id', (req, res, next) => {
  Restaurant.findByIdAndUpdate(req.params.id, {
          name: req.body.name,
          description: req.body.description,
          foodType: req.body.foodType,
          location: req.dody.location,
      })
      .then((response) => {
          if (response === null) {
              res.json({
                  message: 'sorry we could not find this restaurant'
              })
              return;
          }
          res.json([{
                      message: 'this task has been successfully updated'
                  },
                  response
              ])
      })
      .catch((err) => {
          res.json(err)
      })
})

router.post('/restaurants/delete/:id', (req, res, next) => {
  Restaurant.findByIdAndRemove(req.params.id)
      .then((deletedRestaurant) => {
          if (deletedRestaurant === null) {
              res.json({
                  message: 'sorry we could not find this restaurant'
              })
              return;
          }
          res.json([{
                  message: 'restaurant succesfully deleted'
              },
              deletedRestaurant
          ])
      })
      .catch((err) => {
          res.json(err)
      })
})





module.exports = router;
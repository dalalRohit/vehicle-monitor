var express = require('express');
var router = express.Router();

var VeichleModel = require('../models/veichle');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('admin', {
    title: "Security admin",
    type: 'admin'
  })
});

router.get('/types', (req, res) => {
  var vTypes = ['Car', 'Bike/Scooter', 'Auto', 'Bus', 'Truck', 'Van', 'Other']

  let totalTypes = {};
  vTypes.map((type) => {
    totalTypes[type] = 0
  })

  VeichleModel.getTotalVeichles()
    .then((data) => {
      // res.send(data);
      let x = data;
      x.map((d) => {
        let type = d['type'];

        totalTypes[type] += 1
      })
      var count = Object.keys(totalTypes)
        .map((type) => {
          return totalTypes[type];
        })
      res.send({ x, count });
    })
})

module.exports = router;

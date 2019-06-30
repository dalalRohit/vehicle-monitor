var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var multer = require('multer');


// -------------------------------------------START MULTER CONFIG
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    // https://github.com/expressjs/multer/issues/513
    cb(null, `sample.jpg`)
  }
})
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  }
  else {
    cb(new Error('Only jpeg and png'), false);
  }
}
//Multer upload rules
var upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
});
// --------------------------------------------END MULTER CONFIG

// Veichle model
var VeichleModel = require('./../models/veichle');
var ListModel = require('./../models/list')

router.get('/', function (req, res) {
  res.render('index', { title: "IIT-B ASSGN", type: 'gate' });
})

/* GET home page. */
router.get('/video', function (req, res, next) {
  const vPath = path.join(__dirname, './../public/videos/sample.mp4');
  const stat = fs.statSync(vPath)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1

    const chunksize = (end - start) + 1
    const file = fs.createReadStream(vPath, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(vPath).pipe(res)
  }
});


//GET /veichles
router.get('/veichles', async (req, res) => {
  VeichleModel.getTotalVeichles()
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      throw new Error(err);
    })
})

// GET /veichle
router.get('/veichle', (req, res) => {
  let number = req.query.number;
  // console.log('veichle', number);
  VeichleModel.getVeichleByNumber(number).then((data) => {
    if (data) {
      res.send({ msg: `Vehicle ${data.numberplate} found!`, img: data.image, type: 'success' });
    } else {
      res.send({ msg: `Vehicle ${number} not found!`, type: 'danger' });
    }
    // console.log(data);
  }).catch((err) => {
    console.log(err);
  })
})

router.get('/entered', (req, res) => {
  VeichleModel.getEnteredVeichles().then((data) => {
    res.send(data);
  }).catch((err) => {
    console.log(err);
  })
})

router.post('/exit', (req, res) => {
  let exit = req.body.number;

  VeichleModel.markExit(exit)
    .then((data) => {
      console.log(data);
      if (data.nModified) {
        res.send({ msg: `Veichle ${exit} left!` });
      }
    })
    .catch((err) => {
      console.log(err);
    })
})

//GET /delete
router.get('/delete', async (req, res) => {
  const x = await VeichleModel.remove();

  if (!x) {
    res.send('Nothing to delete');
  }
  return res.send(x);
})


router.post('/validate', upload.single('image'), async (req, res, next) => {
  try {
    var data = req.body.data;

    var img = data.imageUrl;
    var imgData = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = Buffer.from(imgData, 'base64');
    //store image in temp folder
    fs.writeFile(path.join(__dirname, `./../temp/sample.jpg`),
      buf,
      { encoding: 'base64' },
      function (err) {
        //Finished
        if (err) {
          console.log(err);
        }
      });

    var noPlate = `${data.state}-${data.area}-${data.series}-${data.number}`;
    const body = {
      type: data.type,
      state: data.state,
      area: data.area,
      series: data.series.toUpperCase(),
      number: data.number,
      numberplate: noPlate,
      image: buf
    };

    //function to save document to DB
    function saveVeichle(body) {
      var newVeichle = new VeichleModel(body);
      newVeichle.save()
        .then((data) => {
          if (data['permission'] && data['new'] === false) {
            res.json({ msg: `Veichle ${data['numberplate']} is allowed to enter!`, type: 'success' })
          }
          else if (data['new']) {
            res.json({ msg: `Veichle ${data['numberplate']} is allowed to enter!`, type: 'warning' })
          } else {
            res.json({ msg: `Veichle ${data['numberplate']} is not allowed to enter!`, type: 'danger' })
          }
        })
    }

    //get all vehicles from the list
    let all = await ListModel.getAllList();
    //loop through white/black list
    for (var i = 0; i < all.length; i++) {

      //if vehicle found in list
      if (all[i].numberplate === noPlate) {
        //if in white list
        if (all[i].is === 'white') {
          body['permission'] = true;
          body['inside'] = true
          body['entry'] = moment().format('MMMM Do YYYY, h:mm:ss a')
          body['exit'] = moment().add(4, 'hours').format('MMMM Do YYYY, h:mm:ss a')
          body['new'] = false
          return saveVeichle(body);
        }
        else {
          body['permission'] = false;
          return saveVeichle(body);
        }

      }
    }
    //if new vehicle 
    console.log('setting permission for new v')
    body['permission'] = true;
    body['inside'] = true;
    body['entry'] = moment().format('MMMM Do YYYY, h:mm:ss a')
    body['exit'] = moment().add(4, 'hours').format('MMMM Do YYYY, h:mm:ss a')
    body['new'] = true;
    return saveVeichle(body);



  }
  catch (e) {
    if (e) {
      throw new Error(e);
    }
  }
})
module.exports = router;


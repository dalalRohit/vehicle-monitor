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
      res.send(data);
    })
    .catch((err) => {
      throw new Error(err);
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
    // console.log(data);

    //store incoming photo temp
    var img = data.imageUrl;
    var imgData = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = Buffer.from(imgData, 'base64');
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

    let all = await ListModel.getAllList();

    for (var i = 0; i < all.length; i++) {
      if (all[i].numberplate === noPlate) {
        if (all[i].is === 'white') {
          body['permission'] = true;
          body['entry'] = moment().format('MMMM Do YYYY, h:mm:ss a')
          body['exit'] = moment().add(4, 'hours').format('MMMM Do YYYY, h:mm:ss a')
        }
        else if (all[i].is === 'black') {
          body['permission'] = false;
        }
        else {
          body['permission'] = true;
          body['entry'] = moment().format('MMMM Do YYYY, h:mm:ss a')
          body['exit'] = moment().add(4, 'hours').format('MMMM Do YYYY, h:mm:ss a')
        }
      }
    }
    var newVeichle = new VeichleModel(body);
    newVeichle.save()
      .then((data) => {
        if (data['permission']) {
          res.json({ msg: `Veichle ${data['numberplate']} is allowed to enter!`, type: 'success' })
        } else {
          res.json({ msg: `Veichle ${data['numberplate']} is not allowed to enter!`, type: 'danger' })
        }
      })

  }
  catch (e) {
    if (e) {
      throw new Error(e);
    }
  }
})
module.exports = router;


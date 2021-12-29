var express = require('express');
var path = require('path');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp')

const upload = require('../middleware/upload')
const { addItem, getItems, changeItemCount } = require('../database/database')

const { broadcastMessage } = require('../websocket/websocket')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/items/', (req,res) => {
  const items = getItems();
  res.json(items);
})

router.post('/items/:item_id', (req, res) => {
    const id = req.params.item_id;
    const count = parseInt(req.body.count, 10);
    const updatedItem = changeItemCount(id, count);

    broadcastMessage({
      type: "updatedCount",
      payload: updatedItem
    })

    res.status(200).send('OK')
})

router.post('/items/', upload.single('formImage'), async (req, res, next) => {
  try {
    if (req.fileValidationError) {
        return res.send(req.fileValidationError);
    }
    else if (!req.file) {
        return res.send('Please select an image to upload');
    }

    const id = uuidv4();
    const outputThumbFilename = `./public/images/thumbs/${id}.jpg`
    const outputFilename = `./public/images/${id}.jpg`

    await sharp(req.file.path)
      .resize(300)
      .toFile(`./public/images/thumbs/${id}.jpg`);

    await sharp(req.file.path)
      .toFile(`./public/images/${id}.jpg`);

    const newItem = addItem({
      id,
      count: parseInt(req.body.formQuantity, 10),
      name: req.body.formName,
      image: `images/${id}.jpg`,
      thumbnail: `images/thumbs/${id}.jpg`,
      added: req.body.formAdded
    })

    broadcastMessage({
      type: "newItem",
      payload: newItem
    })

    res.status(200).send(`OK`);
  } catch (error) {
    res.status(500).send('Error');
    console.log("Error: ")
    console.log(error)
  }

});


module.exports = router;

var express = require('express');
var path = require('path');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp')
const google = require("googlethis");
const fetch = require('node-fetch');

const {createWriteStream} = require('fs');
const {pipeline} = require('stream');
const {promisify} = require('util');

const upload = require('../middleware/upload')
const { addItem, getItems, changeItemCount, changeItemAdded } = require('../database/database')

const { broadcastMessage } = require('../websocket/websocket')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/images/suggest', async (req, res) => {
    try {
      const search = req.body.search;
      const images = await google.image(search, { safe: false });
      res.status(200).json(images)
    } catch (error) {
      res.status(500).json({status: 'Error'});
      console.log("Error: ")
      console.log(error)
    }
})

router.get('/items/', (req,res) => {
  const items = getItems();
  res.json(items);
})

router.post('/items/:item_id', (req, res) => {
    const id = req.params.item_id;
    const count = parseInt(req.body.count, 10);
    let updatedItem = changeItemCount(id, count);
    broadcastMessage(JSON.stringify({
      type: "updatedCount",
      payload: updatedItem
    }))

    if(req.body.added) {
      updatedItem = changeItemAdded(id, req.body.added);

      broadcastMessage(JSON.stringify({
        type: "updatedAdded",
        payload: updatedItem
      }))
    }
    res.status(200).json({status: 'OK'})
})

router.post('/items/', upload.single('formImage'), async (req, res, next) => {
  try {
    if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
    }
    const id = uuidv4();
    var imageUrl = `images/${id}.jpg`;
    var imageThumbUrl = `images/thumbs/${id}.jpg`
    const outputThumbFilename = `./public/images/thumbs/${id}.jpg`
    const outputFilename = `./public/images/${id}.jpg`

    if (req.file) {
      await sharp(req.file.path)
        .resize(300)
        .toFile(`./public/images/thumbs/${id}.jpg`);

      await sharp(req.file.path)
        .toFile(`./public/images/${id}.jpg`);
    } else if (req.body.formImageFetchUrl) {


      const streamPipeline = promisify(pipeline);

      const response = await fetch(req.body.formImageFetchUrl);
      if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
      const tempFilePath = `./temp-uploads/${id}`
      await streamPipeline(response.body, createWriteStream(tempFilePath));

      await sharp(tempFilePath)
        .resize(300)
        .toFile(`./public/images/thumbs/${id}.jpg`);

      await sharp(tempFilePath)
        .toFile(`./public/images/${id}.jpg`);
    } else {
      imageUrl = `DefaultImageThumb.jpg`;
      imageThumbUrl = `DefaultImageThumb.jpg`
    }

    const newItem = addItem({
      id,
      count: parseInt(req.body.formQuantity, 10),
      name: req.body.formName,
      category: req.body.formCategory,
      image: imageUrl,
      thumbnail: imageThumbUrl,
      added: req.body.formAdded
    })

    broadcastMessage(JSON.stringify({
      type: "newItem",
      payload: newItem
    }))

    res.status(200).json({status: 'OK'})
  } catch (error) {
    res.status(500).json({status: 'Error'});
    console.log("Error: ")
    console.log(error)
  }

});


module.exports = router;

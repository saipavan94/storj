require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');

// setup
const index = require('./routes/index');
const bucketList = require('./routes/bucketList');
const bucketPage = require('./routes/bucketPage');
const upload = require('./routes/upload');
const download = require('./routes/download');
const deleteFile = require('./routes/deleteFile');
const createBucket = require('./routes/createBucket');
const deleteBucket = require('./routes/deleteBucket');
const shareFile = require('./routes/shareFile');
const downloadWithToken = require('./routes/downloadWithToken');

const app = express();

// setup storj environment
const { Environment } = require('storj');
const storj = new Environment({
  bridgeUrl: "https://api.storj.io",
  bridgeUser: "pavansai.n@gmail.com",
  bridgePass: "23437927",
  encryptionKey: "disagree prosper person grow believe check spend soup bottom usual will hen moral over scene warfare knee name judge clock hobby awesome photo cable",
  logLevel: 4
});

mongoose.connect('mongodb://localhost:27017/storj-sender')
  .then(() => console.log('connected to mongoose'))
  .catch((err) => console.error('error connecting to mongo', err));

// view engine setup
app.engine('.hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// passes storj in middleware
app.use((req, res, next) => {
  req.storj = storj;
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);
app.get('/bucketList', bucketList);
app.get('/bucketList/:bucketId', bucketPage);
app.post('/bucketList/:bucketId', upload);
app.post('/bucketList/:bucketId', upload);
app.get('/bucketList/:bucketId/:fileId', download);
app.get('/bucketList/:bucketId/:fileId/deleteFile', deleteFile);
app.get('/bucketList/:bucketId/deleteBucket', deleteBucket);
app.get('/createBucket', createBucket);
app.get('/share/:bucket_id/:file_id', shareFile);
app.get('/download/:token', downloadWithToken);
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;

const http = require('http');
const https = require('https');
const fs = require('fs');
const Koa = require('koa');
const router = require('./router/index');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const app = new Koa();

app
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

http.createServer(app.callback()).listen(3000);
const options = {
  key: fs.readFileSync(__dirname + '/hr.key', 'utf8'),
  cert: fs.readFileSync(__dirname + '/hr.pem', 'utf8')
};
https.createServer(options, app.callback()).listen(3001);

// app.use(async ctx => {
//   // the parsed body will store in ctx.request.body
//   // if nothing was parsed, body will be an empty object {}
//   ctx.body = ctx.request.body;
// });
//
// app.use(async ctx => {
//   ctx.body = 'initiated';
// });

// app.listen(3000);
console.log('server running on port 3000/3001 ......')









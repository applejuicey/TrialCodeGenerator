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


// app.use(async ctx => {
//   // the parsed body will store in ctx.request.body
//   // if nothing was parsed, body will be an empty object {}
//   ctx.body = ctx.request.body;
// });
//
// app.use(async ctx => {
//   ctx.body = 'initiated';
// });

app.listen(3000);
console.log('server running on port 3000 ......')









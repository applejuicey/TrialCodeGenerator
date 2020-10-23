const Router = require('@koa/router');
const router = new Router();
const { createOneTrial } = require('../controllers/TrialController');

router.post('/api/generate', async (ctx, next) => {
  let result;
  try {
    console.log('aaasdd',ctx.request.url)
    const createdTrial = await createOneTrial(ctx.req.body.newTrial);
    result = {
      statusCode: "1",
      createdTrial: createdTrial,
    };
  } catch (error) {
    console.error(error);
    result = {
      statusCode: "0",
      error: {
        message: `unknown error when create one trial: ${error}`,
        errorCode: '0_CREATE_TRIAL',
      },
    };
  } finally {
    ctx.res.json(result);
  }
});

router.get('/', (ctx, next) => {
  // ctx.router available
  ctx.body = 'path /';
});

router.get('/list', (ctx, next) => {
  // ctx.router available
  ctx.body = 'path /list';

});

module.exports = router;
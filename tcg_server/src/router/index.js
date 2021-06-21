const Router = require('@koa/router');
const router = new Router();

const { trialGenerateController, trialQueryController, trialUpdateController, trialDeleteController, trialSummariseController } = require('../controllers/trial');
router.post('/api/trial/generate', trialGenerateController);
router.post('/api/trial/query', trialQueryController);
router.patch('/api/trial/update', trialUpdateController);
router.post('/api/trial/delete', trialDeleteController);
router.post('/api/trial/summarise', trialSummariseController);

const { authLoginController, authVerifyController } = require('../controllers/auth');
router.post('/api/auth/login', authLoginController);
router.post('/api/auth/verify', authVerifyController);

const { compoundQueryController } = require('../controllers/compound');
router.post('/api/compound/query', compoundQueryController);

const { userUpdateController } = require('../controllers/user.js');
router.patch('/api/user/update', userUpdateController);

module.exports = router;
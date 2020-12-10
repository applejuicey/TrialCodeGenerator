const Router = require('@koa/router');
const router = new Router();

const { trialGenerateController, trialBatchQueryController, trialUpdateController, trialDeleteController, trialSummaryController } = require('../controllers/trial');
router.post('/api/trial/generate', trialGenerateController);
router.post('/api/trial/batchQuery', trialBatchQueryController);
router.patch('/api/trial/update', trialUpdateController);
router.post('/api/trial/delete', trialDeleteController);
router.post('/api/trial/summary', trialSummaryController);

const { loginController, verifyTokenController } = require('../controllers/login');
router.post('/api/login', loginController);
router.post('/api/verify-token', verifyTokenController);

module.exports = router;
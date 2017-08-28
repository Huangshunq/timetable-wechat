const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./routers/controller');
const staticFile = require('./routers/staticFile');

const app = new Koa();
app.use(bodyParser());
app.use(staticFile('/static/', __dirname + '/static'));
app.use(controller());

module.exports = app.listen(8800, () => {
    console.log('listening on port 8800');
});
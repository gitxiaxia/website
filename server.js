const http = require('http');
const koa = require('koa');
const etag = require('koa-etag');
const bodyParser = require('koa-bodyparser');
const errorHandler = require('koa-error');
const compress = require('koa-compress');
const staticServer = require('koa-static');
const log = global.console.log.bind(console);
const PORT = process.env.PORT || 3333;
const koaBody = require('koa-body');
const render = require('koa-swig');
const co = require('co');
const path = require('path');
const Utils = require('./utils');
const router = require('./router');
const Tips = require('./utils/tip');
const app = new koa();

app.context.render = co.wrap(render({
    root: path.join(__dirname, '/views'),
    autoescape: true,
    cache: 'memory',
    ext: 'html',
    writeBody: false
}));

app.use(koaBody());
app.use(staticServer(__dirname + '/public'));

app.use(async(ctx, next) => {
    let {
        url = ''
    } = ctx;
    if (url.indexOf('/oa/') > -1) { //需要校验登录态
        let header = ctx.request.header;
        let {
            loginedtoken
        } = header;
        if (loginedtoken) {
            let result = Utils.verifyToken(loginedtoken);
            let {
                uid
            } = result;
            if (uid) {
                ctx.state = {
                    uid
                };
                await next();
            } else {
                return ctx.body = Tips[1005];
            }
        } else {
            return ctx.body = Tips[1005];
        }
    } else {
        await next();
    }
});

app.use(errorHandler());
app.use(bodyParser());
app.use(etag());

// compressor
app.use(compress({
    filter: contentType => /text|javascript/i.test(contentType),
    threshold: 2048
}));

router(app);
http.createServer(app.callback()).listen(PORT);

log('server is running on port: %s', PORT);
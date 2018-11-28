const web = require('./web');
const user = require('./user');
const webindex = require('./webindex');
const webdesigner = require('./webdesigner');
const webabout = require('./webabout');
const webNew = require('./webNew');
module.exports = function(app) {
	app.use(web.routes()).use(web.allowedMethods());
	app.use(user.routes()).use(user.allowedMethods());
	app.use(webindex.routes()).use(webindex.allowedMethods());
	app.use(webdesigner.routes()).use(webdesigner.allowedMethods());
	app.use(webabout.routes()).use(webabout.allowedMethods());
	app.use(webNew.routes()).use(webNew.allowedMethods());
}
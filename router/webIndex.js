const router = require('koa-router')();
const Utils = require('../utils');
const Tips = require('../utils/tip');
const db = require('../db');

router.post('/oa/web/index', async(ctx, next) => {
	let sql1 = `select * from webindex;`,
		sql = `select * from webbanner order by indexs desc;`;
	await db.query(sql1 + sql).then(async result => {
		ctx.body = {
			...Tips[0],
			data: result[0],
			banner: result[1]
		};
	}).catch(e => {
		ctx.body = Tips[1010];
	})
});

router.post('/oa/web/indexUpload', async(ctx, next) => {
	let sql = `UPDATE webindex set mTitle=?,mKeywords=?,mDescription=?,DesignerName=?,DesignerStyle=?,DesignerCover=?,DesignerInfo=? WHERE id=1`,
		value = [ctx.request.body.mTitle, ctx.request.body.mKeywords, ctx.request.body.mDescription, ctx.request.body.DesignerName, ctx.request.body.DesignerStyle, ctx.request.body.DesignerCover, ctx.request.body.DesignerInfo];
	await db.query(sql, value).then(async res => {
		let {
			insertId: id
		} = res;
		ctx.body = {
			...Tips[0],
			data: {
				id
			}
		}
	}).catch(e => {
		ctx.body = Tips[1010];
	});
});

router.post('/oa/web/bannerAdd', async(ctx, next) => {
	let data = Utils.filter(ctx.request.body, ['title', 'imgs']);
	let res = Utils.formatData(data, [{
		key: 'title',
		type: 'not_empty'
	}, {
		key: 'imgs',
		type: 'not_empty'
	}]);
	if(!res) return ctx.body = Tips[1007];
	let sql = `INSERT INTO webbanner(id,title,imgs,url,indexs) VALUES (?,?,?,?,?)`,
		value = [0, ctx.request.body.title, ctx.request.body.imgs, ctx.request.body.url, 0];
	await db.query(sql, value).then(async res => {
		let {
			insertId: id
		} = res;
		ctx.body = {
			...Tips[0],
			data: {
				id
			}
		}
	}).catch(e => {
		ctx.body = Tips[1010];
	});
});

router.post('/oa/web/bannerUpload', async(ctx, next) => {
	let data = Utils.filter(ctx.request.body, ['id', 'title', 'imgs']);
	let res = Utils.formatData(data, [{
		key: 'id',
		type: 'not_empty'
	}, {
		key: 'title',
		type: 'not_empty'
	}, {
		key: 'imgs',
		type: 'not_empty'
	}]);
	if(!res) return ctx.body = Tips[1007];
	let sql = 'UPDATE webbanner set title=?,imgs=?,url=?,indexs=? WHERE id=' + ctx.request.body.id + '',
		value = [ctx.request.body.title, ctx.request.body.imgs, ctx.request.body.url, ctx.request.body.indexs];
	await db.query(sql, value).then(async res => {
		ctx.body = {
			...Tips[0]
		}
	}).catch(e => {
		ctx.body = Tips[1010];
	});
});

router.post('/oa/web/bannerDel', async(ctx, next) => {
	let data = Utils.filter(ctx.request.body, ['id']);
	let res = Utils.formatData(data, [{
		key: 'id',
		type: 'not_empty'
	}]);
	if(!res) return ctx.body = Tips[1007];
	let sql = 'delete from webbanner WHERE id=' + ctx.request.body.id + '',
		value = []
	await db.query(sql, value).then(async res => {
		ctx.body = {
			...Tips[0]
		}
	}).catch(e => {
		ctx.body = Tips[1010];
	});
});

router.post('/oa/web/LinkList', async(ctx, next) => {
	let sql = 'select * from weblink order by id desc;',
		value = []
	await db.query(sql, value).then(async res => {
		ctx.body = {
			...Tips[0],
			data: res
		}
	}).catch(e => {
		ctx.body = Tips[1010];
	});
});

router.post('/oa/web/LinkUpload', async(ctx, next) => {
	let data = Utils.filter(ctx.request.body, ['id', 'linkName', 'linkUrl']);
	let res = Utils.formatData(data, [{
		key: 'id',
		type: 'not_empty'
	}, {
		key: 'linkName',
		type: 'not_empty'
	}, {
		key: 'linkUrl',
		type: 'not_empty'
	}]);
	if(!res) return ctx.body = Tips[1007];
	let sql = 'UPDATE weblink set linkName=?,linkUrl=? WHERE id=' + ctx.request.body.id + '',
		value = [ctx.request.body.linkName, ctx.request.body.linkUrl];
	await db.query(sql, value).then(async res => {
		let {
			insertId: id
		} = res;
		ctx.body = {
			...Tips[0],
			data: {
				id
			}
		}
	}).catch(e => {
		ctx.body = Tips[1010];
	});
});

router.post('/oa/web/LinkAdd', async(ctx, next) => {
	let data = Utils.filter(ctx.request.body, ['linkName', 'linkUrl']);
	let res = Utils.formatData(data, [{
		key: 'linkName',
		type: 'not_empty'
	}, {
		key: 'linkUrl',
		type: 'not_empty'
	}]);
	if(!res) return ctx.body = Tips[1007];
	let sql = `INSERT INTO weblink(id,linkName,linkUrl) VALUES (?,?,?)`,
		value = [0, ctx.request.body.linkName, ctx.request.body.linkUrl];
	await db.query(sql, value).then(async res => {
		let {
			insertId: id
		} = res;
		ctx.body = {
			...Tips[0],
			data: {
				id
			}
		}
	}).catch(e => {
		ctx.body = Tips[1010];
	});
});

router.post('/oa/web/LinkDel', async(ctx, next) => {
	let data = Utils.filter(ctx.request.body, ['id']);
	let res = Utils.formatData(data, [{
		key: 'id',
		type: 'not_empty'
	}]);
	if(!res) return ctx.body = Tips[1007];
	let sql = 'delete from weblink WHERE id=' + ctx.request.body.id + '',
		value = []
	await db.query(sql, value).then(async res => {
		ctx.body = {
			...Tips[0]
		}
	}).catch(e => {
		ctx.body = Tips[1010];
	});
});

router.post('/oa/web/formList', async(ctx, next) => {
	let sql = 'select * from webform ORDER BY time DESC',
		value = []
	await db.query(sql).then(async res => {
		ctx.body = {
			...Tips[0],
			data: res
		}
	}).catch(e => {
		ctx.body = Tips[1010];
	});
});

module.exports = router;
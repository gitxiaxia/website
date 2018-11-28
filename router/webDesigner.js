const router = require('koa-router')();
const Utils = require('../utils');
const Tips = require('../utils/tip');
const db = require('../db');

router.post('/oa/designer', async(ctx, next) => {
	let sql1 = `select * from webdesignerlist where status=1;`,
		sql = `select * from webdesigner;`;
	await db.query(sql1 + sql).then(async result => {
		ctx.body = {
			...Tips[0],
			data: result[1][0],
			list: result[0]

		};
	}).catch(e => {
		ctx.body = Tips[1010];
	})
});

router.post('/oa/designer/Upload', async(ctx, next) => {
	let sql = `UPDATE webdesigner set mTitle=?,mKeywords=?,mDescription=? WHERE id=1;`,
		value = [ctx.request.body.mTitle, ctx.request.body.mKeywords, ctx.request.body.mDescription];
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


router.post('/oa/designer/DesignerUpload', async(ctx, next) => {
	let sql = `UPDATE webdesignerlist set name=?,style=?,cover=?,info=? WHERE id=?;`,
		value = [ctx.request.body.name, ctx.request.body.style, ctx.request.body.cover,ctx.request.body.info,ctx.request.body.id];
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

module.exports = router;
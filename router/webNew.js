const router = require('koa-router')();
const Utils = require('../utils');
const Tips = require('../utils/tip');
const db = require('../db');


router.post('/oa/new/index', async(ctx, next) => {
	let sql = 'SELECT * FROM weblist',
		value = '';
	await db.query(sql, value).then(async res => {
		if(res && res.length > 0) {
			ctx.body = {
				...Tips[0],
				data: res[0]
			};
		} else {
			ctx.body = Tips[1003];
		}
	}).catch(e => {
		ctx.body = Tips[1010];
	})
});

router.post('/oa/new/newIndexUpload', async(ctx, next) => {
	let sql = `UPDATE weblist set mTitle=?,mKeywords=?,mDescription=? WHERE id=1`,
		value = [ctx.request.body.mTitle,ctx.request.body.mKeywords,ctx.request.body.mDescription];
	await db.query(sql, value).then(async res => {
		ctx.body = {
			...Tips[0]
		}
	}).catch(e => {
		ctx.body = Tips[1010];
	});
});

router.post('/oa/new/newLabel', async(ctx, next) => {
	let sql = 'SELECT * FROM webnewlabel',
		value = '';
	await db.query(sql, value).then(async res => {
		if(res && res.length > 0) {
			ctx.body = {
				...Tips[0],
				data: res
			};
		} else {
			ctx.body = Tips[1003];
		}
	}).catch(e => {
		ctx.body = Tips[1010];
	})
});

router.post('/oa/new/newLabelEdit', async(ctx, next) => {
	let data = Utils.filter(ctx.request.body, ['name']);
	let res = Utils.formatData(data, [{
		key: 'name',
		type: 'not_empty'
	}]);
	if(!res) return ctx.body = Tips[1007];
	let {
		id = 0, name = '', status = 0
	} = data;
	let sql = `INSERT INTO webnewlabel(id,labelName,status) VALUES (?,?,?)`,
		value = [id, name, status];
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

router.post('/oa/new/newList', async(ctx, next) => {
	let data = Utils.filter(ctx.request.query, ['pageSize', 'pageNum', 'labelId', 'type']) || {};
	let res = Utils.formatData(data, [{
		key: 'type',
		type: 'number'
	}, {
		key: 'labelId',
		type: 'not_empty'
	}]);
	if(!res) return ctx.body = Tips[1007];
	let {
		pageSize = 15, pageNum = 1, type = 0, labelId = labelId
	} = data;
	pageSize = Number(pageSize);
	pageNum = Number(pageNum);
	let offset = (pageNum - 1) * pageSize;
	let sql1 = `SELECT count(1) FROM  webnewlist WHERE labelId=${labelId} and status=1;`,
		sql = `SELECT *  FROM  webnewlist WHERE labelId=${labelId} and status=1 ORDER BY uploadTime DESC`;
	if(+type === 1) {
		sql += ` limit ${offset},${pageSize};`
	}
	await db.query(sql1 + sql).then(async result => {
		let res1 = result[0],
			res2 = result[1],
			total = 0,
			list = []
		if(res1 && res1.length > 0 && res2 && res2.length > 0) {
			total = res1[0]['count(1)']
			list = res2;
			ctx.body = {
				...Tips[0],
				data: {
					list,
					pageSize,
					total
				}
			};
		} else {
			ctx.body = Tips[1003];
		}
	}).catch(e => {
		ctx.body = Tips[1010];
	})
});

router.post('/oa/new/newDel', async(ctx, next) => {
	let data = Utils.filter(ctx.request.body, ['newid']);
	let res = Utils.formatData(data, [{
		key: 'newid',
		type: 'not_empty'
	}]);
	if(!res) return ctx.body = Tips[1007];
	let {
		newid = newid
	} = data;
	let sql = `UPDATE webnewlist set status=0 WHERE id=?`,
		value = [newid];
	await db.query(sql, value).then(async res => {
		ctx.body = {
			...Tips[0]
		}
	}).catch(e => {
		ctx.body = Tips[1010];
	});
});

router.post('/oa/new/newDetails', async(ctx, next) => {
	let data = Utils.filter(ctx.request.query, ['Id']) || {};
	let res = Utils.formatData(data, [{
		key: 'Id',
		type: 'not_empty'
	}]);
	if(!res) return ctx.body = Tips[1007];
	let {
		Id = Id
	} = data;
	let sql = 'SELECT * FROM webnewlist where id=? and status=1',
		value = [Id];
	await db.query(sql, value).then(async res => {
		if(res && res.length > 0) {
			ctx.body = { ...Tips[0],
				data: res
			};
		} else {
			ctx.body = Tips[1003];
		}
	}).catch(e => {
		ctx.body = Tips[1010];
	})
});

router.post('/oa/new/newUpload', async(ctx, next) => {
	let data = Utils.filter(ctx.request.body, ['id', 'labelId', 'title', 'cover', 'info', 'author']) || {};
	let res = Utils.formatData(data, [{
		key: 'id',
		type: 'not_empty'
	}, {
		key: 'labelId',
		type: 'not_empty'
	}, {
		key: 'title',
		type: 'not_empty'
	}, {
		key: 'cover',
		type: 'not_empty'
	}, {
		key: 'info',
		type: 'not_empty'
	}, {
		key: 'author',
		type: 'not_empty'
	}]);
	if(!res) return ctx.body = Tips[1007];
	let {
		id = id, labelId = labelId, title = title, cover = cover, info = info, url = ctx.request.body.url, author = ctx.request.body.author, edit = ctx.request.body.edit, content = ctx.request.body.content, status = 1
	} = data;
	if(id == '0') {
		var sql = `INSERT INTO webnewlist(id,labelId,title,cover,info,uploadTime,url,author,edit,content,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
			value = [0, labelId, title, cover, info, Date.now(), url, author, edit, content, status];

	} else {
		var sql = `UPDATE webnewlist set labelId=?,title=?,cover=?,info=?,uploadTime=?,url=?, author=?,edit=?,content=? WHERE id=?`,
			value = [labelId, title, cover, info, Date.now(), url, author, edit, content, id];
	}
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
	})
});

router.post('/oa/new/Recommend', async(ctx, next) => {
	let data = Utils.filter(ctx.request.body, ['id', 'label']) || {};
	let res = Utils.formatData(data, [{
		key: 'id',
		type: 'not_empty'
	}, {
		key: 'label',
		type: 'not_empty'
	}]);
	if(!res) return ctx.body = Tips[1007];
	let sql = 'UPDATE webnewlabel set recommendId=? WHERE id=?',
		value = [ctx.request.body.id, ctx.request.body.label];
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
	})
});

module.exports = router;
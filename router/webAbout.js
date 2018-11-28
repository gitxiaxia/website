const router = require('koa-router')();
const Utils = require('../utils');
const Tips = require('../utils/tip');
const db = require('../db');

router.post('/oa/about', async(ctx, next) => {
    let sql = 'select * from webabout',
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

router.post('/oa/about/UpData', async(ctx, next) => {
    let data = Utils.filter(ctx.request.body, ['id']);
    let res = Utils.formatData(data, [{
        key: 'id',
        type: 'not_empty'
    }]);
    if (!res) return ctx.body = Tips[1007];
    let sql = `UPDATE webabout set mTitle=?,mKeywords=?,mDescription=? WHERE id=?;`,
        value = [ctx.request.body.mTitle, ctx.request.body.mKeywords, ctx.request.body.mDescription, ctx.request.body.id];
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

router.post('/oa/about/story', async(ctx, next) => {
    let sql = 'select * from webstory order by id desc',
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

router.post('/oa/about/StoryAdd', async(ctx, next) => {
    let data = Utils.filter(ctx.request.body, ['title', 'text', 'time']);
    let res = Utils.formatData(data, [{
        key: 'title',
        type: 'not_empty'
    }, {
        key: 'text',
        type: 'not_empty'
    }, {
        key: 'time',
        type: 'not_empty'
    }]);
    if (!res) return ctx.body = Tips[1007];
    var sql = `INSERT INTO webstory(id,title,text,time) VALUES (?,?,?,?)`,
        value = [0, ctx.request.body.title, ctx.request.body.text, ctx.request.body.time];
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

router.post('/oa/about/StoryUp', async(ctx, next) => {
    let data = Utils.filter(ctx.request.body, ['id', 'title', 'text', 'time']);
    let res = Utils.formatData(data, [{
        key: 'id',
        type: 'not_empty'
    }, {
        key: 'title',
        type: 'not_empty'
    }, {
        key: 'text',
        type: 'not_empty'
    }, {
        key: 'time',
        type: 'not_empty'
    }]);
    if (!res) return ctx.body = Tips[1007];
    let sql = `UPDATE webstory set title=?,text=?,time=? WHERE id=?;`,
        value = [ctx.request.body.title, ctx.request.body.text, ctx.request.body.time, ctx.request.body.id];
    await db.query(sql, value).then(async res => {
        ctx.body = {
            ...Tips[0]
        }
    }).catch(e => {
        ctx.body = Tips[1010];
    });
});

router.post('/oa/about/StoryDelete', async(ctx, next) => {
    let data = Utils.filter(ctx.request.body, ['id']) || {};
    let res = Utils.formatData(data, [{
        key: 'id',
        type: 'not_empty'
    }]);
    if (!res) return ctx.body = Tips[1007];
    let sql = 'delete from webstory where id=?',
        value = [ctx.request.body.id];
    await db.query(sql, value).then(async res => {
        ctx.body = {
            ...Tips[0]
        }
    }).catch(e => {
        ctx.body = Tips[1010];
    })
});

module.exports = router;
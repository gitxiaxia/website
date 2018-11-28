const router = require('koa-router')();
const Utils = require('../utils');
const Tips = require('../utils/tip');
const db = require('../db');
const fs = require('fs');

var QcloudSms = require("qcloudsms_js"); //短信腾讯云
var appid = 1400052141;
var appkey = "f5af1646848f6f03581a2a08c06e1446";
var templId = 73784;
var qcloudsms = QcloudSms(appid, appkey);
var ssender = qcloudsms.SmsSingleSender();

router.get('/', async(ctx, next) => {
    var data = '';
    var banner = '';
    var footer = '';
    var list = [];
    var recommend = [];
    var labels = '';
    let sql = `select * from webindex;`,
        sql1 = `select * from webbanner order by indexs desc;`,
        sql2 = `select linkName,linkUrl from weblink;`,
        sql3 = `select labelName,id from webnewlabel order by id limit 0,4;`;
    await db.query(sql + sql1 + sql2 + sql3).then(async result => {
        data = result[0][0];
        banner = result[1];
        footer = result[2];
        labels = result[3];
    });
    let recSql = `select id,labelName,recommendId from webnewlabel where status='0' order by id limit 0,4`;
    await db.query(recSql).then(res => {
        list = res;
        for (let i = 0; i < res.length; i++) {
            recommend.push(res[i].recommendId)
        }
    })

    let recSql2 = 'SELECT * from webnewlist where id in (' + recommend.join(',') + ') order by labelId';
    await db.query(recSql2).then(res2 => {
        for (let i = 0; i < res2.length; i++) {
            list[i].recommend = res2[i]
        }
    })
    for (let i = 0; i < list.length; i++) {
        let recSql3 = 'SELECT * from webnewlist where id !=' + list[i].recommendId + ' and status =1 and labelId =' + list[i].id + ' order by uploadTime desc limit 0,3';
        await db.query(recSql3).then(res3 => {
            list[i].list = res3
        })
    }
    ctx.body = await ctx.render('index', {
        data: data,
        banner: banner,
        recommend: list,
        footer: footer,
        labels: labels,
        active: 'index'
    })
})

router.get('/list', async(ctx, next) => {
    let par = Utils.filter(ctx.request.query, ['Id']) || {};
    let res = Utils.formatData(par, [{
        key: 'Id',
        type: 'not_empty'
    }]);
    if (!res) return ctx.body = Tips[1007];
    var data = '';
    var label = '';
    var list = '';
    var footer = '';
    let sql = 'select * from webnewlabel;',
        sql1 = 'select * from webnewlist where labelId=' + ctx.request.query.Id + ' and status=1 ORDER BY uploadTime DESC limit 0,10;',
        sql2 = 'select linkName,linkUrl from weblink;',
        sql3 = `select * from weblist;`;
    await db.query(sql + sql1 + sql2 + sql3).then(async result => {
        if (result[1].length > '0') {
            ctx.body = await ctx.render('list', {
                labelId: ctx.request.query.Id,
                label: result[0],
                list: result[1],
                footer: result[2],
                labels: result[0],
                data: result[3][0],
                active: 'list'
            })
        } else {
            ctx.body = await ctx.render('404')
        }
    });
})

router.get('/listMore', async(ctx, next) => {
    let data = Utils.filter(ctx.request.query, ['pageSize', 'pageNum', 'labelId']) || {};
    let res = Utils.formatData(data, [{
        key: 'labelId',
        type: 'not_empty'
    }]);
    if (!res) return ctx.body = Tips[1007];
    let {
        pageSize = 10, pageNum = 2, labelId = labelId
    } = data;
    pageSize = Number(pageSize);
    pageNum = Number(pageNum);
    let offset = (pageNum - 1) * pageSize;
    let sql = `SELECT *  FROM  webnewlist WHERE labelId=${labelId} and status=1 ORDER BY uploadTime DESC limit ${offset},${pageSize}`;
    await db.query(sql).then(async result => {
        ctx.body = {
            ...Tips[0],
            data: result
        };
    }).catch(e => {
        ctx.body = Tips[1010];
    })
})

router.get('/designer', async(ctx, next) => {
    var data = '';
    var list = '';
    var footer = '';
    let sql = 'select * from webdesignerlist where status=1 order by rand() limit 0,6;',
        sql1 = 'select * from webdesigner;',
        sql2 = `select linkName,linkUrl from weblink;`,
        sql3 = `select labelName,id from webnewlabel;`;
    await db.query(sql + sql1 + sql2 + sql3).then(async result => {
        ctx.body = await ctx.render('designer', {
            list: result[0],
            data: result[1][0],
            footer: result[2],
            labels: result[3],
            active: 'designer'
        })
    });
})

router.get('/details', async(ctx, next) => {
    let par = Utils.filter(ctx.request.query, ['id']) || {};
    let res = Utils.formatData(par, [{
        key: 'id',
        type: 'not_empty'
    }]);
    if (!res) return ctx.body = Tips[1007];
    var data = '';
    var footer = '';
    let sql = 'select * from webnewlist where id=' + ctx.request.query.id + ' and status=1;',
        sql1 = `select linkName,linkUrl from weblink;`,
        sql2 = `select labelName,id from webnewlabel;`;
    await db.query(sql + sql1 + sql2).then(async result => {
        if (result[0].length > '0') {
            ctx.body = await ctx.render('details', {
                data: result[0][0],
                footer: result[1],
                labels: result[2],
                active: 'details'
            })
        } else {
            ctx.body = await ctx.render('404')
        }
    });
})

router.get('/about', async(ctx, next) => {
    var Id = '';
    var data = '';
    var label = '';
    var footer = '';
    var lists = '';
    if (ctx.request.query.Id == undefined) {
        Id = '1';
    } else if (ctx.request.query.Id != '1' && ctx.request.query.Id != '2' && ctx.request.query.Id != '3' && ctx.request.query.Id != '4') {
        ctx.body = await ctx.render('404')
        return;
    } else {
        Id = ctx.request.query.Id;
    }
    let sql = 'select * from webnewlabel;',
        sql1 = 'select * from webabout where id = ' + Id + ';',
        sql2 = 'select linkName,linkUrl from weblink;',
        sql3 = 'select * from webstory order by id desc;';
    await db.query(sql + sql1 + sql2 + sql3).then(async result => {
        ctx.body = await ctx.render('about', {
            labelId: Id,
            data: result[1][0],
            footer: result[2],
            labels: result[0],
            lists: result[3],
            active: 'about'
        })
    });
})

router.get('/download', async(ctx, next) => {
    var label = '';
    var footer = '';
    var data = {
        mTitle: '异平台手机APP下载-原创服装设计师平台',
        mKeywords: '服装平台,原创服装平台,服装设计师,原创品牌,原创设计师,设计师平台,独立设计师,原创服装',
        mDescription: '异平台手机APP汇聚国内数千优秀匠人、原创服装设计师，带你发现专业原创设计师作品，打造不一样的潮流社区。多方面了解设计师，满足你不一样的喜好，带你进入一个专属的个性潮流世界。'
    };
    let sql = 'select * from webnewlabel;',
        sql2 = 'select linkName,linkUrl from weblink;'
    await db.query(sql + sql2).then(async result => {
        ctx.body = await ctx.render('download', {
            footer: result[1],
            labels: result[0],
            data: data,
            active: 'download'
        })
    });
})

router.get('/aboutValues', async(ctx, next) => {
    ctx.body = await ctx.render('about-values')
})

router.get('/aboutStory', async(ctx, next) => {
    var lists = '';
    let sql = 'select * from webstory order by id desc;';
    await db.query(sql).then(async result => {
        ctx.body = await ctx.render('about-story', {
            lists: result
        })
    });
})

router.get('/aboutJoin', async(ctx, next) => {
    ctx.body = await ctx.render('about-join')
})

router.get('/aboutContact', async(ctx, next) => {
    ctx.body = await ctx.render('about-contact')
})

router.get('/features', async(ctx, next) => {
    ctx.body = await ctx.render('features');
})

router.get('*', async(ctx, next) => {
    ctx.body = await ctx.render('404')
})

router.post('/Sms', async(ctx, next) => { //短信
    var Num = '';
    let data = Utils.filter(ctx.request.body, ['phone']);
    let res = Utils.formatData(data, [{
        key: 'phone',
        type: 'not_empty'
    }]);
    if (!res) return ctx.body = Tips[1007];
    let sql = 'select * from webform WHERE phone=' + ctx.request.body.phone + ' and area=' + ctx.request.body.area + '',
        value = []
    await db.query(sql, value).then(async res => {
        if (res.length == '0') {
            for (var i = 0; i < 4; i++) {
                Num += Math.floor(Math.random() * 10);
            }
            ctx.body = {
                ...Tips[0],
                data: Num
            };
            ssender.sendWithParam(ctx.request.body.area, ctx.request.body.phone, templId, [Num, "两"], "", "", "",
                function(err, ress, resData) {
                    if (err) {
                        console.log("err: ", err);
                    }
                });
        }
        if (res.length > '0') {
            ctx.body = {
                ...Tips[1009],
                data: '您已提交过申请'
            };
        }
    })
});

router.post('/FormPost', async(ctx, next) => {
    let data = Utils.filter(ctx.request.body, ['name', 'add', 'company', 'email', 'phone', 'type', 'style', 'area']);
    let res = Utils.formatData(data, [{
        key: 'name',
        type: 'not_empty'
    }, {
        key: 'add',
        type: 'not_empty'
    }, {
        key: 'company',
        type: 'not_empty'
    }, {
        key: 'email',
        type: 'not_empty'
    }, {
        key: 'phone',
        type: 'not_empty'
    }, {
        key: 'type',
        type: 'not_empty'
    }, {
        key: 'style',
        type: 'not_empty'
    }, {
        key: 'area',
        type: 'not_empty'
    }]);
    if (!res) return ctx.body = Tips[1007];
    let sql = 'select * from webform WHERE phone=' + ctx.request.body.phone + '',
        value = []
    await db.query(sql, value).then(async res => {
        if (res.length == '0') {
            let sql2 = `INSERT INTO webform(id,name,address,company,email,phone,type,style,time,area) VALUES (?,?,?,?,?,?,?,?,?,?)`,
                value2 = [0, ctx.request.body.name, ctx.request.body.add, ctx.request.body.company, ctx.request.body.email, ctx.request.body.phone, ctx.request.body.type, ctx.request.body.style, Date.now(), ctx.request.body.area];
            await db.query(sql2, value2).then(async res => {
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
        }
        if (res.length > '0') {
            ctx.body = {
                ...Tips[1009],
                data: '您已提交过申请'
            };
        }
    })

});

router.post('/FormPosts', async(ctx, next) => {
    let data = Utils.filter(ctx.request.body, ['phone', 'type', 'style']);
    let res = Utils.formatData(data, [{
        key: 'phone',
        type: 'not_empty'
    }, {
        key: 'type',
        type: 'not_empty'
    }, {
        key: 'style',
        type: 'not_empty'
    }]);
    if (!res) return ctx.body = Tips[1007];
    let sql = `INSERT INTO webform(id,name,address,company,email,phone,type,style,time) VALUES (?,?,?,?,?,?,?,?,?)`,
        value = [0, '', '', '', '', ctx.request.body.phone, ctx.request.body.type, ctx.request.body.style, Date.now()];
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
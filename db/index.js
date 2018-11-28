var mysql = require('mysql');
let config = {
    host: '192.168.0.111',
    user: 'root',
    password: '123456',
    database: 'donghui',
    port: 3306,
    dateStrings: 'DATETIME',
    multipleStatements: true //允许多条sql同时执行 
};
let pool = mysql.createPool(config);
let query = (sql, values) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
};
module.exports = {
    query
}
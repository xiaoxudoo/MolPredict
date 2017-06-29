var mysql = require('mysql');
var async = require("async")
var _ = require("underscore")._;

var config = require('../config');

var pool = mysql.createPool({
    host: config.dbConfig.host,
    user: config.dbConfig.user,
    password: config.dbConfig.password,
    database: config.dbConfig.database,
    connectionLimit: 50000,
    port: config.dbConfig.port,
    waitForConnections: false,
    debug:false
});

pool.on('error', function (error) {
    console.log("db error:");
    console.log(error);
});

module.exports = {
    get: get,
    getRows: getRows,
    insert: insert,
    trans: trans,
    execute: execute,
    update: update,
    getInsertSqlAndParams: getInsertSqlAndParams,
    getSelectSqlAndParams: getSelectSqlAndParams,
    getUpdateSqlAndParams: getUpdateSqlAndParams,
    native: native,
    executeTran: execTrans,
}

function native(sql, data, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn)
                conn.release();
            return callback(err, null, null);
        } else {
            conn.query(sql, data, function (qerr, rows, fields) {
                if (conn)
                    conn.release();
                return callback(qerr, rows, fields);
            });
        }
    })
}


function update(sql, paramAry, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return callback(err, null);
        }
        console.log(sql);
        console.log(paramAry);
        connection.query(sql, paramAry, function (err, rows, fields) {
            connection.release();
            if (err) {
                callback(err, null);
            } else {
                callback(err, rows, fields);
            }
        })
    })
}

function get(sql, paramsArray, func) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return func(err, null);
        }
        connection.query(sql, paramsArray, function (err, rows, fields) {
            connection.release();
            if (err) {
                console.log(sql);
                console.log(paramsArray);
                return func(err, null);
            }
            var data = null;
            if (rows && rows.length > 0) {
                data = rows[0];
            }

            return func(null, data);
        });
    });
}

function getRows(sql, paramsArray, func) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return func(err, null);
        }
        console.log(sql);
        connection.query(sql, paramsArray, function (err, rows, fields) {
            connection.release();
            if (err) {
                console.error(err);
                func(err);
            }
            return func(null, rows);
        });
    });
}


function insert(sql, paramsArray, func) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return func(err, null);
        }
        connection.query(sql, paramsArray, function (err, rows, fields) {
            connection.release();
            if (err)
                func(err);

            var data = null;
            if (rows && rows.length > 0) {
                data = rows[0];
            }

            return func(null, data);
        });
    });
}

function trans(func) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return func(err, null);
        }
        var trans = connection.beginTransaction(function (err) {
            if (err) {
                func(err);
            }
            console.log("running func");
            func(connection);
        });
    });
}

function execTrans(sqlparamsEntities, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err, null);
        }
        connection.beginTransaction(function (err) {
            if (err) {
                return callback(err, null);
            }
            console.log("开始执行transaction，共执行" + sqlparamsEntities.length + "条数据");
            var funcAry = [];
            sqlparamsEntities.forEach(function (sql_param) {
                var temp = function (cb) {
                    var sql = sql_param.sql;
                    var param = sql_param.params;
                    connection.query(sql, param, function (tErr, rows, fields) {
                        if (tErr) {
                            connection.rollback(function () {
                                console.log("事务失败，" + JSON.stringify(sql_param) + "，ERROR：" + tErr);
                                return cb(tErr, null);
                            });
                        } else {
                            return cb(null, 'ok');
                        }
                    })
                };
                funcAry.push(temp);
            });

            async.series(funcAry, function (err, result) {
                console.log("transaction error: " + err);
                if (err) {
                    connection.rollback(function () {
                        console.log("transaction error: " + err);
                        connection.release();
                        return callback(err, null);
                    });
                } else {
                    connection.commit(function (err, info) {
                        if (err) {
                            console.log("执行事务失败，" + err);
                            connection.rollback(function () {
                                console.log("transaction error: " + err);
                                connection.release();
                                return callback(err, null);
                            });
                        } else {
                            connection.release();
                            return callback(null, info);
                        }
                    })
                }
            })
        });
    });
}


function execute(sql, paramsArray, func) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return func(err, null);
        }
        connection.query(sql, paramsArray, function (err, rows, fields) {
            connection.release();
            if (err)
                func(err);
            var data = null;
            if (rows && rows.length > 0) {
                data = rows[0];
            }

            return func(null, data);
        });
    });
}


var LetyCommand = function (commandText, paramArray) {
    this.sql = commandText;
    this.params = paramArray;

    if (paramArray.length == 0) {
        this.params = paramArray[0];
    } else {
        this.params = paramArray;
    }

    this.execute = function (func) {
        var s = this.sql;
        var p = this.params;
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                return func(err, null);
            }
            connection.query(s, p, func);
        });
    }

    this.executeInTrans = function (connection, func) {
        var s = this.sql;
        var p = this.params;
        console.log(s, p);
        connection.query(s, p, func);
    }
    return this;
}


function getInsertSqlAndParams(obj, tableName) {
    var sql = "insert into " + tableName;
    var fields = [];
    var qs = [];
    var values = [];
    _.keys(obj).forEach(function (key) {
        var val = obj[key];
        fields.push("`" + key + "`");
        values.push(val);
        qs.push("?")
    })

    sql = sql + "(" + fields.join(",") + ") values (" + qs.join(",") + ")";
    var result = new LetyCommand(sql, values);
    console.log(result);
    return result;
}

/**
 * 只支持and条件拼接
 * @param params
 * @param fromTable
 * @returns {*[]}
 */
function getSelectSqlAndParams(params, fromTable) {
    var sql = "select * from " + fromTable;
    if (params == undefined || params == null || params == "") {
        return [sql, []];
    }
    var command = [];
    var values = [];
    _.keys(params).forEach(function (key) {
        var val = params[key];

        var op = "=";
        if (Array.isArray(val)) {
            command.push(" `" + key + "` in(?) ");
        } else {
            command.push(" `" + key + "` = ? ");
        }
        values.push(val);
    })

    sql += " where " + command.join(" and ");
    return new LetyCommand(sql, values);
}

/**
 *
 * @param newFields 需要更新的字段
 * @param params 条件字段
 * @param fromTable 表名
 * @returns {*}
 */
function getUpdateSqlAndParams(newFields, params, fromTable) {
    var sql = "update " + fromTable;
    if (newFields == undefined || newFields == null || newFields == "") {
        return ["", []];
    }
    var values = [];

    var arr = [];
    _.keys(newFields).forEach(function (key) {
        var val = newFields[key];
        arr.push(" `" + key + "` = ? ");
        values.push(val);
    })

    sql += " set " + arr.join(",");

    if (params == undefined || params == null || params == "") {
        return [sql, []];
    }
    var command = [];
    _.keys(params).forEach(function (key) {
        var val = params[key];

        var op = "=";
        if (Array.isArray(val)) {
            command.push(" `" + key + "` in (?) ");
        } else {
            command.push(" `" + key + "` = ? ");
        }
        values.push(val);
    })

    sql += " where " + command.join(" and ");
    var result = new LetyCommand(sql, values);
    console.log(result);
    return result;
}


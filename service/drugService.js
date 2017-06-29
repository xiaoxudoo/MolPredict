//galaxy Service
var db = require('../utils/db_helper');
var request = require('request');
var moment = require('moment');
var config = require('../config');
var _ = require('underscore');
var xl = require('excel4node');


function save(params,cb){
    var result = db.getInsertSqlAndParams(params,$TABLE);
    result.execute(cb);
}

exports.save = save;

// 获取galaxy产品的库存信息
function getGalaxyStock(id,cb) {
    var sql = "SELECT * FROM `product` where id = ?";
    db.get(sql, [id], function (err, rows, fields) {
        if (err || rows.length == 0) {
            console.error("获取库存信息失败，" + err + "|" + JSON.stringify(rows));
            return cb(err, null);
        }
        else {
            return cb(null, rows);
        }
    })
}
exports.getGalaxyStock = getGalaxyStock;

//插入订单、支付信息
function insertFormOrder(e, cb) {
    var sqlParamEntities = [];
    /*-----------------------------------------------*/
    var sqlOrder = "insert into `order` set ?";
    var paramsOrder = e.orderInfo;
    console.log(e.orderInfo);
    sqlParamEntities.push(_getNewSqlParamEntity(sqlOrder, paramsOrder));//订单order表
    /*-----------------------------------------------*/
    // var sqlUpdateStock = "update product set `stock` = ? where `id` = ?";
    // sqlParamEntities.push(_getNewSqlParamEntity(sqlUpdateStock, paramsStock));//写错了，库存应该在付款完成后更新
    /*-----------------------------------------------*/
    var sqlSign = "insert into `selections` set ?";      
    for(var index in e.signInfo.options){
        var paramsSign = {};
        if(index != 'pf'){  // 排除pf
            paramsSign.product_id = config.galaxy.product;
            paramsSign.option_id = index;
            paramsSign.option_value = e.signInfo.options[index];
            paramsSign.order_id = e.orderInfo.id;
            sqlParamEntities.push(_getNewSqlParamEntity(sqlSign, paramsSign));
        }       
    }
    console.log(sqlParamEntities);

    db.executeTran(sqlParamEntities, function (err, info) {
        if (err) {
            console.log("插入订单失败，", err);
            return cb(err, null);
        } else {
            return cb(err, info);
        }
    })
}
exports.insertFormOrder = insertFormOrder;


//  更新订单信息
function setOrderStatus(e, cb) {
    //订单
    var setOrderSql = "update `order` set `status` = ?  where `id` = ? and `status` < 2";
    var orderPm = [e.orderRst, e.cb.merchant_no];
    
    //库存
    var sqlUpdateStock = "update `product` set `inventory` = ? where `id` = ?";
    var paramsStock = [];
    if (e.stocks.INVENTORY - 1 < 0) {
        //throw "库存不足";
        console.error(e.cb.merchant_no + "库存已经不足！");
        //TODO: 这里没有办法进行库存锁定，支付有效的周期不归我们管
    }
    paramsStock.push(e.stocks.INVENTORY - 1);
    paramsStock.push(e.stocks.ID);

    var sqlParamEntities = [];
    sqlParamEntities.push(_getNewSqlParamEntity(setOrderSql, orderPm));
    // 同步回调即同步库存，若异步回调成功，则不变，若失败则回滚。
    // sqlParamEntities.push(_getNewSqlParamEntity(sqlUpdateStock, paramsStock));
    db.executeTran(sqlParamEntities, function (err, info) {
        return cb(err, info);
    });
}
exports.setOrderStatus = setOrderStatus;

// 异步回调后修改订单
function setOrderStatusForCb(e, cb) {
    console.log("--修改订单状态(start)--");
    //订单
    var setOrderSql = "update `order` set `status` = ?, `notify_time` = ? where `id` = ?";
    var orderPm = [e.orderRst,moment().format("YYYY-MM-DD HH:mm:ss"),e.cb.order_id];
    //库存
    var sqlUpdateStock = "update `product` set `inventory` = ? where `id` = ?";
    var paramsStock = [];
    if (e.stocks.INVENTORY - 1 < 0) {
        // throw "库存不足";
        console.error(e.cb.order_id + "库存已经不足！");
    }
    paramsStock.push(e.stocks.INVENTORY - 1);
    paramsStock.push(e.stocks.ID);

    var sqlParamEntities = [];
    sqlParamEntities.push(_getNewSqlParamEntity(setOrderSql, orderPm));
    sqlParamEntities.push(_getNewSqlParamEntity(sqlUpdateStock, paramsStock));

    console.log(sqlParamEntities);
    db.executeTran(sqlParamEntities, function (err, info) {
        console.log("--修改订单和库存状态(end)--");
        return cb(err, info);
    })
}
exports.setOrderStatusForCb = setOrderStatusForCb;

function getSelectionsPhone(orderId,cb){
    //订单
    var sql = "SELECT * FROM `selections` where `option_id` = ? and `order_id` = ?";
    db.get(sql, ["phone",orderId], function (err, rows, fields) {
        if (err || rows.length == 0) {
            console.error("获取库存信息失败，" + err + "|" + JSON.stringify(rows));
            return cb(err, null);
        }
        else {
            return cb(null, rows);
        }
    })

}
exports.getSelectionsPhone = getSelectionsPhone;

//生成用于执行事务的Object
function _getNewSqlParamEntity(sql, params, callback) {
    if (callback) {
        return callback(null, {
            sql: sql,
            params: params
        });
    }
    return {
        sql: sql,
        params: params
    };
}


/**
 * 获取自有商品主要信息
 * @param prodId 商品ID
 * @param cb 回调函数
 */
function getProdInfo(prodId, cb) {
    var sql = "select * from `product` where id = ?";
    db.get(sql, prodId, function (err, rows, fields) {
        if (err) {
            console.error("获取自有商品数据失败，" + err);
            return cb(err, null);
        } else {
            return cb(null, rows);
        }
    });
}
exports.getProdInfo = getProdInfo;

function getOrder(orderId, cb) {
    var sql = "select * from `order` where id = ?";
    db.get(sql, [orderId], function (err, row, fields) {
        if (err) {
            console.error("获取订单信息失败，", err);
            return cb(err, null);
        } else {
            return cb(null, row);
        }
    })
}
exports.getOrder = getOrder;

function getSelections(cb){
    //订单
    var sql = "SELECT * FROM `selections`";
    db.getRows(sql, null, function (err, rows, fields) {
        if (err) {
            console.error('查询所有报名信息失败');
            return cb(err, null);
        } else {
            return cb(null, rows);
        }
    })

}
exports.getSelections = getSelections;

function getOrderedCard(idcard, cb) {
    var sql = "select * from `order` o join `selections` s on s.order_id = o.id where o.status = 2 and s.product_id = ? and s.option_id = ? and s.option_value = ?";
    db.getRows(sql, ["galaxy_camp","card",idcard], function (err, rows, fields) {
        if (err) {
            console.error("获取已使用的身份证信息失败");
            return cb(err, null);
        } else {
            return cb(null, rows);
        }
    })
}
exports.getOrderedCard = getOrderedCard;

function getOrderExcel(orderList, filename ,cb) {
    var row = 1;
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet("galaxy有效订单");

    /*----------设计excel格式----------*/
    var head_order = ws.cell(row, 1); //订单号
    head_order.string('订单号');

    var head_amount = ws.cell(row, 2); //订单金额
    head_amount.string('订单金额');

    var head_status = ws.cell(row, 3);//订单状态
    head_status.string('订单状态');

    var head_pf = ws.cell(row, 4);//下单平台
    head_pf.string('下单平台');

    var head_createTime = ws.cell(row, 5);//订单创建时间
    head_createTime.string('订单创建时间');

    var head_buyer = ws.cell(row, 6);//订单创建时间
    head_buyer.string('姓名');

    var head_tel = ws.cell(row, 7);//联系电话
    head_tel.string('联系电话');

    var head_email = ws.cell(row, 8);//收件地址
    head_email.string('电子邮件');

    var head_addr = ws.cell(row, 9);//收件地址
    head_addr.string('地址');

    var head_card = ws.cell(row, 10);//收件地址
    head_card.string('身份证');

    var head_state = ws.cell(row, 11);//收件地址
    head_state.string('职业状况');

    var head_team = ws.cell(row, 12);//收件地址
    head_team.string('目前的队伍');

    var head_position = ws.cell(row, 13);//收件地址
    head_position.string('擅长位置');

    var head_experience = ws.cell(row, 14);//收件地址
    head_experience.string('最高足球水平/足球经验');

    /*----------设计excel格式end----------*/

    /*----------填充excel数据----------*/
    var orderNos = [];
    orderList.forEach(o=> {
        orderNos.push(o.ID);
    });
    orderNos = _.uniq(orderNos);//去除重复后的订单
    console.log('本次导出订单公有[' + orderNos.length + "]条数据");

    /*----------填充excel数据----------*/
    orderNos.forEach(orderNo=> {
        row += 1;
        ws.cell(row, 1).string(orderNo);//订单号
        var currRows = orderList.filter(od=> {
            return od.ID == orderNo
        });//同一个订单下的信息，至少会有1条
        ws.cell(row, 2).string(currRows[0].AMOUNT.toString());//订单金额
        ws.cell(row, 3).string(convertStatus2String(currRows[0].STATUS)); //支付单状态（0-待支付，1-支付中未收到回调，2-支付成功，3-支付失败）
        ws.cell(row, 4).string(currRows[0].platform);//下单平台
        ws.cell(row, 5).string(moment(currRows[0].CREATE_TIME).format('YYYY-MM-DD HH:mm:ss'));
        ws.cell(row, 6).string(currRows[0].adminNo);//收件人
        ws.cell(row, 7).string(currRows[0].phone.toString());
        ws.cell(row, 8).string(currRows[0].email);
        ws.cell(row, 9).string(currRows[0].address);
        ws.cell(row, 10).string(currRows[0].card);
        ws.cell(row, 11).string(currRows[0].state);
        ws.cell(row, 12).string(currRows[0].team);
        ws.cell(row, 13).string(currRows[0].position);
        ws.cell(row, 14).string(currRows[0].experience);
    });
    /*----------生成excel文件----------*/
    var xlsxName = filename + ".xlsx";
    wb.write(config.tempImgPath + xlsxName, function (err) {
        if (err) {
            console.error("导出icc Excel失败， " + err);
            return cb(err, null);
        } else {
            console.log(config.tempImgPath + xlsxName);
            return cb(null, config.tempImgPath + xlsxName);
        }
    })
}
exports.getOrderExcel = getOrderExcel;


function getAllSuccessOrder(cb) {
    var sql = "select * from `order` where `status` = 2";
    db.getRows(sql, null, function (err, rows, fields) {
        if (err) {
            console.error('查询所有有效订单失败');
            return cb(err, null);
        } else {
            return cb(null, rows);
        }
    })
}
exports.getAllSuccessOrder = getAllSuccessOrder;

function getAllCusOrder(cb) {
    var sql = "select * from `order` ORDER BY create_time DESC";
    db.getRows(sql, null, function (err, rows, fields) {
        if (err) {
            console.error('查询所有订单失败');
            return cb(err, null);
        } else {
            return cb(null, rows);
        }
    })
}
exports.getAllCusOrder = getAllCusOrder;

function sqlTest(cb) {
    var sqls = [];
    // sqls.push(_getNewSqlParamEntity("update own_express set exp_status = 1, exp_no = '', exp_co = '', tel = '18514243088' where order_id = '72227222189288'", null));
    // sqls.push(_getNewSqlParamEntity("UPDATE own_icc_stock set stock = (500-(SELECT SUM(sku.ext_field) AS sale FROM own_order_item item JOIN own_sku sku ON item.sku = sku.sku JOIN own_order od on item.order_id = od.order_id WHERE ext_desc LIKE '%上海%' AND od.`status` = 2)) WHERE `id` = 2;", null));
    // sqls.push(_getNewSqlParamEntity("UPDATE own_icc_stock set stock = (600-(SELECT SUM(sku.ext_field) AS sale FROM own_order_item item JOIN own_sku sku ON item.sku = sku.sku JOIN own_order od on item.order_id = od.order_id WHERE ext_desc LIKE '%深圳%' AND od.`status` = 2)) WHERE `id` = 3;", null));
    // sqls.push(_getNewSqlParamEntity("update own_icc_stock set stock = '2500' where `id` = 1;", null));
    sqls.push(_getNewSqlParamEntity("update own_icc_stock set stock = '0' where `id` = 1;", null));
    // sqls.push(_getNewSqlParamEntity("update own_icc_stock set stock = '200' where `id` = 3;", null));
    db.executeTran(sqls, function (err, info) {
        return cb(err, info);
    })
}
exports.sqlTest = sqlTest;

function sqlQueryTest(cb) {
    var sql = "SELECT * FROM own_icc_stock";
    db.getRows(sql, null, function (err, rows) {
        return cb(err, rows);
    })
}
exports.sqlQueryTest = sqlQueryTest;


function convertStatus2String(code) {
    //支付单状态（0-待支付，1-支付中未收到异步回调，2-支付成功，3-支付失败）
    switch (code) {
        case 0:
            return "待支付";
        case 1:
            return "等待轮询支付结果";
        case 2:
            return "支付成功";
        case 3:
            return "支付失败";
        default:
            return "初始状态";
    }
}


//----------------统计部分----------------

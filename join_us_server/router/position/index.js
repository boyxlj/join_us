const express = require("express");
const positionRouter = express.Router();
const query = require("../../utils/mysql");
//职位信息表

positionRouter.get("/", (req, res) => {
	res.send({ code: 200, msg: "ok" });
});
// 职位详情接口,query参数传递position_id
positionRouter.get("/positionDetail", (req, res) => {
	const position_id = req.query.position_id;
	const sql = `select * from company, pos where pos.company_id = company.company_id and position_id = '${position_id}'`;
	query(sql, (result) => {
		res.send({
			code: 200,
			msg: "请求成功",
			data: result[0],
		});
	});
});
module.exports = positionRouter;

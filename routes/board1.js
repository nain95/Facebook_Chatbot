var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');
var Mecab = require('/home/ec2-user/mecab-mod.js');
var mecab = new Mecab();

router.use(express.static(__dirname + '/public'));
router.use(bodyParser.urlencoded({
extended:true}));
//   MySQL 로드
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host     :'localhost',
    user     :'root',
    password :'dlsduqdl',
    database :'capstone'   
}); 
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const path = require('path');
router.use('/node_modules',express.static(path.join(__dirname,'/node_modules')));
router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore({logFn: function(){}})
}));

function getConnection() {
	return pool
}
router.get('/',function(req, res, next) {
   res.redirect('/board1/login');
});

router.get('/list',function(req, res, next) {
   res.redirect('/board1/list-0/1');
});

router.get('/list2',function(req, res, next) {
   res.redirect('/board1/list2/1');
});
 
router.get('/list-0/:cur',function(req,res,next){							//전체 페이지
	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;
    pool.getConnection(function (err, connection) {
		var queryString = 'select count(*) as cnt from QnA'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
		//전체 게시물의 숫자
		totalPageCount = data[0].cnt

		//현재 페이지
		var curPage = req.params.cur;

		console.log("현재 페이지 : " + curPage, "전체 게시글 : " + totalPageCount);

		//전체 페이지 갯수
		if (totalPageCount < 0) {
		totalPageCount = 0
		}

		var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
		var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
		var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
		var startPage = ((curSet - 1) * page_list_size) + 1 //현재 세트내 출력될 시작 페이지
		var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


		//현재페이지가 0 보다 작으면
		if (curPage < 0) {
		no = 0
		} else {
		//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
		no = (curPage - 1) * page_size
		}

		console.log(no+'[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

		var result2 = {
		"curPage": curPage,
		"page_list_size": page_list_size,
		"page_size": page_size,
		"totalPage": totalPage,
		"totalSet": totalSet,
		"curSet": curSet,
		"startPage": startPage,
		"endPage": endPage,
		"no":no,
		"totalPageCount" : totalPageCount
		};

        var sql ="SELECT URL,Category, Title,BRDNO" +
                   " FROM QnA";
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
//            console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/list', {rows: rows?rows:{}, pasing : result2, num : 1,menu:0});
            connection.release();
        });
    });
});
});

router.get('/list-1/:cur',function(req,res,next){						//전표/장부관리 페이지
	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;
    pool.getConnection(function (err, connection) {
		var queryString = 'select count(*) as cnt from QnA where Category = "전표/장부관리"'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
		//전체 게시물의 숫자
		totalPageCount = data[0].cnt

		//현재 페이지
		var curPage = req.params.cur;

		console.log("현재 페이지 : " + curPage, "전체 게시글 : " + totalPageCount);

		//전체 페이지 갯수
		if (totalPageCount < 0) {
		totalPageCount = 0
		}

		var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
		var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
		var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
		var startPage = ((curSet - 1) * page_list_size) + 1 //현재 세트내 출력될 시작 페이지
		var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


		//현재페이지가 0 보다 작으면
		if (curPage < 0) {
		no = 0
		} else {
		//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
		no = (curPage - 1) * page_size
		}

		console.log(no+'[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

		var result2 = {
		"curPage": curPage,
		"page_list_size": page_list_size,
		"page_size": page_size,
		"totalPage": totalPage,
		"totalSet": totalSet,
		"curSet": curSet,
		"startPage": startPage,
		"endPage": endPage,
		"no":no,
		"totalPageCount" : totalPageCount
		};

        var sql ="SELECT URL,Category, Title, BRDNO" +
                   " FROM QnA WHERE Category = '전표/장부관리'";
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
           //console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/list', {rows: rows?rows:{}, pasing : result2, num : 1, menu : 1});
            connection.release();
        });
    });
});
});

router.get('/list-2/:cur',function(req,res,next){						// 자동전표처리 페이지

	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;
    pool.getConnection(function (err, connection) {
		var queryString = 'select count(*) as cnt from QnA where Category = "자동전표처리"'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
		//전체 게시물의 숫자
		totalPageCount = data[0].cnt

		//현재 페이지
		var curPage = req.params.cur;

		console.log("현재 페이지 : " + curPage, "전체 게시글 : " + totalPageCount);

		//전체 페이지 갯수
		if (totalPageCount < 0) {
		totalPageCount = 0
		}

		var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
		var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
		var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
		var startPage = ((curSet - 1) * page_list_size) + 1 //현재 세트내 출력될 시작 페이지
		var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


		//현재페이지가 0 보다 작으면
		if (curPage < 0) {
		no = 0
		} else {
		//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
		no = (curPage - 1) * page_size
		}

		console.log(no+'[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

		var result2 = {
		"curPage": curPage,
		"page_list_size": page_list_size,
		"page_size": page_size,
		"totalPage": totalPage,
		"totalSet": totalSet,
		"curSet": curSet,
		"startPage": startPage,
		"endPage": endPage,
		"no":no,
		"totalPageCount" : totalPageCount
		};

        var sql ="SELECT URL,Category, Title, BRDNO" +
                   " FROM QnA WHERE Category = '자동전표처리'";
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
           //console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/list', {rows: rows?rows:{}, pasing : result2, num : 1,menu:2});
            connection.release();
        });
    });
});
});

router.get('/list-3/:cur',function(req,res,next){						// 부가가치세 페이지
	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;
    pool.getConnection(function (err, connection) {
		var queryString = 'select count(*) as cnt from QnA where Category = "부가가치세"'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
		//전체 게시물의 숫자
		totalPageCount = data[0].cnt

		//현재 페이지
		var curPage = req.params.cur;

		console.log("현재 페이지 : " + curPage, "전체 게시글 : " + totalPageCount);

		//전체 페이지 갯수
		if (totalPageCount < 0) {
		totalPageCount = 0
		}

		var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
		var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
		var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
		var startPage = ((curSet - 1) * page_list_size) + 1 //현재 세트내 출력될 시작 페이지
		var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


		//현재페이지가 0 보다 작으면
		if (curPage < 0) {
		no = 0
		} else {
		//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
		no = (curPage - 1) * page_size
		}

		console.log(no+'[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

		var result2 = {
		"curPage": curPage,
		"page_list_size": page_list_size,
		"page_size": page_size,
		"totalPage": totalPage,
		"totalSet": totalSet,
		"curSet": curSet,
		"startPage": startPage,
		"endPage": endPage,
		"no":no,
		"totalPageCount" : totalPageCount
		};

        var sql ="SELECT URL,Category, Title,BRDNO" +
                   " FROM QnA WHERE Category = '부가가치세'";
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
           //console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/list', {rows: rows?rows:{}, pasing : result2, num : 1, menu : 3});
            connection.release();
        });
    });
});
});

router.get('/list-4/:cur',function(req,res,next){						// 결산/재무제표 페이지
	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;
    pool.getConnection(function (err, connection) {
		var queryString = 'select count(*) as cnt from QnA where Category = "결산/재무제표"'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
		//전체 게시물의 숫자
		totalPageCount = data[0].cnt

		//현재 페이지
		var curPage = req.params.cur;

		console.log("현재 페이지 : " + curPage, "전체 게시글 : " + totalPageCount);

		//전체 페이지 갯수
		if (totalPageCount < 0) {
		totalPageCount = 0
		}

		var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
		var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
		var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
		var startPage = ((curSet - 1) * page_list_size) + 1 //현재 세트내 출력될 시작 페이지
		var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


		//현재페이지가 0 보다 작으면
		if (curPage < 0) {
		no = 0
		} else {
		//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
		no = (curPage - 1) * page_size
		}

		console.log(no+'[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

		var result2 = {
		"curPage": curPage,
		"page_list_size": page_list_size,
		"page_size": page_size,
		"totalPage": totalPage,
		"totalSet": totalSet,
		"curSet": curSet,
		"startPage": startPage,
		"endPage": endPage,
		"no":no,
		"totalPageCount" : totalPageCount
		};

        var sql ="SELECT URL,Category, Title,BRDNO" +
                   " FROM QnA WHERE Category = '결산/재무제표'";
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
           //console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/list', {rows: rows?rows:{}, pasing : result2, num : 1, menu : 4});
            connection.release();
        });
    });
});
});

router.get('/list-5/:cur',function(req,res,next){						// 원천징수/급여관리 페이지
	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;
    pool.getConnection(function (err, connection) {
		var queryString = 'select count(*) as cnt from QnA where Category = "원천징수/급여관리"'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
		//전체 게시물의 숫자
		totalPageCount = data[0].cnt

		//현재 페이지
		var curPage = req.params.cur;

		console.log("현재 페이지 : " + curPage, "전체 게시글 : " + totalPageCount);

		//전체 페이지 갯수
		if (totalPageCount < 0) {
		totalPageCount = 0
		}

		var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
		var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
		var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
		var startPage = ((curSet - 1) * page_list_size) + 1 //현재 세트내 출력될 시작 페이지
		var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


		//현재페이지가 0 보다 작으면
		if (curPage < 0) {
		no = 0
		} else {
		//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
		no = (curPage - 1) * page_size
		}

		console.log(no+'[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

		var result2 = {
		"curPage": curPage,
		"page_list_size": page_list_size,
		"page_size": page_size,
		"totalPage": totalPage,
		"totalSet": totalSet,
		"curSet": curSet,
		"startPage": startPage,
		"endPage": endPage,
		"no":no,
		"totalPageCount" : totalPageCount
		};

        var sql ="SELECT URL,Category, Title,BRDNO" +
                   " FROM QnA WHERE Category = '원천징수/급여관리'";
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
           //console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/list', {rows: rows?rows:{}, pasing : result2, num : 1, menu : 5});
            connection.release();
        });
    });
});
});

router.get('/list-6/:cur',function(req,res,next){						// 연말정산 페이지
	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;
    pool.getConnection(function (err, connection) {
		var queryString = 'select count(*) as cnt from QnA where Category = "연말정산"'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
		//전체 게시물의 숫자
		totalPageCount = data[0].cnt

		//현재 페이지
		var curPage = req.params.cur;

		console.log("현재 페이지 : " + curPage, "전체 게시글 : " + totalPageCount);

		//전체 페이지 갯수
		if (totalPageCount < 0) {
		totalPageCount = 0
		}

		var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
		var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
		var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
		var startPage = ((curSet - 1) * page_list_size) + 1 //현재 세트내 출력될 시작 페이지
		var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


		//현재페이지가 0 보다 작으면
		if (curPage < 0) {
		no = 0
		} else {
		//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
		no = (curPage - 1) * page_size
		}

		console.log(no+'[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

		var result2 = {
		"curPage": curPage,
		"page_list_size": page_list_size,
		"page_size": page_size,
		"totalPage": totalPage,
		"totalSet": totalSet,
		"curSet": curSet,
		"startPage": startPage,
		"endPage": endPage,
		"no":no,
		"totalPageCount" : totalPageCount
		};

        var sql ="SELECT URL,Category, Title,BRDNO" +
                   " FROM QnA WHERE Category = '연말정산'";
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
           //console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/list', {rows: rows?rows:{}, pasing : result2, num : 1, menu : 6});
            connection.release();
        });
    });
});
});

router.get('/list-7/:cur',function(req,res,next){						// 법인조정 페이지
	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;
    pool.getConnection(function (err, connection) {
		var queryString = 'select count(*) as cnt from QnA where Category = "법인조정"'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
		//전체 게시물의 숫자
		totalPageCount = data[0].cnt

		//현재 페이지
		var curPage = req.params.cur;

		console.log("현재 페이지 : " + curPage, "전체 게시글 : " + totalPageCount);

		//전체 페이지 갯수
		if (totalPageCount < 0) {
		totalPageCount = 0
		}

		var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
		var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
		var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
		var startPage = ((curSet - 1) * page_list_size) + 1 //현재 세트내 출력될 시작 페이지
		var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


		//현재페이지가 0 보다 작으면
		if (curPage < 0) {
		no = 0
		} else {
		//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
		no = (curPage - 1) * page_size
		}

		console.log(no+'[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

		var result2 = {
		"curPage": curPage,
		"page_list_size": page_list_size,
		"page_size": page_size,
		"totalPage": totalPage,
		"totalSet": totalSet,
		"curSet": curSet,
		"startPage": startPage,
		"endPage": endPage,
		"no":no,
		"totalPageCount" : totalPageCount
		};

        var sql ="SELECT URL,Category, Title,BRDNO" +
                   " FROM QnA WHERE Category = '법인조정'";
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
           //console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/list', {rows: rows?rows:{}, pasing : result2, num : 1, menu : 7});
            connection.release();
        });
    });
});
});

router.get('/list-8/:cur',function(req,res,next){						// 개인조정 페이지
	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;
    pool.getConnection(function (err, connection) {
		var queryString = 'select count(*) as cnt from QnA where Category = "개인조정"'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
		//전체 게시물의 숫자
		totalPageCount = data[0].cnt

		//현재 페이지
		var curPage = req.params.cur;

		console.log("현재 페이지 : " + curPage, "전체 게시글 : " + totalPageCount);

		//전체 페이지 갯수
		if (totalPageCount < 0) {
		totalPageCount = 0
		}

		var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
		var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
		var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
		var startPage = ((curSet - 1) * page_list_size) + 1 //현재 세트내 출력될 시작 페이지
		var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


		//현재페이지가 0 보다 작으면
		if (curPage < 0) {
		no = 0
		} else {
		//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
		no = (curPage - 1) * page_size
		}

		console.log(no+'[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

		var result2 = {
		"curPage": curPage,
		"page_list_size": page_list_size,
		"page_size": page_size,
		"totalPage": totalPage,
		"totalSet": totalSet,
		"curSet": curSet,
		"startPage": startPage,
		"endPage": endPage,
		"no":no,
		"totalPageCount" : totalPageCount
		};

        var sql ="SELECT URL,Category, Title,BRDNO" +
                   " FROM QnA WHERE Category = '개인조정'";
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
           //console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/list', {rows: rows?rows:{}, pasing : result2, num : 1, menu : 8});
            connection.release();
        });
    });
});
});

router.get('/list-9/:cur',function(req,res,next){						// 물류관리 페이지
	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;
    pool.getConnection(function (err, connection) {
		var queryString = 'select count(*) as cnt from QnA where Category = "물류관리"'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
		//전체 게시물의 숫자
		totalPageCount = data[0].cnt

		//현재 페이지
		var curPage = req.params.cur;

		console.log("현재 페이지 : " + curPage, "전체 게시글 : " + totalPageCount);

		//전체 페이지 갯수
		if (totalPageCount < 0) {
		totalPageCount = 0
		}

		var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
		var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
		var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
		var startPage = ((curSet - 1) * page_list_size) + 1 //현재 세트내 출력될 시작 페이지
		var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


		//현재페이지가 0 보다 작으면
		if (curPage < 0) {
		no = 0
		} else {
		//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
		no = (curPage - 1) * page_size
		}

		console.log(no+'[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

		var result2 = {
		"curPage": curPage,
		"page_list_size": page_list_size,
		"page_size": page_size,
		"totalPage": totalPage,
		"totalSet": totalSet,
		"curSet": curSet,
		"startPage": startPage,
		"endPage": endPage,
		"no":no,
		"totalPageCount" : totalPageCount
		};

        var sql ="SELECT URL,Category, Title,BRDNO" +
                   " FROM QnA WHERE Category = '물류관리'";
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
           //console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/list', {rows: rows?rows:{}, pasing : result2, num : 1, menu : 9});
            connection.release();
        });
    });
});
});

router.get('/list-10/:cur',function(req,res,next){						// 마감후이월 페이지
	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;
    pool.getConnection(function (err, connection) {
		var queryString = 'select count(*) as cnt from QnA where Category = "마감후이월"'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
		//전체 게시물의 숫자
		totalPageCount = data[0].cnt

		//현재 페이지
		var curPage = req.params.cur;

		console.log("현재 페이지 : " + curPage, "전체 게시글 : " + totalPageCount);

		//전체 페이지 갯수
		if (totalPageCount < 0) {
		totalPageCount = 0
		}

		var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
		var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
		var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
		var startPage = ((curSet - 1) * page_list_size) + 1 //현재 세트내 출력될 시작 페이지
		var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


		//현재페이지가 0 보다 작으면
		if (curPage < 0) {
		no = 0
		} else {
		//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
		no = (curPage - 1) * page_size
		}

		console.log(no+'[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

		var result2 = {
		"curPage": curPage,
		"page_list_size": page_list_size,
		"page_size": page_size,
		"totalPage": totalPage,
		"totalSet": totalSet,
		"curSet": curSet,
		"startPage": startPage,
		"endPage": endPage,
		"no":no,
		"totalPageCount" : totalPageCount
		};

        var sql ="SELECT URL,Category, Title,BRDNO" +
                   " FROM QnA WHERE Category = '마감후이월'";
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
           //console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/list', {rows: rows?rows:{}, pasing : result2, num : 1, menu : 10});
            connection.release();
        });
    });
});
});

router.get('/list-11/:cur',function(req,res,next){						// 시스템 페이지
	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;
    pool.getConnection(function (err, connection) {
		var queryString = 'select count(*) as cnt from QnA where Category = "시스템"'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
		//전체 게시물의 숫자
		totalPageCount = data[0].cnt

		//현재 페이지
		var curPage = req.params.cur;

		console.log("현재 페이지 : " + curPage, "전체 게시글 : " + totalPageCount);

		//전체 페이지 갯수
		if (totalPageCount < 0) {
		totalPageCount = 0
		}

		var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
		var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
		var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
		var startPage = ((curSet - 1) * page_list_size) + 1 //현재 세트내 출력될 시작 페이지
		var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


		//현재페이지가 0 보다 작으면
		if (curPage < 0) {
		no = 0
		} else {
		//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
		no = (curPage - 1) * page_size
		}

		console.log(no+'[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

		var result2 = {
		"curPage": curPage,
		"page_list_size": page_list_size,
		"page_size": page_size,
		"totalPage": totalPage,
		"totalSet": totalSet,
		"curSet": curSet,
		"startPage": startPage,
		"endPage": endPage,
		"no":no,
		"totalPageCount" : totalPageCount
		};

        var sql ="SELECT URL,Category, Title,BRDNO" +
                   " FROM QnA WHERE Category = '시스템'";
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
           //console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/list', {rows: rows?rows:{}, pasing : result2, num : 1, menu : 11});
            connection.release();
        });
    });
});
});

router.get('/list-12/:cur',function(req,res,next){						// 퇴직/사업/기타/보험 페이지
	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;
    pool.getConnection(function (err, connection) {
		var queryString = 'select count(*) as cnt from QnA where Category = "퇴직/사업/기타/보험"'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
		//전체 게시물의 숫자
		totalPageCount = data[0].cnt

		//현재 페이지
		var curPage = req.params.cur;

		console.log("현재 페이지 : " + curPage, "전체 게시글 : " + totalPageCount);

		//전체 페이지 갯수
		if (totalPageCount < 0) {
		totalPageCount = 0
		}

		var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
		var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
		var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
		var startPage = ((curSet - 1) * page_list_size) + 1 //현재 세트내 출력될 시작 페이지
		var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


		//현재페이지가 0 보다 작으면
		if (curPage < 0) {
		no = 0
		} else {
		//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
		no = (curPage - 1) * page_size
		}

		console.log(no+'[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

		var result2 = {
		"curPage": curPage,
		"page_list_size": page_list_size,
		"page_size": page_size,
		"totalPage": totalPage,
		"totalSet": totalSet,
		"curSet": curSet,
		"startPage": startPage,
		"endPage": endPage,
		"no":no,
		"totalPageCount" : totalPageCount
		};

        var sql ="SELECT URL,Category, Title,BRDNO" +
                   " FROM QnA WHERE Category = '퇴직/사업/기타/보험'";
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
           //console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/list', {rows: rows?rows:{}, pasing : result2, num : 1, menu : 12});
            connection.release();
        });
    });
});
});

router.get('/list-13/:cur',function(req,res,next){						// 미분류 페이지
	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;
    pool.getConnection(function (err, connection) {
		var queryString = 'select count(*) as cnt from QnA where Category = "미분류"'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
		//전체 게시물의 숫자
		totalPageCount = data[0].cnt

		//현재 페이지
		var curPage = req.params.cur;

		console.log("현재 페이지 : " + curPage, "전체 게시글 : " + totalPageCount);

		//전체 페이지 갯수
		if (totalPageCount < 0) {
		totalPageCount = 0
		}

		var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
		var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
		var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
		var startPage = ((curSet - 1) * page_list_size) + 1 //현재 세트내 출력될 시작 페이지
		var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


		//현재페이지가 0 보다 작으면
		if (curPage < 0) {
		no = 0
		} else {
		//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
		no = (curPage - 1) * page_size
		}

		console.log(no+'[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

		var result2 = {
		"curPage": curPage,
		"page_list_size": page_list_size,
		"page_size": page_size,
		"totalPage": totalPage,
		"totalSet": totalSet,
		"curSet": curSet,
		"startPage": startPage,
		"endPage": endPage,
		"no":no,
		"totalPageCount" : totalPageCount
		};

        var sql ="SELECT URL,Category, Title,BRDNO" +
                   " FROM QnA WHERE Category = '미분류'";
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
           //console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/list', {rows: rows?rows:{}, pasing : result2, num : 1, menu : 13});
            connection.release();
        });
    });
});
});


router.get('/list2/:cur',function(req,res,next){
	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;
    pool.getConnection(function (err, connection) {
		var queryString = 'select count(*) as cnt from NoAnswer'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
		//전체 게시물의 숫자
		totalPageCount = data[0].cnt

		//현재 페이지
		var curPage = req.params.cur;

		console.log("현재 페이지 : " + curPage, "전체 게시글 : " + totalPageCount);

		//전체 페이지 갯수
		if (totalPageCount < 0) {
		totalPageCount = 0
		}

		var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
		var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
		var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
		var startPage = ((curSet - 1) * page_list_size) + 1 //현재 세트내 출력될 시작 페이지
		var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


		//현재페이지가 0 보다 작으면
		if (curPage < 0) {
		no = 0
		} else {
		//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
		no = (curPage - 1) * page_size
		}

		console.log(no+'[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

		var result2 = {
		"curPage": curPage,
		"page_list_size": page_list_size,
		"page_size": page_size,
		"totalPage": totalPage,
		"totalSet": totalSet,
		"curSet": curSet,
		"startPage": startPage,
		"endPage": endPage,
		"no":no,
		"totalPageCount" : totalPageCount
		};

        var sql ="SELECT BRDNO, Category, Title, Q_raw,Q_noun" +
                   " FROM NoAnswer" ;
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
            //console.log("rows : " + JSON.stringify(rows));
            res.render('board1/list', {rows: rows?rows:{}, pasing : result2 , num : 2,menu : 0});
            connection.release();
        });
    });
});
});

router.get('/log_list',function(req,res,next){							//log_list
	var page_size = 20;
	var page_list_size = 5;
	var no = "";
	var totalPageCount = 0;

    pool.getConnection(function (err, connection) {
		var queryString = 'select count(DISTINCT Poster) as cnt from Chat'
		getConnection().query(queryString, function (error2, data) {
			if (error2) {
			console.log(error2 + "메인 화면 mysql 조회 실패");
			return
		}
        var sql ="SELECT DISTINCT Poster" +
                   " FROM Chat";
		var sql2 = "SELECT Poster,Q_raw,Answer,DATE_FORMAT(Date,'%Y-%m-%d') Date,DATE_FORMAT(Date,'%r') Date2"+
					" FROM Chat" + " WHERE Poster='" + req.query.Poster+"'";
					
		connection.query(sql2,function(err2,rows2){
			connection.query(sql,function (err, rows) {
				if (err) console.error("err : " + err);
				if (err2) console.error("err2 : " + err2);
				if(req.query.Poster == undefined){
					res.render('board1/log_read', {rows: rows?rows:{}, rows2:{}});
				}else{
				res.render('board1/log_read', {rows: rows?rows:{}, rows2: rows2?rows2:{}});
				}
				connection.release();
			});
		});
	});
});
});

let user = {      //회원 정보
  user_id: "admin",
  user_pwd: "admin"
};

router.get('/login', (req, res) => {      // 1
  if(req.session.logined) {
    res.redirect('/board1/list-0/1');
  } else {
    res.render('board1/login');
  }
});

router.get('/facebook.html', (req, res) => {      // 1
    res.render('board1/facebook.html');
});

router.post('/login', (req, res) => {      // 2
  if(req.body.id == user.user_id && req.body.pwd == user.user_pwd){
    req.session.logined = true;
    req.session.user_id = req.body.id;
	req.session.save(function(){
		res.redirect('/board1/list-0/1');
	});
    } else {
      res.redirect('alert');
  }
});
 
router.get('/alert',function(req,res,next){
	res.render('board1/alert');
});

router.post('/logout', (req, res) => {      // 3
  req.session.destroy();
  res.redirect('/');
});

router.get('/read',function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql ="SELECT Category, Title, Q_raw, Answer,BRDNO"+
                   " FROM QnA" +
                  " WHERE BRDNO=" + req.query.brdno;
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
 
            res.render('board1/read', {row: rows[0],num : 1});
            connection.release();
        });
    });
});

router.get('/read1',function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql ="SELECT Category, Title, Q_raw,BRDNO"+
                   " FROM NoAnswer" + 
                  " WHERE BRDNO=" + req.query.brdno;
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
 
            res.render('board1/read', {row: rows[0], num : 2});
            connection.release();
        });
    });
});

router.get('/form',function(req,res,next){
	var Cate = ['전표/장부관리','자동전표처리','부가가치세','결산/재무제표','원천징수/급여관리','연말정산','법인조정','개인조정','물류관리','마감후이월','시스템','퇴직/사업/기타/보험','미분류']
  
    if (!req.query.brdno) {
		res.render('board1/form', {row:"",num:1,category:Cate});
        return;
    }
	 pool.getConnection(function (err, connection) {
        var sql ="SELECT Category,Title,Q_raw,Answer,BRDNO" +
                   " FROM QnA" +
                  " WHERE BRDNO=" + req.query.brdno;
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
 
            res.render('board1/form', {row: rows[0], num : 1, category:Cate});
            connection.release();
        });
    });
});

router.get('/form1',function(req,res,next){
	var Cate = ['전표/장부관리','자동전표처리','부가가치세','결산/재무제표','원천징수/급여관리','연말정산','법인조정','개인조정','물류관리','마감후이월','시스템','퇴직/사업/기타/보험','미분류']
  
    if (!req.query.brdno) {
        res.render('board1/form', {row:"",num : 2,category:Cate});
        return;
    }
    pool.getConnection(function (err, connection) {
        var sql ="SELECT Category, Title,Q_raw,BRDNO "+
                   " FROM NoAnswer" +
                  " WHERE BRDNO=" + req.query.brdno;
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
 
            res.render('board1/form', {row: rows[0], num : 2,category:Cate});
            connection.release();
        });
    });
});
 
router.post('/save',function(req,res,next){
	var Q_noun = "";
	mecab.parse(req.body.q_raw, function(items) {
		for (var i in items) {
			var k = items[i];
			if (k == "EOS") continue;
			if(k[1]=="NNG" || k[1]=="NNP")
				Q_noun=Q_noun+k[0]+" "
		}
	});
	var data = [req.body.category, req.body.title, req.body.q_raw,Q_noun,req.body.answer, req.body.brdno];
    pool.getConnection(function (err, connection) {
        var sql ="";
        if (req.body.brdno) {
            sql ="UPDATE QnA" +
                       " SET Category=?, Title=?, Q_raw=?, Q_noun =?, Answer=?" +
                  " WHERE BRDNO=?";
        }else {
            sql ="INSERT INTO QnA(Category, Title, Q_raw,Q_noun, answer) VALUES(?,?,?,?,?)";
        }
        connection.query(sql, data,function (err, rows) {
            if (err) console.error("err : " + err);
 
            res.redirect('/board1/');
            connection.release();
        });
    });
});

router.post('/save1',function(req,res,next){
	var Q_noun = "";
	mecab.parse(req.body.q_raw, function(items) {
		for (var i in items) {
			var k = items[i];
			if (k == "EOS") continue;
			if(k[1]=="NNG" || k[1]=="NNP")
				Q_noun=Q_noun+k[0]+" "
		}
	});
    var data = [req.body.category, req.body.title, req.body.q_raw, Q_noun, req.body.answer, req.body.brdno];
    pool.getConnection(function (err, connection) {
        var sql ="";
        sql ="INSERT INTO QnA(Category, Title, Q_raw,Q_noun, answer) VALUES(?,?,?,?,?)";
		
		var sql2 ="DELETE FROM NoAnswer" +
                  " WHERE BRDNO=" + req.body.brdno;
        connection.query(sql, data,function (err, rows) {
			connection.query(sql2, data,function (err, rows) {
				if (err) console.error("err : " + err);
	 
				res.redirect('/board1/list2/1');
				connection.release();
			});
		});
    });
});
 
router.get('/delete',function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql ="DELETE FROM QnA" +
                  " WHERE BRDNO=" + req.query.brdno;
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
 
            res.redirect('/board1/');
            connection.release();
        });
    });
});

router.get('/delete1',function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql ="DELETE FROM NoAnswer" +
                  " WHERE BRDNO=" + req.query.brdno;
        connection.query(sql,function (err, rows) {
            if (err) console.error("err : " + err);
 
            res.redirect('/board1/list2');
            connection.release();
        });
    });
});

router.get('/imgs',function(req,res){

	fs.readFile('image.png' ,function(error, data){
		res.writeHead(200,{'Content-Type' : 'image/png'});
		res.write(data);
		res.end();
	});
});
 
 
module.exports = router;

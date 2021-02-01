'use strict';
const PAGE_ACCESS_TOKEN = process.env.ACCESSTOKEN;
const ps = require('python-shell');
var Mecab = require('/home/ec2-user/mecab-mod.js');
var mecab = new Mecab();
var tmpquery = "";
var fs = require('fs');
var options = {
	mode: 'text',
	pythonPath: '/usr/bin/python3.6',
	pythonOpthons: ['-u'],
	scriptPath: '',
	args: [],
};
const option = {
   key: fs.readFileSync('/etc/letsencrypt/live/nain95.tk/privkey.pem'),
   cert: fs.readFileSync('/etc/letsencrypt/live/nain95.tk/cert.pem'),
   agent: false
};

// Imports dependencies and set up http server
const
	qs = require('querystring'),
    https = require('https'),
    request = require('request'),
    express = require('express'),
	morgan = require('morgan'),
	mysql = require('mysql'),
	router = express.Router(),
	path = require('path'),
    body_parser = require('body-parser'),
    app = express().use(body_parser.json()); // creates express http server

	
var pool = mysql.createPool({
    connectionLimit: 5,
    host     :'localhost',
    user     :'root',
    password :'dlsduqdl',
    database :'capstone'   
}); 
//var mysqlRouter = require('./routes/mysql');
	
// Sets server port and logs message on success
app.listen(3000, () => console.log('webhook is listening'));
https.createServer(option,app).listen(443);
//http.createServer(option,app).listen(80);
//router.get('/', function(req, res) { res.render(mysqlRouter); });
app.use('/node_modules',express.static(path.join(__dirname,'/node_modules')));
app.use('/board1', require('./routes/board1'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, './public')));
app.get('/',function(req, res, next) {
   res.redirect('/board1/');
});
// Accepts POST requests at /webhook endpoint

app.post('/webhook', (req, res) => {

    // Parse the request body from the POST
    let body = req.body;
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log("=======================================");
			console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            /*if (webhook_event.message) {
              handleMessage(sender_psid, webhook_event.message);
            } */
            if (webhook_event.postback) {
                if (webhook_event.postback.payload == '시작하기') {
					callAPI(sender_psid,"typing_on");
                    greeting(sender_psid);
					
                } else {
                    handlePostback(sender_psid, webhook_event.postback);
                }
            } else if (webhook_event.message) {
				callAPI(sender_psid,"typing_on");
                message_handlePostback(sender_psid, webhook_event.message);
			}
        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});

 

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
    console.log(req.query['hub.verify_token'])
    if (req.query['hub.verify_token'] === 'chat'){
        //return res.send(req.query['hub.challenge'])
		res.status(200).send(req.query['hub.challenge']);
    }
});



// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let title = received_postback.title;
    let payload = received_postback.payload;
	//let message_payload = received_postback.quick_reply.payload;
	
    if (payload === "callnum"){
		call(sender_psid);
	}
	else if (payload === "BACK_PAYLOAD"){
		menu(sender_psid)
	}
	else if (payload === "QNA_PAYLOAD"){
		var Q_noun = "";
					mecab.parse(tmpquery, function(items) {
						for (var i in items) {
							var k = items[i];
							if (k == "EOS") continue;
							if(k[1]=="NNG" || k[1]=="NNP")
								Q_noun=Q_noun+k[0]+" "
						}
					});
		var data2=['미분류',tmpquery,tmpquery,Q_noun];
		pool.getConnection(function (err, connection) {
		var sql2 = "insert into NoAnswer(Category,Title,Q_raw,Q_noun) values(?,?,?,?)";
					connection.query(sql2, data2,function (err, rows) {
						if (err) console.error("err : " + err);
						connection.release();
					});
		});
		response = {
				"text": "정상적으로 등록되었습니다."
        }
		callSendAPI(sender_psid, response);
		setTimeout(function() {
            menu(sender_psid);
		},1000);
	}
};
	var last = "";
	var first = "";
	var Poster = "";
	var Answer = "";
	var Q_raw = "";
function message_handlePostback(sender_psid, received_postback) {
    let response;
	let check = 0;
	let quick_reply;
	last = "";
	first = "";
	Poster = "";
	Answer = "";
	Q_raw = "";
    // Get the payload for the postback
    let text = received_postback.text;
	for (var i in received_postback){
		console.log("------"+i);
		if (i === "quick_reply"){
			check = 1;
			quick_reply = received_postback.quick_reply.payload;
		}
	}
	var temp_text;
	if (check === 1){
		if ( quick_reply === "1"){
			temp_text = "전표/장부관리"
		}
		else if ( quick_reply === "2"){
			temp_text = "자동전표처리"
		}
		else if ( quick_reply === "3"){
			temp_text = "부가가치세"
		}
		else if ( quick_reply === "4"){
			temp_text = "결산/재무재표"
		}
		else if ( quick_reply === "5"){
			temp_text = "원천징수/급여관리"
		}
		else if ( quick_reply === "6"){
			temp_text = "연말정산"
		}
		else if ( quick_reply === "7"){
			temp_text = "법인조정"
		}
		else if ( quick_reply === "8"){
			temp_text = "개인조정"
		}
		else if ( quick_reply === "9"){
			temp_text = "마감	후이월"
		}
		else if ( quick_reply === "10"){
			temp_text = "시스템"
		}
		
		
		response = {
			"text":temp_text+"를 선택하셨습니다.\n문의하실 질문의 키워드를 입력해주세요."
		}
        callSendAPI(sender_psid, response);
       
	
	}
	else{
		request({
        "url": "https://graph.facebook.com/"+sender_psid+"?access_token="+PAGE_ACCESS_TOKEN,
        "method": "GET"
		}, (err, res, body) => {
        if (!err) {
			var abc =JSON.parse(body);
			first = abc.first_name;
			last = abc.last_name;
        } else {
			console.log("err!!!")
        }
		});
		var testdata
		setTimeout(function() {
		}, 3200);
		tmpquery = text;
		Q_raw = text;
		options.args = options.args + text;
		ps.PythonShell.run('tf_idf_db.py', options, function (err, results) {
		  if (err) throw err;
		  console.log(results)
		  if (results[0] === "일치하는 질문을 찾지못했습니다."){
			//fs.appendFileSync('admin_data.txt',"<질의 내용> " + tmpquery +"\n",'utf8');
			testdata = results;
			Answer = results;
			options.args = "";
			response = {
			"text": testdata[0] +"\nQnA에 등록하였습니다."
			}
			setTimeout(function() {
			menu(sender_psid);
			},4500)
			
			setTimeout(function() {
            callSendAPI(sender_psid, response);
			}, 3200);
			
			setTimeout(function() {
				Poster = last+first;
				pool.getConnection(function (err, connection) {
				var data=[Poster,Q_raw,Answer];
				var sql ="INSERT INTO Chat(Poster, Q_raw, Answer) VALUES(?,?,?)";
				var Q_noun = "";
					mecab.parse(Q_raw, function(items) {
						for (var i in items) {
							var k = items[i];
							if (k == "EOS") continue;
							if(k[1]=="NNG" || k[1]=="NNP")
								Q_noun=Q_noun+k[0]+" "
						}
					});
					var data2=['미분류',Q_raw,Q_raw,Q_noun];
					var sql2 = "insert into NoAnswer(Category,Title,Q_raw,Q_noun) values(?,?,?,?)";
					connection.query(sql2, data2,function (err, rows) {
						connection.query(sql, data,function (err, rows) {
						if (err) console.error("err : " + err);
						connection.release();
						});
					});
				});
			  }, 2500);
		  }
		  else{
			Answer = results;
			testdata = results;
			options.args = "";
			response = {
			"text": testdata[0]
			}
			setTimeout(function() {
				callSendAPI(sender_psid, response);
			}, 3200);
			setTimeout(function() {
				back2fst(sender_psid);
			},4000);
			setTimeout(function() {
				Poster = last+first;
				pool.getConnection(function (err, connection) {
				var data=[Poster,Q_raw,Answer];
				var sql ="INSERT INTO Chat(Poster, Q_raw, Answer) VALUES(?,?,?)";
				connection.query(sql, data,function (err, rows) {
					if (err) console.error("err : " + err);
					connection.release();
				});
			});
		  }, 2500);
		  }
		});
		
	}

};

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
		//"messaging_type": "RESPONSE",
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {
            "access_token": PAGE_ACCESS_TOKEN
        },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

function callAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
		//"messaging_type": "RESPONSE",
        "sender_action": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {
            "access_token": PAGE_ACCESS_TOKEN
        },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
			console.log("success")
        } else {
			console.log("err!!!")
        }
    });
}

function greeting(sender_psid) {
    let response = {
        "text": "안녕하세요 더존입니다!!"
    }
    callSendAPI(sender_psid, response);
    setTimeout(function() {
        menu(sender_psid)
    }, 1000);
}

function menu(sender_psid) {
  let menu = {
	"text": "원하시는 메뉴를 선택해주세요.",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"1. 전표/장부관리",
        "payload":"1"
      },{
        "content_type":"text",
        "title":"2. 자동전표처리",
        "payload":"2"
      },
	  {
        "content_type":"text",
        "title":"3. 부가가치세",
        "payload":"3"
      },
	  {
        "content_type":"text",
        "title":"4. 결산/재무재표",
        "payload":"4"
      },
	  {
        "content_type":"text",
        "title":"5. 원천징수/급여관리",
        "payload":"5"
      },
	  {
        "content_type":"text",
        "title":"6. 연말정산",
        "payload":"6"
      },
	  {
        "content_type":"text",
        "title":"7. 법인조정",
        "payload":"7"
      },
	  {
        "content_type":"text",
        "title":"8. 개인조정",
        "payload":"8"
      },
	  {
        "content_type":"text",
        "title":"9. 마감 후 이월",
        "payload":"9"
      },
	  {
        "content_type":"text",
        "title":"10. 시스템",
        "payload":"10"
      }
	  
    ]
  } 
  
  callSendAPI(sender_psid, menu);
}


function back2fst(sender_psid) {
    let menu = {
        "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"원하시는 답변과 다르다면 등록버튼을 눌러주세요.",
        "buttons":[
          {
            "type":"postback",
            "payload":"QNA_PAYLOAD",
            "title":"Q&A 등록 하기"
          },{
			"type":"postback",
            "payload":"BACK_PAYLOAD",
            "title":"돌아가기"
		  }
 
                    ]
                }
            }
        }
    callSendAPI(sender_psid, menu);
}

function call(sender_psid) {
	let response = {
		"attachment":{
		  "type":"template",
		  "payload":{
			"template_type":"button",
			"text":" 전화번호는 01020549956 입니다.",
			"buttons":[{
				"type":"phone_number",
				"title":"전화걸기",
				"payload":"+821020549956"
				},{
			"type":"postback",
            "payload":"BACK_PAYLOAD",
            "title":"돌아가기"
		  }]
			}
		}
	 }
	callSendAPI(sender_psid, response)
}

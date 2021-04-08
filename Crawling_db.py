from urllib.request import urljoin
from urllib.request import urlopen
from bs4 import BeautifulSoup
from multiprocessing import Pool
from konlpy.tag import Mecab
import time
import pymysql
import ssl

last_page = 0
url = "https://help.douzone.com/pboard/index.jsp?code=qna10&pid=10&type=all&page="
start_time = time.time()

context = ssl._create_unverified_context()
#html = urlopen(url)
#bsObject = BeautifulSoup(html,"html.parser")
db = pymysql.connect(host = 'localhost', user='root', passwd='dlsduqdl', db='chatbot')
cursor = db.cursor()

#for link in bsObject.find_all('a',{'class':'on'}):				
#	if (link.select('div')[0].get('class')) == ['page_last_btn']:
#		temp = link.get('href')
#		last_page = int((temp[-4:]))
last_page = 1976
def crawling(i):
	html = urlopen(url+str(i),context=context)
	bsObject = BeautifulSoup(html,"html.parser")
	for link in bsObject.find_all('td',{'class':'ta_l'}):	#한 페이지에 있는 목록 접근
		test = link.select('a')[0].get('href')
		print(str(i)+"번째 페이지 수행중"+test)
		crawling_url = urljoin(url,test)	# 컨텐츠 url
		html = urlopen(crawling_url,context=context)
		bsObject = BeautifulSoup(html,"html.parser")	# 해당 url에서 긁어온 html 코드
		ifAnswer = bsObject.find_all('span',{'class':'ans_y'})	# 코드에서 span 태그 중 class = 'ans_y' 가져오기
		category = bsObject.find_all('dd')
		title = bsObject.find_all('td',{'class':'ta_l'})
		answer_temp = bsObject.find_all('div',{'class':'a'})
		if answer_temp == []:
			continue
		answer = ""
		for data in answer_temp[0].find_all('p'):	#답변 내용 answer에 저장
			if data.text != None:
				answer += data.text.replace("<br>"," ")
		question = ""
		noun_q = ""
		question_temp = bsObject.find('div',{'class':'q_cnt'})
		a = question_temp.find('p')				#질문 내용 question에 저장
		m = Mecab('/tmp/mecab-ko-dic-2.1.1-20180720')
		if a!= []:
			data = a.text.replace("\n"," ")
			question = data
			tag = m.pos(data)
			for tuple in tag: # 명사 추출
				if tuple[1] == 'NNG' or tuple[1] == 'NNP':
					noun_q = noun_q + tuple[0] + " "
		if ifAnswer[0].text == '답변완료':
                    query = 'insert into QnA(URL, Category, Title, Q_raw, Q_noun, Answer) values(%s, %s, %s, %s, %s, %s);'
                    try:
                        cursor.execute(query, (crawling_url, category[0].text, title[0].text, question, noun_q, answer))
                    except:
                        pass
#pool = Pool(processes=8)
#pool.map(crawling,range(501,579))
for i in range(500,1000):
    crawling(i)
    db.commit()
db.close()

print("--- %s seconds ---" % (time.time() - start_time))
	

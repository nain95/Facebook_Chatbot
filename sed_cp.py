import pymysql
import os

password = os.environ['DB_PWD']
db = pymysql.connect(host = 'localhost', user='root', passwd=password, db='chatbot', charset='utf8')
cursor = db.cursor()

query = 'select Q_noun, BRDNO from QnA;'
cursor.execute(query)
result = cursor.fetchall()

for row in result:
	if row[0] != '':
		print('<Answer> ' + str(row[1]) + ' '+row[0])
		print()
db.close()

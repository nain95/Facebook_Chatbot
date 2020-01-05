import math
import re
import sys
import logging
import pymysql
from konlpy.tag import Mecab

logging.basicConfig(filename = './tete.log',level=logging.DEBUG)
db = pymysql.connect(host = 'localhost', user='root', passwd='dlsduqdl', db='capstone')
cursor = db.cursor()

class TF_IDF:
		def __init__(self, post_list_path):
				self.param = {"idf_N":0, "icf_N":0,}
				
				def file_to_dict(file_path):
						temp_post_list = {} # term->{'docs':{doc_name:term_freq}, 'doc_freq':int}
						col_N = 0
						doc_N = 0
						with open(file_path) as f:
									for line in f:
										w2d = line.replace("\n", "").strip().split(":")
										term, docs = w2d[0].strip().split(), w2d[1].strip().split()
										col_freq = int(term[1].replace("[", "").replace("]", ""))
										col_N += col_freq
										temp_post_list[term[0]] = {"col_freq":col_freq, "docs":{}}
										for doc in docs:
												fnp = doc.split("#")
												f_path, term_freq = fnp[0], int(fnp[1])
												temp_post_list[term[0]]["docs"][f_path] = term_freq
										doc_freq = len(temp_post_list[term[0]]["docs"].items())
										temp_post_list[term[0]]["doc_freq"] = doc_freq
										doc_N += doc_freq
						return temp_post_list, col_N, doc_N

				self.posting_list, self.param["icf_N"], self.param["idf_N"] = file_to_dict(post_list_path)

		def word_tf(self, term, doc_name):
				return 1 + math.log(self.posting_list[term]['docs'][doc_name] * 1.0)

		def word_idf(self, term):
				return math.log(self.param["idf_N"] * 1.0 / self.posting_list[term]["doc_freq"])

		def calc_sent_tfidf(self, sentence):
				query = sentence.strip().split()
				score_lst = {} # doc_id -> score_lst
				for term in query:
						if term in self.posting_list:
								for doc in self.posting_list[term]['docs']:
										if doc in score_lst:
												score_lst[doc] += self.word_tf(term, doc) * self.word_idf(term)
										else:
												score_lst[doc] = self.word_tf(term, doc) * self.word_idf(term)
				return score_lst

		def print_sorted_tfidf(self, sent):
				temp = []
				result_sentence = ""
				m = Mecab()
				sentence = ""		#들어온 query 형태소 분석후 넣을곳
				for word in sent.split():
					tag = m.pos(word)
					for tuple in tag:
						if tuple[1] == 'NNG' or tuple[1] == 'NNP':
							sentence+=tuple[0]+" "
				sc_lst = self.calc_sent_tfidf(sentence)
				sc_lst = sorted(sc_lst.items(), key=(lambda x:x[1]), reverse=True)
				if sc_lst == [] or sc_lst[0][1] < 14:
					return("일치하는 질문을 찾지못했습니다.")
				
				else:
					for doc, score in sc_lst[:1]:
						sql = 'select Answer from QnA where BRDNO=%s;'
						cursor.execute(sql, (doc))
						select_result = cursor.fetchall()
						if select_result != ():
							return select_result[0][0]

if __name__ == "__main__":
		score = TF_IDF("./awkData.txt")
		query = sys.argv[1:]
		a = score.print_sorted_tfidf(query[0])
		print(a)
		db.close()

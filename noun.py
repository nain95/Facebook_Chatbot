from konlpy.tag import Mecab
import sys

class Noun:
	def __init__(self):
		self.b = ""
	
	def printNoun(self, file):
		m = Mecab('/tmp/mecab-ko-dic-2.1.1-20180720')
		for line in file:
			line = line.replace('\n','')
			word = line.split(" ")
			if word[0] == '<Answer>':
				print(word[0] + " "+word[1] + " ", end="")
			tag = m.pos(line)
			for tuple in tag:
				if tuple[1] == 'NNG' or tuple[1] == 'NNP':
					self.b = self.b + tuple[0] + " "
			if self.b != "":
				print(self.b)
			self.b = ""
	
if __name__ == "__main__":
	p = Noun()
	if len(sys.argv) > 1:
		for f in sys.argv[1:]:
			file = open(f, 'r')
			p.printNoun(file)

# Customer Service Chatbot Using Text Similarity Analysis
## Team Members
         - 권연욱, 전인엽
 
## Purpose and Background
1. Purpose
	 - Develop a chatbot capable of efficiently responding to customer inquiries to reduce operational costs for businesses
	 - Increase customer convenience through 24/7 availability
	 - Convenient chatbot operation and management through admin page development

2. Background
	- When examining accumulated data from customer service centers, there are many cases where the same answers are repeatedly given to duplicate questions. We designed a chatbot that uses TF-IDF similarity analysis to analyze sentence similarity and responds with answers from questions with the highest approximation values.

## Description
1. Description
	- The chatbot and admin page servers use AWS EC2 instances.
	- Facebook Messenger API and Webhook functionality are used to receive user questions and send responses.
	- Data was collected by crawling Douzone Bizon's customer service web pages using Python, and to improve TF-IDF analysis accuracy, morphological analysis was performed to extract only nouns from question data for sentence similarity analysis.
	- The analyzed data is stored in a MySQL database, enabling simultaneous access from both the chatbot and admin page.

## Results
1. Chatbot Execution Screen
<div>
<img width="292" alt="챗봇실행화면1" src="https://user-images.githubusercontent.com/28583618/82534144-9c151280-9b7f-11ea-8637-b843797e9f16.png">
<img width="292" alt="챗봇실행화면2" src="https://user-images.githubusercontent.com/28583618/82534212-bb13a480-9b7f-11ea-9082-93f8c3704be9.png">
</div>
2. Chatbot Admin Page
<img width="843" alt="챗봇관리페이지" src="https://user-images.githubusercontent.com/28583618/82535244-902a5000-9b81-11ea-810b-8d56fdbc75b4.png">

## Achievements and Expected Effects
1. Achievements and Expected Effects
	- Reduced operational costs for businesses as the chatbot can respond to similar questions
 	- Expected performance improvement as the amount of analyzable data increases with growing chatbot usage
 	- Enhanced accessibility by inserting chatbots into corporate pages using chatbot support plugins

-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: truthlens
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ai_detection_details`
--

DROP TABLE IF EXISTS `ai_detection_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_detection_details` (
  `detection_id` int NOT NULL AUTO_INCREMENT,
  `scan_id` int NOT NULL,
  `ai_probability_score` float DEFAULT NULL,
  PRIMARY KEY (`detection_id`),
  KEY `scan_id` (`scan_id`),
  CONSTRAINT `ai_detection_details_ibfk_1` FOREIGN KEY (`scan_id`) REFERENCES `scan_input` (`scan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_detection_details`
--

LOCK TABLES `ai_detection_details` WRITE;
/*!40000 ALTER TABLE `ai_detection_details` DISABLE KEYS */;
INSERT INTO `ai_detection_details` VALUES (1,25,0.0588),(2,26,0.1178);
/*!40000 ALTER TABLE `ai_detection_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_history`
--

DROP TABLE IF EXISTS `chat_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_history` (
  `chat_id` int NOT NULL AUTO_INCREMENT,
  `scan_id` int DEFAULT NULL,
  `question` text NOT NULL,
  `answer` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`chat_id`),
  KEY `scan_id` (`scan_id`),
  CONSTRAINT `chat_history_ibfk_1` FOREIGN KEY (`scan_id`) REFERENCES `scan_input` (`scan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_history`
--

LOCK TABLES `chat_history` WRITE;
/*!40000 ALTER TABLE `chat_history` DISABLE KEYS */;
INSERT INTO `chat_history` VALUES (1,NULL,'Why is source credibility important?','Source credibility is essential because it helps you determine whether the information you are reading is trustworthy, accurate, and safe to rely on. \n\nHere is why source credibility matters:\n\n1. **Ensures Accuracy:** Credible sources follow strict standards—they check their facts, use reliable evidence, and correct errors when they happen. Low-credibility sources often publish unverified rumors, clickbait, or outright misinformation.\n2. **Helps You Make Informed Decisions:** The news and information you consume can influence real-life choices—like your health, voting decisions, or personal finances. Relying on inaccurate sources can lead to harmful choices.\n3. **Protects Against Bias and Manipulation:** Highly credible sources strive for fairness and transparency. Sources with low credibility often push specific agendas, hide context, or manipulate facts to influence your opinions or gain clicks.\n\n### How this applies to your current context:\nIn TruthLens, the source you are looking at received a **credibility score of 30** (out of 100). \n\nA score of 30 is considered **low**. This indicates that the source may have a history of publishing inaccurate claims, lacking proper editorial standards, or presenting heavily biased content. Because of this low rating, information from this source should be treated with caution and double-checked against more reliable outlets before accepting it as fact.','2026-09-23 16:44:05'),(2,NULL,'hey','Hello! Welcome to TruthLens. How can I help you today? \n\nIf you have a news claim, an article, or a fact-check you\'d like to understand better, feel free to share it with me!','2026-09-24 15:03:03'),(3,NULL,'why th e news ws fake','It looks like you didn\'t mention which specific news story or article you are asking about! \n\nTo help you understand why a particular piece of news was flagged as fake or misleading, please share:\n- The **headline** or a short description of the claim/news story.\n- A **link** to the article, or the **Fact-Check ID** if you are viewing one inside TruthLens.\n\nOnce you provide that detail, I will break down the evidence and explain the fact-check clearly for you!','2026-09-24 15:03:41'),(4,NULL,'what is the capital of india','The capital of India is **New Delhi**.','2026-09-24 15:04:07'),(5,NULL,'hey','Hello! I am your TruthLens assistant. How can I help you today? \n\nIf you have a question about a specific news claim, article, or fact-check, feel free to ask!','2026-09-24 18:14:28'),(6,NULL,'hey','Hello! I am your TruthLens AI assistant. \n\nHow can I help you today? If you have any questions about Fact-check ID 12, need help understanding a news story, or want to verify a claim, feel free to ask!','2026-09-24 18:21:54'),(7,NULL,'hey','Hello! Welcome to TruthLens. I\'m here to help you understand fact-checks, verify news stories, and explore reliable sources. \n\nHow can I assist you today? If you have a specific question about a claim, news article, or Fact-Check ID 13, feel free to share!','2026-09-24 18:24:52'),(8,NULL,'hey','Hello! I\'m your TruthLens AI assistant. How can I help you today? \n\nIf you have questions about Fact-check ID 14 or need help verifying news and sources, feel free to ask!','2026-09-24 18:32:10'),(9,NULL,'hi','Hello! Welcome to TruthLens. I\'m here to help you check claims, understand news stories, analyze sources, and navigate fact-checks. \n\nHow can I help you today? Feel free to share a claim, news article, or topic you\'d like to look into!','2026-09-24 18:35:44'),(10,NULL,'hi','Hello! Welcome to TruthLens. I\'m your AI assistant, here to help you navigate news, understand fact-checks, and examine sources. \n\nHow can I help you today? If you have a question about Fact-Check #16 or any other news topic, feel free to ask!','2026-09-24 18:41:24'),(11,NULL,'hi','Hello! Welcome to TruthLens. How can I assist you today? \n\nIf you have questions about a specific news claim, need help understanding Fact-Check ID 17, or want to verify a source, feel free to ask!','2026-09-24 18:56:30'),(12,NULL,'is it reliable','','2026-09-24 18:57:24'),(13,NULL,'what is the capital of india','The capital of India is **New Delhi**.','2026-09-24 18:57:43'),(14,NULL,'what is the source credibility of bbc website','','2026-09-24 18:58:08'),(15,NULL,'what is the source credibility of bbc website','','2026-09-24 19:00:30'),(16,NULL,'is the bbc website trustable','','2026-09-24 19:07:51'),(17,NULL,'say hello','Hello! I am your TruthLens AI assistant. How can I help you verify a claim, analyze a news story, or understand a fact-check today?','2026-09-24 19:24:12'),(18,NULL,'say hello','Hello! I\'m your TruthLens AI assistant. I\'m here to help you understand fact-checks, verify claims, and explore news sources. \n\nHow can I help you today? If you have questions about a specific fact-check or topic, feel free to ask!','2026-09-26 15:10:25'),(19,NULL,'is this website reliable','Hello! I am your TruthLens assistant. \n\nIt looks like the specific name or link of the website (associated with Fact-check ID: 23) wasn\'t included in your message. \n\nCould you please provide the **name or URL of the website** you are asking about? \n\nOnce you share it, I can help analyze its reliability by checking:\n* **Source Transparency & Ownership:** Who runs and funds the site.\n* **Editorial Standards:** Whether they have a clear corrections policy and editorial oversight.\n* **Factual History:** How independent fact-checkers rate their past reporting.','2026-09-26 15:10:53'),(20,NULL,'//bbc.com/','Hello! You shared the link to the homepage of the **BBC (British Broadcasting Corporation)**.\n\n### About BBC as a Source:\n* **What it is:** The BBC is the national public broadcaster of the United Kingdom and one of the largest and oldest news organizations in the world.\n* **Credibility:** It is generally considered a highly reputable mainstream news source known for rigorous journalistic standards. \n* **Fact-Checking:** While major news outlets like the BBC are generally reliable, individual articles, quotes, or claims reported within news stories can still be subject to context, updates, or fact-checking.\n\n---\n\n### How can TruthLens help you?\nBecause this link leads to the general homepage, there isn\'t a specific claim or article to evaluate yet. \n\nIf you\'d like me to help you verify something specific, please:\n1. Share a **link to a specific BBC article**, or\n2. Paste a **headline, quote, or claim** you would like me to analyze and fact-check for you.','2026-09-26 15:11:12'),(21,NULL,'why the score is 100% of bbc website','The credibility score of 100% for the BBC website in this analysis reflects NewsVeil’s assessment based on established criteria for journalistic integrity.\n\nThis score is assigned because the BBC is recognized as a highly reputable, long-standing news organization with a consistent track record of editorial oversight, transparent sourcing, and adherence to professional journalistic standards. \n\nPlease keep in mind that this is an application-generated score based on these criteria; it is a measure of the source\'s general reputation and reliability, rather than an absolute guarantee that every individual piece of information published is factually perfect.','2026-09-26 16:05:22'),(22,NULL,'heyy','Hello! I am your NewsVeil assistant. How can I help you with the analysis for Fact-check ID 24 today?','2026-09-26 16:05:48'),(23,NULL,'hello','Hello! I am your NewsVeil AI assistant. I am here to help you understand the credibility analysis of the news articles you are reviewing.\n\nHow can I assist you with Fact-check ID: 25 today?','2026-09-27 08:25:09'),(24,NULL,'score is high why','The credibility score for this article is high because the NewsVeil analysis identified several indicators of reliable reporting:\n\n*   **Source Authority:** The information originates from established, reputable news organizations with a history of verified reporting.\n*   **Evidence-Based:** The article provides clear citations, links to primary documents, or expert testimony to support its claims.\n*   **Neutral Tone:** The language used is objective and avoids emotionally charged or inflammatory rhetoric.\n*   **Cross-Verification:** The core facts presented in the article have been corroborated by multiple independent, high-trust outlets.\n\nPlease keep in mind that this score is generated by NewsVeil’s internal criteria and is intended as a tool to help you assess the information, rather than an absolute guarantee of truth.','2026-09-27 08:25:31');
/*!40000 ALTER TABLE `chat_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fact_check_details`
--

DROP TABLE IF EXISTS `fact_check_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fact_check_details` (
  `fact_id` int NOT NULL AUTO_INCREMENT,
  `scan_id` int NOT NULL,
  `claim_text` text,
  `verdict` varchar(100) DEFAULT NULL,
  `claim_source_url` text,
  PRIMARY KEY (`fact_id`),
  KEY `scan_id` (`scan_id`),
  CONSTRAINT `fact_check_details_ibfk_1` FOREIGN KEY (`scan_id`) REFERENCES `scan_input` (`scan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fact_check_details`
--

LOCK TABLES `fact_check_details` WRITE;
/*!40000 ALTER TABLE `fact_check_details` DISABLE KEYS */;
INSERT INTO `fact_check_details` VALUES (1,2,'India won the cricket match yesterday.','Low credibility','https://economictimes.indiatimes.com/news/sports/other-sports/its-going-good-players-are-also-happy-ioa-president-pt-usha-says-accommodation-issues-resolved-at-asian-games/articleshow/134408411.cms'),(2,13,'htt[s;//example.com','Low credibility','https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-11/'),(3,15,'bdhdb','Low credibility',NULL),(4,16,'bdjbd','Low credibility',NULL),(5,27,'FIFA lawyers have accused UEFA of harassing president Gianni Infantino and urged a Florida judge to reject the European soccer body\'s request for evidence related to a proposed private investment plan involving the 2026 World Cup, news agency Assocuated Press reported.In a 21-page filing submitted late Monday (local time) to the US District Court for the Southern District of Florida, FIFA lawyers said UEFA was wrong to suggest that Infantino sought to personally profit from the project, which caused a backlash in July before being dropped within days.UEFA has since asked three courts, including courts in Manhattan and Miami, to authorize discovery as it seeks information to help prepare a possible criminal complaint against Infantino in Switzerland over alleged financial mismanagement.','No fact-check found','https://timesofindia.indiatimes.com/sports/football/top-stories/fifa-hits-back-at-uefa-infantinos-lawyers-accuse-european-body-of-harassment/articleshow/134562686.cms'),(6,28,'He accused the media of ignoring attacks on Jewish Israelis and covering \"a handful of juvenile delinquents , about 150 in number, who throw stones, who chop down olive trees, occasionally they light some fires.\" According to the Israeli human rights group, Yesh Din, fewer than three per cent of police investigations into settler violence over the last two decades have led to a conviction.','No fact-check found','https://www.bbc.com/news/articles/cvlylj41egxgo'),(7,29,'The UN Human Rights Monitoring Mission in Ukraine has recorded reports this year of at least 29 civilians killed and 54 injured in Oleshky and Hola Prystan - about 24km to the east.','No fact-check found','https://www.bbc.com/news/articles/c60qxywdx4vvo'),(8,30,'A viral post claims that COVID-19 vaccines cause infertility and prevent people from having children, but health experts have found no evidence that approved vaccines cause fertility loss.','False',NULL),(9,31,'Under standard atmospheric pressure, pure water freezes at 0 degrees Celsius, and this temperature is used as a reference point on the Celsius scale.','No fact-check found',NULL),(10,32,'Some people claim that the Earth is flat and that photographs from space are fabricated, while scientific evidence shows that Earth has a roughly spherical shape.','No fact-check found',NULL),(11,33,'The video shows Gen-Z protesters in Delhi in September 2026 demanding the removal of EVMs and the resignation of CEC Gyanesh Kumar. Fact : The viral video is not from the September 2026 protests. It shows a protest against EVMs held at Jantar Mantar, New Delhi, on 31 January 2024, organised by 22 organisations and addressed by Bharat Mukti Morcha president Waman Meshram. Gyanesh Kumar was appointed as an Election Commissioner only on 15 March 2024 and was not part of the Election Commission during the January 2024 protest. He later took charge as the 26th Chief Election Commissioner of India on 19 February 2025. Hence, the claim made in the post is Misleading . A reverse image search of keyframes from the viral video led us to several social media posts ( here , here , and here ) ( archived ) from late January and early February 2024 featuring the same visuals. According to these posts, the visuals are from a protest against EVMs, led by Waman Meshram, with a large march to the Election Commission office scheduled for 31 January 2024 at Jantar Mantar, New Delhi. Taking clues from these posts, we used relevant keywords and found ( here , here , and here ) that 22 organisations, including the Bharat Mukti Morcha, Rashtriya Kisan Morcha, and Bahujan Mukti Party, held a protest against Electronic Voting Machines (EVMs) at Jantar Mantar on 31 January 2024. The protest was addressed by Waman Meshram, the national president of the Bharat Mukti Morcha. We also found a Facebook post by Waman Meshram featuring pictures from the protest held at Jantar Mantar on 31 January 2024, showing a similar location as seen in the viral video. We also found a video uploaded on Waman Meshram’s YouTube channel on the same day, featuring visuals from the same event and showing a similar crowd and location to those seen in the viral video. PIB Fact Check also debunked the claim, stating that the video is old and dates back to January 2024. ?????????? ?????? ????? ????? ❌ Several social media posts with a video claiming that a protest against EVMs and Chief Election Commissioner is taking place at Jantar Mantar. #???????????? ✅ ?? ???????????, ?? ??… pic.twitter.com/JnfLDfwphJ It is important to note that Rajiv Kumar was the Chief Election Commissioner from 15 May 2022 to 18 February 2025. Gyanesh Kumar and Sukhbir Singh Sandhu joined the Election Commission as Election Commissioners on 15 March 2024. At the time of the 31 January 2024 protest, Gyanesh Kumar was not an Election Commissioner. He completed his tenure in government service on 31 January 2024 and was subsequently appointed as an Election Commissioner on 15 March 2024. Gyanesh Kumar later took charge as the 26th Chief Election Commissioner of India on 19 February 2025. To sum up, a 2024 video of a protest against EVMs in Delhi is shared as a September 2026 protest demanding Gyanesh Kumar’s resignation.','Misleading','https://factly.in/a-2024-video-of-a-protest-against-evms-in-delhi-is-shared-as-a-september-2026-protest-demanding-cec-gyanesh-kumars-resignation/'),(12,34,'The agreed conclusions for the CSW\'s 70th session were titled, \"Ensuring and strengthening access to justice for all women and girls, including by promoting inclusive and equitable legal systems, eliminating discriminatory laws, policies and practices, and addressing structural barriers.\" The document \"urged\" governments and other bodies to take a series of actions to \"strengthen access to justice for all women and girls by 2030, while recognizing the specific needs of women and girls\" (Page 3).','No fact-check found','https://www.snopes.com/fact-check/us-un-vote-womens-rights/'),(13,35,'It appeared in volume five of Brookes\' book when he wrote that the \"stones have been found exactly representing the private parts of a man.\" ( The Natural History of Oxfordshire /Public Domain) It wasn\'t until 1842, more than four decades after the passing of Washington, that biologist Richard Owens published the class \" Dinosauria \" for the first time in his book, Report on British Fossil Reptiles .','No fact-check found','https://www.snopes.com/fact-check/george-washington-dinosaurs-discovered/?utm_source=chatgpt.com'),(14,36,'Data from San Francisco’s medical examiner showed 697 accidental drug overdose deaths in 2020, which was more than twice the city’s 257 COVID-19 deaths.','No fact-check found',NULL),(15,37,'San Francisco 697 overdose deaths 2020 San Francisco 257 COVID deaths 2020 697 drug overdose deaths San Francisco San Francisco overdose deaths COVID 2020','No fact-check found',NULL),(16,38,'Data from San Francisco’s medical examiner showed 697 accidental drug overdose deaths in 2020, which was more than twice the city’s 257 COVID-19 deaths.','No fact-check found',NULL),(17,39,'This action reflects our continued commitment to protecting ​our foundational technologies ​from unauthorized ⁠use.','No fact-check found',NULL),(18,40,'Lindsay Clancy appears in court as her lawyer pushes for murder case to be dismissed Lindsay Clancy, the US woman accused of murdering her three children, has appeared in court for the first time since her murder trial fell apart earlier this month.','No fact-check found',NULL),(19,41,'Lindsay Clancy appears in court as her lawyer pushes for murder case to be dismissed Lindsay Clancy, the US woman accused of murdering her three children, has appeared in court for the first time since her murder trial fell apart earlier this month.','No fact-check found',NULL),(20,42,'Man City guilty of \'sham\' contracts and misleading accounts The League confirmed that City have been found guilty of all charges related to breaches of Premier League financial rules between the 2009-10 and 2017-18 seasons.','No fact-check found',NULL),(21,43,'99% of Heart Attacks in India Can Be Linked to These 4 ‘Invisible’ Health Factors — Are You at Risk?','No fact-check found',NULL),(22,44,'Turkey sets up council to oversee investment fund liquidations ISTANBUL, Sept 29 (Reuters) - Turkey established a fund coordination council chaired by the vice ​president to oversee the rapid ‌liquidation of investment funds to protect investor rights following a recent fund crisis, the ​presidency said on Tuesday.','No fact-check found',NULL),(23,45,'Man City guilty of \'sham\' contracts and misleading accounts The League confirmed that City have been found guilty of all charges related to breaches of Premier League financial rules between the 2009-10 and 2017-18 seasons.','No fact-check found',NULL),(24,46,'25 September 2026: Reports emerge that a verdict has been reached, with sources telling the BBC that City have been found guilty of breaking the majority of the charges.','No fact-check found','https://www.bbc.com/sport/football/articles/c63reg93xwzro'),(25,47,'New NCERT Social Science text replaces European revolutions with resistance movements in medieval India Content on French, Russian revolutions removed from latest edition of Class 9 textbook; shifts focus to foreign invasions triggered by Indian wealth, and armed resistance by Sikhs, Jats, Rajputs, Ahoms','No fact-check found',NULL),(26,48,'New NCERT Social Science text replaces European revolutions with resistance movements in medieval India Content on French, Russian revolutions removed from latest edition of Class 9 textbook; shifts focus to foreign invasions triggered by Indian wealth, and armed resistance by Sikhs, Jats, Rajputs, Ahoms','No fact-check found',NULL),(27,49,'The new Social Science textbook for Class 9 students released by the National Council of Educational Research and Training (NCERT) on Tuesday (September 29, 2026) has removed several chapters on European revolutions and has instead prioritised India’s medieval history, regional resistance movements, and the impact of successive foreign invasions in its new edition.','No fact-check found','https://www.thehindu.com/education/new-ncert-social-science-text-replaces-european-revolutions-with-resistance-movements-in-medieval-india/article71524853.ece#google_vignette'),(28,50,'Girl has multiple surgeries to control infections after strike in Gaza Six-year-old Raseel al-Balawi in Gaza has had more than 20 surgeries since an Israeli air strike injured her in late July.','No fact-check found',NULL),(29,51,'The film, which stars Nayanthara alongside Salman, has been officially announced for an Eid 2027 theatrical release.','No fact-check found','https://www.hindustantimes.com/entertainment/bollywood/salman-khan-poses-for-paparazzi-after-calling-out-disgusting-behaviour-on-bigg-boss-20-katrina-kaif-101790746702747.html'),(30,52,'During the Apollo 11 mission on July 20, 1969, astronaut Buzz Aldrin took Holy Communion on the Moon.','No fact-check found',NULL),(31,53,'During the Apollo 11 mission on July 20, 1969, astronaut Buzz Aldrin took Holy Communion on the Moon.','No fact-check found',NULL),(32,54,'Apple has officially launched Apple Pay in India, allowing users with Axis Bank credit cards to make payments.','No fact-check found','https://timesofindia.indiatimes.com/technology'),(33,55,'During the Apollo 11 mission on July 20, 1969, astronaut Buzz Aldrin took Holy Communion on the Moon.','True',NULL),(34,56,'Tigress from Bihar’s Valmiki Tiger Reserve to be introduced at Bengal’s Buxa on Oct 2 A three-year-old tigress was flown in from Bihar’s Valmiki Tiger Reserve to West Bengal’s Buxa Tiger Reserve on Wednesday','No fact-check found',NULL),(35,57,'Tigress from Bihar’s Valmiki Tiger Reserve to be introduced at Bengal’s Buxa on Oct 2 A three-year-old tigress was flown in from Bihar’s Valmiki Tiger Reserve to West Bengal’s Buxa Tiger Reserve on Wednesday','No fact-check found',NULL),(36,58,'Tigress from Bihar’s Valmiki Tiger Reserve to be introduced at Bengal’s Buxa on Oct 2 A three-year-old tigress was flown in from Bihar’s Valmiki Tiger Reserve to West Bengal’s Buxa Tiger Reserve on Wednesday','No fact-check found',NULL),(37,59,'Stabbed flydubai pilot Smit Machchhar is Indian national, worked with SpiceJet earlier Smit Machchhar has been a captain on flydubai\'s Boeing 737 fleet since June 2022, according to his LinkedIn profile.','No fact-check found',NULL),(38,60,'Stabbed flydubai pilot Smit Machchhar is Indian national, worked with SpiceJet earlier Smit Machchhar has been a captain on flydubai\'s Boeing 737 fleet since June 2022, according to his LinkedIn profile.','No fact-check found',NULL),(39,61,'Chipmaker Nvidia becomes most valuable company in the world at $4 trillion Nvidia was founded in 1993.','No fact-check found',NULL),(40,62,'Indian airport\'s Travel Food Services raises $234 million in India\'s 9th largest IPO Travel Food Services, saw strong institutional bids while retail investors stayed cautious amid trade uncertainties, resulting in a 1.89 times subscription.','No fact-check found',NULL),(41,63,'is one of the factors likely keeping risk averse non-institutional and retail investors away from the TFS IPO,\" said Sunny Agarwal, head of fundamental equity research at SBICAPS Securities.India, the world\'s third-largest aviation market, is witnessing a sharp uptick in travel demand and as disposable incomes rise, passengers are spending more on food, beverages, and premium services such as lounges.Ratings agency CRISIL projects India\'s airport quick service restaurant sector to grow 17%-19% annually to 170 billion rupees to 180 billion rupees by fiscal 2034, while the lounge sector is seen growing by as much as 24% to 165 billion rupees.Travel Food Services, a joint venture between UK-based SSP Group and India\'s K Hospitality Corp, runs restaurants such as Jamie Oliver\'s Pizzeria, Krispy Kreme and KFC at 18 airports across India, Malaysia and Hong Kong, as well as 37 lounges.Its three-day IPO that ends on Wednesday is an offer for sale, with its largest shareholder, the Kapur Family Trust, offloading a stake worth 20 billion rupees, or 13.81%, at the top end of the 1,045 rupees to&nbsp;1,100&nbsp;rupees price band.TFS had on Friday allotted shares worth nearly 6 billion rupees to large institutional buyers, including sovereign wealth funds ADIA and Norges.($1 = 85.7030 Indian rupees)','No fact-check found','https://www.hindustantimes.com/business/indian-airports-travel-food-services-raises-234-million-in-indias-9th-largest-ipo-101752056446655.html'),(42,64,'The video was posted by X user Alka Maurya on September 16 and has garnered more than 2,85,000 views and shared over 1,500 times till publication time.','No fact-check found','https://www.altnews.in/viral-video-of-poor-puffed-rice-vendor-being-assaulted-is-a-scripted-skit/'),(43,65,'A social media post says Target took a children\'s Halloween costume off its website after users criticised it for resembling racist minstrel and blackface imagery, and the company did remove it.','True',NULL),(44,66,'A bipartisan group of legislators introduced a resolution on April 30, 2026 condemning a Twitch streamer for alleged antisemitism, so it will automatically become law across the United States.','True',NULL),(45,67,'A bipartisan group of legislators introduced a resolution on April 30, 2026 condemning a Twitch streamer for alleged antisemitism, so it will automatically become law across the United States.','True',NULL),(46,68,'A bipartisan group of legislators introduced a resolution on April 30, 2026 condemning a Twitch streamer for alleged antisemitism, so it will automatically become law across the United States.','True',NULL),(47,69,'Indian airport\'s Travel Food Services raises $234 million in India\'s 9th largest IPO Travel Food Services, saw strong institutional bids while retail investors stayed cautious amid trade uncertainties, resulting in a 1.89 times subscription.','No fact-check found',NULL),(48,70,'A viral post claims that in January 2026 former first lady Michelee Obama told people to avoid clothing brands that are white or white-owned when they shop.','False',NULL),(49,71,'A viral post claims that in January 2026 former first lady Michelee Obama told people to avoid clothing brands that are white or white-owned when they shop.','No fact-check found',NULL),(50,72,'A viral post claims that in January 2026 former first lady Michelee Obama told people to avoid clothing brands that are white or white owned when they shop.','False',NULL),(51,73,'A bipartisan group of legislators introduced a resolution on April 30, 2026 condemning a Twitch streamer for alleged antisemitism, so it will automatically become law across the United States.','No fact-check found',NULL),(52,74,'A bipartisan group of legislators introduced a resolution on April 30, 2026 condemning a Twitch streamer for alleged antisemitism, so it will automatically become law across the United States.','True',NULL),(53,75,'A bipartisan group of legislators introduced a resolution on April 30, 2026 condemning a Twitch streamer for alleged antisemitism, so it will automatically become law across the United States.','True',NULL);
/*!40000 ALTER TABLE `fact_check_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scan_input`
--

DROP TABLE IF EXISTS `scan_input`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scan_input` (
  `scan_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `input_type` text,
  `source_url` text,
  `scanned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `input_text` text,
  PRIMARY KEY (`scan_id`),
  KEY `fk_scan_user` (`user_id`),
  CONSTRAINT `fk_scan_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scan_input`
--

LOCK TABLES `scan_input` WRITE;
/*!40000 ALTER TABLE `scan_input` DISABLE KEYS */;
INSERT INTO `scan_input` VALUES (1,2,'url','https://www.bbc.com','2026-09-23 16:33:50',NULL),(2,2,'text',NULL,'2026-09-23 16:34:52',NULL),(3,2,'url','https://www.reuters.com','2026-09-24 15:14:45',NULL),(4,2,'url','https://www.reuters.com/','2026-09-24 15:44:07',NULL),(5,2,'url','https://www.reuters.com/','2026-09-24 16:02:23',NULL),(6,2,'url','https://www.reuters.com/','2026-09-24 16:05:03',NULL),(7,2,'url','https://www.reuters.com/','2026-09-24 16:10:18',NULL),(8,2,'url','https://www.reuters.com/','2026-09-24 16:22:30',NULL),(9,2,'url','https://example.com/','2026-09-24 16:31:28',NULL),(10,2,'url','https://www.newsready.com/','2026-09-24 16:32:12',NULL),(11,2,'url','https://example.com/','2026-09-24 17:55:03',NULL),(12,2,'url','https://example.com','2026-09-24 18:21:38',NULL),(13,2,'text',NULL,'2026-09-24 18:24:29',NULL),(14,2,'url','https://example.com','2026-09-24 18:31:54',NULL),(15,2,'text',NULL,'2026-09-24 18:35:34',NULL),(16,2,'text',NULL,'2026-09-24 18:41:13',NULL),(17,2,'url','https://bbc.com/','2026-09-24 18:55:53',NULL),(18,2,'url','https://bbc.com/','2026-09-24 18:56:49',NULL),(19,2,'url','https://bbc.com/','2026-09-24 19:05:18',NULL),(20,2,'url','https://bbc.com/','2026-09-24 19:22:23',NULL),(21,2,'url','https://bbc.com/','2026-09-24 19:27:09',NULL),(22,2,'url','https://instagram.com/','2026-09-24 19:27:33',NULL),(23,2,'url','https://bbc.com/','2026-09-26 15:10:04',NULL),(24,2,'url','https://bbc.com/','2026-09-26 16:04:49',NULL),(25,2,'url','https://bbc.com/','2026-09-27 08:24:44',NULL),(26,2,'url','https://www.bbc.com/news/articles/cmvgyyw2jeego','2026-09-27 08:26:31',NULL),(27,7,'url','https://timesofindia.indiatimes.com/sports/football/top-stories/fifa-hits-back-at-uefa-infantinos-lawyers-accuse-european-body-of-harassment/articleshow/134562686.cms','2026-09-29 17:57:14',NULL),(28,7,'url','https://www.bbc.com/news/articles/cvlylj41egxgo','2026-09-29 17:58:35',NULL),(29,7,'url','https://www.bbc.com/news/articles/c60qxywdx4vvo','2026-09-29 18:01:20',NULL),(30,7,'text',NULL,'2026-09-29 18:04:02',NULL),(31,7,'text',NULL,'2026-09-29 18:05:08',NULL),(32,7,'text',NULL,'2026-09-29 18:06:28',NULL),(33,7,'url','https://factly.in/a-2024-video-of-a-protest-against-evms-in-delhi-is-shared-as-a-september-2026-protest-demanding-cec-gyanesh-kumars-resignation/','2026-09-29 18:13:15',NULL),(34,7,'url','https://www.snopes.com/fact-check/us-un-vote-womens-rights/','2026-09-29 18:15:04',NULL),(35,7,'url','https://www.snopes.com/fact-check/george-washington-dinosaurs-discovered/?utm_source=chatgpt.com','2026-09-29 18:18:04',NULL),(36,7,'text',NULL,'2026-09-29 18:20:39',NULL),(37,7,'text',NULL,'2026-09-29 18:23:03',NULL),(38,7,'text',NULL,'2026-09-29 18:29:04',NULL),(39,7,'text',NULL,'2026-09-29 19:21:10',NULL),(40,7,'text',NULL,'2026-09-29 19:35:58',NULL),(41,7,'text',NULL,'2026-09-29 19:39:02',NULL),(42,7,'text',NULL,'2026-09-29 19:42:35',NULL),(43,7,'text',NULL,'2026-09-29 19:48:24',NULL),(44,7,'text',NULL,'2026-09-29 19:50:31',NULL),(45,7,'text',NULL,'2026-09-29 19:52:42',NULL),(46,7,'url','https://www.bbc.com/sport/football/articles/c63reg93xwzro','2026-09-29 19:53:30',NULL),(47,7,'text',NULL,'2026-09-29 19:54:39',NULL),(48,7,'text',NULL,'2026-09-29 19:57:37',NULL),(49,7,'url','https://www.thehindu.com/education/new-ncert-social-science-text-replaces-european-revolutions-with-resistance-movements-in-medieval-india/article71524853.ece#google_vignette','2026-09-29 19:58:40',NULL),(50,7,'text',NULL,'2026-09-30 05:48:32',NULL),(51,7,'url','https://www.hindustantimes.com/entertainment/bollywood/salman-khan-poses-for-paparazzi-after-calling-out-disgusting-behaviour-on-bigg-boss-20-katrina-kaif-101790746702747.html','2026-09-30 06:39:00',NULL),(52,7,'text',NULL,'2026-09-30 06:41:37',NULL),(53,7,'text',NULL,'2026-09-30 06:56:42',NULL),(54,7,'url','https://timesofindia.indiatimes.com/technology','2026-09-30 12:14:01',NULL),(55,7,'text',NULL,'2026-09-30 14:49:49',NULL),(56,7,'text',NULL,'2026-09-30 15:05:08',NULL),(57,7,'text',NULL,'2026-09-30 15:10:52',NULL),(58,7,'text',NULL,'2026-09-30 15:14:34',NULL),(59,7,'text',NULL,'2026-09-30 15:18:36',NULL),(60,7,'text',NULL,'2026-09-30 15:20:55',NULL),(61,7,'text',NULL,'2026-09-30 15:27:34',NULL),(62,7,'text',NULL,'2026-09-30 15:32:01',NULL),(63,7,'url','https://www.hindustantimes.com/business/indian-airports-travel-food-services-raises-234-million-in-indias-9th-largest-ipo-101752056446655.html','2026-09-30 15:39:04',NULL),(64,7,'url','https://www.altnews.in/viral-video-of-poor-puffed-rice-vendor-being-assaulted-is-a-scripted-skit/','2026-09-30 15:45:33',NULL),(65,7,'text',NULL,'2026-09-30 15:48:26',NULL),(66,7,'text',NULL,'2026-09-30 15:55:38',NULL),(67,7,'text',NULL,'2026-09-30 15:56:46',NULL),(68,7,'text',NULL,'2026-09-30 15:57:09',NULL),(69,7,'text',NULL,'2026-09-30 15:58:12',NULL),(70,7,'text',NULL,'2026-10-01 02:46:04',NULL),(71,7,'text',NULL,'2026-10-01 02:51:06',NULL),(72,7,'text',NULL,'2026-10-01 02:55:23',NULL),(73,7,'text',NULL,'2026-10-01 04:58:56',NULL),(74,7,'text',NULL,'2026-10-01 05:00:37',NULL),(75,7,'text',NULL,'2026-10-01 05:30:14',NULL);
/*!40000 ALTER TABLE `scan_input` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scan_results`
--

DROP TABLE IF EXISTS `scan_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scan_results` (
  `result_id` int NOT NULL AUTO_INCREMENT,
  `scan_id` int NOT NULL,
  `ai_score` float DEFAULT NULL,
  `fact_score` float DEFAULT NULL,
  `source_score` float DEFAULT NULL,
  `final_source` float DEFAULT NULL,
  PRIMARY KEY (`result_id`),
  KEY `scan_id` (`scan_id`),
  CONSTRAINT `scan_results_ibfk_1` FOREIGN KEY (`scan_id`) REFERENCES `scan_input` (`scan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scan_results`
--

LOCK TABLES `scan_results` WRITE;
/*!40000 ALTER TABLE `scan_results` DISABLE KEYS */;
INSERT INTO `scan_results` VALUES (1,1,NULL,NULL,100,100),(2,2,NULL,NULL,30,30),(3,3,NULL,NULL,100,100),(4,4,NULL,NULL,100,100),(5,5,NULL,NULL,100,100),(6,6,NULL,NULL,100,100),(7,7,NULL,NULL,100,100),(8,8,NULL,NULL,100,100),(9,9,NULL,NULL,35,35),(10,10,NULL,NULL,45,45),(11,11,NULL,NULL,35,35),(12,12,NULL,NULL,35,35),(13,13,NULL,NULL,30,30),(14,14,NULL,NULL,35,35),(15,15,NULL,NULL,30,30),(16,16,NULL,NULL,30,30),(17,17,NULL,NULL,100,100),(18,18,NULL,NULL,100,100),(19,19,NULL,NULL,100,100),(20,20,NULL,NULL,100,100),(21,21,NULL,NULL,100,100),(22,22,NULL,NULL,35,35),(23,23,NULL,NULL,100,100),(24,24,NULL,NULL,100,100),(25,25,5.88,NULL,100,100),(26,26,11.78,NULL,100,100),(27,27,NULL,50,NULL,NULL),(28,28,NULL,50,NULL,NULL),(29,29,NULL,50,NULL,NULL),(30,30,NULL,0,NULL,NULL),(31,31,NULL,50,NULL,NULL),(32,32,NULL,50,NULL,NULL),(33,33,NULL,50,NULL,NULL),(34,34,NULL,50,NULL,NULL),(35,35,NULL,50,NULL,NULL),(36,36,NULL,50,NULL,NULL),(37,37,NULL,50,NULL,NULL),(38,38,NULL,50,NULL,NULL),(39,39,NULL,50,NULL,NULL),(40,40,NULL,50,NULL,NULL),(41,41,NULL,50,NULL,NULL),(42,42,NULL,50,NULL,NULL),(43,43,NULL,50,NULL,NULL),(44,44,NULL,50,NULL,NULL),(45,45,NULL,50,NULL,NULL),(46,46,NULL,50,NULL,NULL),(47,47,NULL,50,NULL,NULL),(48,48,NULL,50,NULL,NULL),(49,49,NULL,50,NULL,NULL),(50,50,NULL,50,NULL,NULL),(51,51,NULL,50,NULL,NULL),(52,52,NULL,50,NULL,NULL),(53,53,NULL,50,NULL,NULL),(54,54,NULL,50,NULL,NULL),(55,55,NULL,100,NULL,NULL),(56,56,NULL,50,NULL,NULL),(57,57,NULL,50,NULL,NULL),(58,58,NULL,50,NULL,NULL),(59,59,NULL,50,NULL,NULL),(60,60,NULL,50,NULL,NULL),(61,61,NULL,50,NULL,NULL),(62,62,NULL,50,NULL,NULL),(63,63,NULL,50,NULL,NULL),(64,64,NULL,50,NULL,NULL),(65,65,NULL,100,NULL,NULL),(66,66,NULL,100,NULL,NULL),(67,67,NULL,100,NULL,NULL),(68,68,NULL,100,NULL,NULL),(69,69,NULL,50,NULL,NULL),(70,70,NULL,0,NULL,NULL),(71,71,NULL,50,NULL,NULL),(72,72,NULL,0,NULL,NULL),(73,73,NULL,50,NULL,NULL),(74,74,NULL,100,NULL,NULL),(75,75,NULL,100,NULL,NULL);
/*!40000 ALTER TABLE `scan_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `source_credibility_details`
--

DROP TABLE IF EXISTS `source_credibility_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `source_credibility_details` (
  `source_id` int NOT NULL AUTO_INCREMENT,
  `scan_id` int NOT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `credibility_rating` varchar(100) DEFAULT NULL,
  `is_known_reliable` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`source_id`),
  KEY `scan_id` (`scan_id`),
  CONSTRAINT `source_credibility_details_ibfk_1` FOREIGN KEY (`scan_id`) REFERENCES `scan_input` (`scan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `source_credibility_details`
--

LOCK TABLES `source_credibility_details` WRITE;
/*!40000 ALTER TABLE `source_credibility_details` DISABLE KEYS */;
INSERT INTO `source_credibility_details` VALUES (1,1,'bbc.com','Reliable',1),(2,3,'reuters.com','Reliable',1),(3,4,'reuters.com','Reliable',1),(4,5,'reuters.com','Reliable',1),(5,6,'reuters.com','Reliable',1),(6,7,'reuters.com','Reliable',1),(7,8,'reuters.com','Reliable',1),(8,9,'example.com','Low credibility',0),(9,10,'newsready.com','Low credibility',0),(10,11,'example.com','Low credibility',0),(11,12,'example.com','Low credibility',0),(12,14,'example.com','Low credibility',0),(13,17,'bbc.com','Reliable',1),(14,18,'bbc.com','Reliable',1),(15,19,'bbc.com','Reliable',1),(16,20,'bbc.com','Reliable',1),(17,21,'bbc.com','Reliable',1),(18,22,'Instagram','Low credibility',0),(19,23,'bbc.com','Reliable',1),(20,24,'bbc.com','Reliable',1),(21,25,'bbc.com','Reliable',1),(22,26,'bbc.com','Reliable',1);
/*!40000 ALTER TABLE `source_credibility_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Vedika','vedika@test.com','$argon2id$v=19$m=65536,t=3,p=4$9SrSjMjt0NaE02OhAM0LIA$X8TBSlcd9dlJn4p2H4u9qojBSgPLGT5ZznNg5ZGst4g','2026-09-28 15:58:55'),(2,'Vedika test','vedikajadhavtest2@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$JBS/qKIdsRze/BRCFu57Cg$9JmZjKjydjwvNwoW96arLl7cllJoJFl6irKCYyfZJGI','2026-09-28 16:06:40'),(3,'vedika jadhav','vedikajadhav1106@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$jhec7sVfVcG9Ozy19HaEOA$6Yddd6Aa3zGeK+RViBGpZGM3wrPYcOPPfrp62mP4EjU','2026-09-29 04:21:31'),(4,'vedika','vedika12@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$vEauAYewJ0gkF3X0ctmAYQ$vxVXLh3qeaTDdKNPMzsOc6nMn0zTPxlDXjPrzPtiIIk','2026-09-29 07:58:44'),(5,'vedika','vedika13@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$M8nJJWgrJfViUyQC3vh4VA$TQoXWKr8ZDyUv+8V9IB5n8FLHaoTlaTpUXLe38dABK4','2026-09-29 08:04:13'),(6,'vedika','vedika8@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$laK1hVv7QZP6WRyB8cMmDQ$xraDwFGY/X4NA/8rip3RoGjECcWckfdzQ1Ug4KSmAtQ','2026-09-29 17:39:05'),(7,'mrunali','mrunali@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$zURi6MHanfzzHDHRcE6Liw$9+vmRNnTTC1DLSYOrDpH16wP7pKMrqtpaxN8fLcy9UQ','2026-09-29 17:56:09');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-02 14:57:27

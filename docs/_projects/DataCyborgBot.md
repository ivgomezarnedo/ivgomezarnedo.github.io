---
name: Data Cyborg Bot
tools: [Reddit API, Twitter API, Python, AWS Lambda, FFmpeg]
image: /TATO2.png
description:  Half human - half bot account about software/data engineering. Bot part posts the best daily posts in some /r (Pinned). Human part posts non-automated content.


---

<p class="text-left">
{% include elements/button.html link="http://play.google.com/store/apps/details?id=com.produccionesgs.quinielaperfecta" text="Google Play" %}
</p>

# Quiniela Perfecta app
Quiniela Perfecta is a [free Android app](http://play.google.com/store/apps/details?id=com.produccionesgs.quinielaperfecta) (IOS version coming soon) that shows detailed information about the [spanish Quiniela](https://www.loteriasyapuestas.es/en/centro-de-ayuda/como-se-juega/como-jugar-a-la-quiniela), both current (available for betting) and historical (already finished).

Its main features are:
- Serve as an aid to Quiniela players, calculating the best distribution for the combination (number of doubles and triples) of the user.
- Reduce biases by offering real win, draw and loss percentages (obtained from >10 bookmakers) for all La Quiniela matches.
- Calculation of the expected value of La Quiniela.
- Compare the statistics obtained for a Quiniela with those obtained for previous Quinielas.
- Easily check the results of previous Quinielas, their prizes and number of winners.

![preview](/feature_graphic_3.png)

### How it works?
The app shows the current matchday’s Quiniela games with the odds (extracted from bookmakers) of the possible results (1-X-2).

With this information, the most statistically probable Quiniela is calculated for the number of doubles and triples that the user selects (by default, 0 doubles and 0 triples). For each combination (number of doubles and number of triples), statistics are shown that summarise its odds, comparing them with historical data for equivalent Quinielas.

In addition to the information for the Quinielas still to be played, the app also allows the user to check all the **Quinielas already played**, with their results and information about them:
- Winning combination.
- Revenue/Collection.
- Number of winners and prize obtained for each possible number of correct answers (15–10 correct answers).
- If the Quiniela had or not some kind of jackpot.


## Technical implementation

![technical_diagram](/Lambda-reddit-twitter-s3.drawio.png)


Project built entirely using the [AWS Free Tier](https://aws.amazon.com/free/).
- **Python**
  - **BeautifulSoap**: Web scraping.
  - **Fuzzy-search**: Teams could have different names in different bookmakers (i.e., *Real Madrid* and *R. Madrid*). Fuzzy-search have been used to univocally identify a match across several bookmakers.
  - **Sklearn**: To predict the revenue/collection of the Quiniela. Historical data has been used to train the model. 
- **SQLite**: Way more cheaper than using AWS Aurora. 
- **C# + Xamarin**: Mobile app. 95% of the code equal for Android and IOS. 
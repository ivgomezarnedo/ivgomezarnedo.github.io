---
name: Quiniela Perfecta
tools: [C#, Xamarin, Python, AWS Lambda, SQLite, Web Scraping]
image: /assets/images/feature_graphic_qp_1.png
description: Quiniela Perfecta is an app that provides detailed information about the spanish Quiniela games and calculates the statistically probable Quiniela's by calculating the best possible combination using real win, draw, and loss percentages from multiple bookmakers. It also calculates the expected value of a Quiniela, compares statistics with previous Quinielas, and allows users to check previous results and prizes.

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

![preview](/assets/images/feature_graphic_qp_2.png)
<br>

{% capture heading %}
### How it works?

{% endcapture %}

{% capture description %}
The app shows the current matchday’s Quiniela games with the odds (extracted from bookmakers) of the possible results (1-X-2).

  With this information, the most statistically probable Quiniela is calculated for the number of doubles and triples that the user selects (by default, 0 doubles and 0 triples). For each combination (number of doubles and number of triples), statistics are shown that summarise its odds, comparing them with historical data for equivalent Quinielas.

  In addition to the information for the Quinielas still to be played, the app also allows the user to check all the **Quinielas already played**, with their results and information about them:
  - Winning combination.
  - Revenue/Collection.
  - Number of winners and prize obtained for each possible number of correct answers (15–10 correct answers).
  - If the Quiniela had or not some kind of jackpot.
{% endcapture %}

<div class="content-container">
  <div class="text-container">
    {{ heading | markdownify }}
    {{ description | markdownify }}
    <br>
  <p class="text-center">
{% include elements/button.html link="https://medium.com/@ivangomezarnedo/how-to-use-expected-value-in-a-lottery-ae868726dd1e" text="Learn More" %}
</p>
  </div>
  <div class="gif-container">
    {% raw %}<img src="/assets/images/qp_usage.gif" alt="Quiniela_perfecta video">{% endraw %}
  </div>
</div>





## Technical implementation

![technical_diagram](/assets/images/architecture_qp.jpg)
Project built entirely using the [AWS Free Tier](https://aws.amazon.com/free/).
- **Python**
  - **AIOHTTP**: To perform HTTP requests asynchronously.
  - **BeautifulSoap**: Web scraping.
  - **Fuzzy-search**: Teams could have different names in different bookmakers (i.e., *Real Madrid* and *R. Madrid*). Fuzzy-search have been used to univocally identify a match across several bookmakers.
  - **Sklearn**: To predict the revenue/collection of the Quiniela. Historical data has been used to train the model. 
- **SQLite**: Way more cheaper than using AWS Aurora. 
- **C# + Xamarin**: Mobile app. 95% of the code equal for Android and IOS. 
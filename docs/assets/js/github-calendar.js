/*
 * GitHub contributions calendar.
 *
 * Replaces the github-calendar library, which scraped GitHub's HTML and broke
 * when GitHub changed its markup. This reads JSON from
 * github-contributions-api.jogruber.de and draws the calendar as an SVG.
 */
(function () {
  "use strict";

  var API = "https://github-contributions-api.jogruber.de/v4/";
  var CELL = 11;
  var GAP = 3;
  var STEP = CELL + GAP;
  var LEFT = 30; // room for weekday labels
  var TOP = 18;  // room for month labels
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var SVG_NS = "http://www.w3.org/2000/svg";

  function parseDate(s) {
    var p = s.split("-");
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
  }

  function formatDate(d) {
    return MONTHS[d.getUTCMonth()] + " " + d.getUTCDate() + ", " + d.getUTCFullYear();
  }

  function svgEl(name, attrs, text) {
    var el = document.createElementNS(SVG_NS, name);
    Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function streaks(days) {
    var longest = { len: 0 }, run = { len: 0 };
    days.forEach(function (d) {
      if (d.count > 0) {
        if (run.len === 0) run.start = d.date;
        run.len += 1;
        run.end = d.date;
        if (run.len > longest.len) longest = { len: run.len, start: run.start, end: run.end };
      } else {
        run = { len: 0 };
      }
    });
    // The current streak may end yesterday if there are no contributions yet today.
    var i = days.length - 1;
    if (i >= 0 && days[i].count === 0) i -= 1;
    var current = { len: 0 };
    for (; i >= 0 && days[i].count > 0; i--) {
      current.start = days[i].date;
      if (!current.end) current.end = days[i].date;
      current.len += 1;
    }
    return { longest: longest, current: current };
  }

  function drawGraph(days) {
    var firstDow = parseDate(days[0].date).getUTCDay(); // 0 = Sunday
    var weeks = Math.ceil((firstDow + days.length) / 7);
    var width = LEFT + weeks * STEP;
    var height = TOP + 7 * STEP;
    var svg = svgEl("svg", {
      viewBox: "0 0 " + width + " " + height,
      class: "gh-calendar-graph",
      role: "img",
      "aria-label": "GitHub contributions in the last year"
    });

    [[1, "Mon"], [3, "Wed"], [5, "Fri"]].forEach(function (l) {
      svg.appendChild(svgEl("text", {
        x: 0, y: TOP + l[0] * STEP + CELL - 2, class: "gh-calendar-label"
      }, l[1]));
    });

    var lastMonthWeek = -3;
    days.forEach(function (d, i) {
      var slot = firstDow + i;
      var week = Math.floor(slot / 7);
      var dow = slot % 7;
      var date = parseDate(d.date);

      // Label a month in the column of its first Sunday, unless too close to the previous label.
      if (dow === 0 && date.getUTCDate() <= 7 && week - lastMonthWeek >= 3) {
        svg.appendChild(svgEl("text", {
          x: LEFT + week * STEP, y: TOP - 6, class: "gh-calendar-label"
        }, MONTHS[date.getUTCMonth()]));
        lastMonthWeek = week;
      }

      var rect = svgEl("rect", {
        x: LEFT + week * STEP, y: TOP + dow * STEP,
        width: CELL, height: CELL, rx: 2, ry: 2,
        class: "gh-calendar-day", "data-level": d.level
      });
      var label = (d.count === 0 ? "No" : d.count) + " contribution" +
                  (d.count === 1 ? "" : "s") + " on " + formatDate(date);
      rect.appendChild(svgEl("title", {}, label));
      svg.appendChild(rect);
    });
    return svg;
  }

  function stat(title, value, detail) {
    var box = document.createElement("div");
    box.className = "gh-calendar-stat";
    [["gh-calendar-stat-title", title], ["gh-calendar-stat-value", value],
     ["gh-calendar-stat-detail", detail]].forEach(function (p) {
      var el = document.createElement("span");
      el.className = p[0];
      el.textContent = p[1];
      box.appendChild(el);
    });
    return box;
  }

  function range(s) {
    if (!s.len) return "No recent contributions";
    return formatDate(parseDate(s.start)) + " – " + formatDate(parseDate(s.end));
  }

  function legend() {
    var el = document.createElement("div");
    el.className = "gh-calendar-legend";
    el.appendChild(document.createTextNode("Less"));
    for (var level = 0; level <= 4; level++) {
      var box = document.createElement("span");
      box.className = "gh-calendar-legend-day";
      box.setAttribute("data-level", level);
      el.appendChild(box);
    }
    el.appendChild(document.createTextNode("More"));
    return el;
  }

  function render(container, username, data) {
    var days = data.contributions;
    var total = days.reduce(function (sum, d) { return sum + d.count; }, 0);
    var s = streaks(days);

    var wrap = document.createElement("div");
    wrap.className = "gh-calendar";

    var graph = document.createElement("a");
    graph.className = "gh-calendar-graph-link";
    graph.href = "https://github.com/" + username;
    graph.appendChild(drawGraph(days));
    wrap.appendChild(graph);
    wrap.appendChild(legend());

    var stats = document.createElement("div");
    stats.className = "gh-calendar-stats";
    stats.appendChild(stat("Contributions in the last year", total + " total",
      formatDate(parseDate(days[0].date)) + " – " + formatDate(parseDate(days[days.length - 1].date))));
    stats.appendChild(stat("Longest streak", s.longest.len + " days", range(s.longest)));
    stats.appendChild(stat("Current streak", s.current.len + " days", range(s.current)));
    wrap.appendChild(stats);

    container.innerHTML = "";
    container.appendChild(wrap);
  }

  function fail(container, username) {
    container.innerHTML = "";
    var p = document.createElement("p");
    p.className = "gh-calendar-error";
    p.appendChild(document.createTextNode("Couldn't load the contributions. See them on "));
    var a = document.createElement("a");
    a.href = "https://github.com/" + username;
    a.textContent = "GitHub";
    p.appendChild(a);
    p.appendChild(document.createTextNode("."));
    container.appendChild(p);
  }

  window.GitHubCalendar = function (selector, username) {
    var container = document.querySelector(selector);
    if (!container || !window.fetch) return;
    fetch(API + encodeURIComponent(username) + "?y=last")
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        if (!data.contributions || !data.contributions.length) throw new Error("empty");
        render(container, username, data);
      })
      .catch(function () { fail(container, username); });
  };
})();

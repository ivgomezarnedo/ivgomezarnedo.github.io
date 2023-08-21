"use strict";

const parse = require("github-calendar-parser")
    , $ = require("elly")
    , addSubtractDate = require("add-subtract-date")
    , formatoid = require("formatoid")

const DATE_FORMAT1 = "MMM D, YYYY"
    , DATE_FORMAT2 = "MMMM D"

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function printDayCount(dayCount) {
    return  `${dayCount} ${(dayCount === 1) ? "day" : "days"}`
}

function addTooltips(container) {
    const tooltip = document.createElement("div");
    tooltip.classList.add("day-tooltip");
    container.appendChild(tooltip);

    // Target the cells representing daily contributions
    const days = container.querySelectorAll(".ContributionCalendar-day");
    
    days.forEach(day => {
        day.addEventListener("mouseenter", (e) => {
            // Extract the date and contribution count from the attributes and inner span
            const date = new Date(e.target.getAttribute("data-date"));
            const contribCountText = e.target.querySelector(".sr-only").textContent;
            const contribCount = parseInt(contribCountText.split(" ")[0], 10) || 0;

            let contribText;
            if (contribCount === 0) {
                contribText = "No contributions";
            } else if (contribCount === 1) {
                contribText = "1 contribution";
            } else {
                contribText = `${contribCount} contributions`;
            }

            const dateText = `${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
            tooltip.innerHTML = `<strong>${contribText}</strong> on ${dateText}`;
            tooltip.classList.add("is-visible");

            const size = e.target.getBoundingClientRect();
            const leftPos = size.left + window.pageXOffset - tooltip.offsetWidth / 2 + size.width / 2;
            const topPos = size.bottom + window.pageYOffset - tooltip.offsetHeight - 2 * size.height;

            tooltip.style.top = `${topPos}px`;
            tooltip.style.left = `${leftPos}px`;
        });

        day.addEventListener("mouseleave", () => {
            tooltip.classList.remove("is-visible");
        });
    });
}


/**
 * GitHubCalendar
 * Brings the contributions calendar from GitHub (provided username) into your page.
 *
 * @name GitHubCalendar
 * @function
 * @param {String|HTMLElement} container The calendar container (query selector or the element itself).
 * @param {String} username The GitHub username.
 * @param {Object} options An object containing the following fields:
 *
 *    - `summary_text` (String): The text that appears under the calendar (defaults to: `"Summary of
 *      pull requests, issues opened, and commits made by <username>"`).
 *    - `proxy` (Function): A function that receives as argument the username (string) and should return a promise resolving the HTML content of the contributions page.
 *      The default is using @Bloggify's APIs.
 *    - `global_stats` (Boolean): If `false`, the global stats (total, longest and current streaks) will not be calculated and displayed. By default this is enabled.
 *    - `responsive` (Boolean): If `true`, the graph is changed to scale with the container. Custom CSS should be applied to the element to scale it appropriately. By default this is disabled.
 *    - `tooltips` (Boolean): If `true`, tooltips will be shown when hovered over calendar days. By default this is disabled.
 *    - `cache` (Number) The cache time in seconds.
 *
 * @return {Promise} A promise returned by the `fetch()` call.
 */
module.exports = function GitHubCalendar(container, username, options) {

    container = $(container);

    options = options || {};
    options.summary_text = options.summary_text || `Summary of pull requests, issues opened, and commits made by <a href="https://github.com/${username}" target="blank">@${username}</a>`;
    options.cache = (options.cache || (24 * 60 * 60)) * 1000;

    if (options.global_stats === false) {
        container.style.minHeight = "175px";
    }

    const cacheKeys = {
        content: `gh_calendar_content.${username}`,
        expire_at: `gh_calendar_expire.${username}`
    };

    // We need a proxy for CORS
    options.proxy = options.proxy || (username => {
        return fetch(`https://api.bloggify.net/gh-calendar/?username=${username}`).then(r => r.text());
    });

    options.getCalendar = options.getCalendar || (username => {
        if (options.cache && Date.now() < +localStorage.getItem(cacheKeys.expire_at)) {
            const content = localStorage.getItem(cacheKeys.content);
            if (content) {
                return Promise.resolve(content);
            }
        }

        return options.proxy(username).then(body => {
            if (options.cache) {
                localStorage.setItem(cacheKeys.content, body);
                localStorage.setItem(cacheKeys.expire_at, Date.now() + options.cache);
            }
            return body;
        });
    });

    let fetchCalendar = () => options.getCalendar(username).then(body => {
        let div = document.createElement("div");
        div.innerHTML = body;
    
        // Extract the contribution data directly from the table structure
        let contributions = Array.from(div.querySelectorAll(".ContributionCalendar-day")).map(day => {
            return {
                date: day.getAttribute("data-date"),
                count: parseInt(day.querySelector(".sr-only").textContent.split(" ")[0], 10) || 0
            };
        });
    
        // Process and display the contributions in the container
        contributions.forEach(contribution => {
            let contribElem = document.createElement("div");
            contribElem.textContent = `${contribution.date}: ${contribution.count} contributions`;
            container.appendChild(contribElem);
        });
    
        let currentStreakInfo = parsed.current_streak
                                  ? `${formatoid(parsed.current_streak_range[0], DATE_FORMAT2)} &ndash; ${formatoid(parsed.current_streak_range[1], DATE_FORMAT2)}`
                                  : parsed.last_contributed
                                  ? `Last contributed in ${formatoid(parsed.last_contributed, DATE_FORMAT2)}.`
                                  : "Rock - Hard Place";
        let longestStreakInfo = parsed.longest_streak
                                  ? `${formatoid(parsed.longest_streak_range[0], DATE_FORMAT2)} &ndash; ${formatoid(parsed.longest_streak_range[1], DATE_FORMAT2)}`
                                  : parsed.last_contributed
                                  ? `Last contributed in ${formatoid(parsed.last_contributed, DATE_FORMAT2)}.`
                                  : "Rock - Hard Place";
    
        // The following sections seem to be about rendering the parsed contributions into some sort of summary columns
        let firstCol = $("<div>", {
            "class": "contrib-column contrib-column-first table-column",
            html: `<span class="text-muted">Contributions in the last year</span>
                   <span class="contrib-number">${parsed.last_year} total</span>
                   <span class="text-muted">${formatoid(addSubtractDate.add(addSubtractDate.subtract(new Date(), 1, "year"), 1, "day"), DATE_FORMAT1)} &ndash; ${formatoid(new Date(), DATE_FORMAT1)}</span>`
        });
        let secondCol = $("<div>", {
            "class": "contrib-column table-column",
            html: `<span class="text-muted">Longest streak</span>
                   <span class="contrib-number">${printDayCount(parsed.longest_streak)}</span>
                   <span class="text-muted">${longestStreakInfo}</span>`
        });
        let thirdCol = $("<div>", {
            "class": "contrib-column table-column",
            html: `<span class="text-muted">Current streak</span>
                   <span class="contrib-number">${printDayCount(parsed.current_streak)}</span>
                   <span class="text-muted">${currentStreakInfo}</span>`
        });
    
        cal.appendChild(firstCol);
        cal.appendChild(secondCol);
        cal.appendChild(thirdCol);
    
        container.innerHTML = cal.innerHTML;
    
        // If options includes tooltips, add tooltips listeners to SVG
        if (options.tooltips === true) {
            addTooltips(container);
        }
    }).catch(e => console.error(e));
    
    return fetchCalendar();
    
}
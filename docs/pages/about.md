---
layout: page
title: About
permalink: /about/
weight: 3
---

# **About Me**

Hi I am **{{ site.author.name }}** :wave:,<br>
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

<div class="row">
{% include about/skills.html title="Programming" source=site.data.programming-skills %}
{% include about/skills.html title="Other" source=site.data.other-skills %}
{% include about/skills.html title="Certifications" source=site.data.certifications %}

</div>
<h2 class="mb-3">Experience</h2>

<div class="row">
{% include about/timeline.html %}
</div>

<h2 class="mb-3">Education</h2>

<div class="row">
{% include about/timeline_education.html %}
</div>
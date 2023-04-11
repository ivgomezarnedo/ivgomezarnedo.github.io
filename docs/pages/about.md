---
layout: page
title: About
permalink: /about/
weight: 3
---

# **About Me**

Hi I am **{{ site.author.name }}** :wave:,<br>
I'm a Software Engineer with 6+ years of experience, specialized in Data Engineering processes.
<br>
As the saying goes, "When one teaches, two learn" - I truly believe in [sharing my knowledge](/blog) from working on projects and overcoming challenges, benefiting both others and myself.
<br>Accustomed to the dynamic and fast-paced environment of startups, I have developed the ability to adapt and effectively manage demanding workloads.
<br> Want to know more about me? Take a look to my [personal projects](/projects) or to my list of [books](https://www.goodreads.com/review/list/83766089) :blush:.
<div class="row">
{% include about/skills.html color="#28a745" title="Programming" source=site.data.programming-skills %}
{% include about/skills.html color="#28a745" title="Other" source=site.data.other-skills %}
{% include about/skills.html color="#28a745" title="Certifications" source=site.data.certifications %}

</div>
<h2 class="mb-3">Experience</h2>

<div class="row">
{% include about/timeline.html %}
</div>

<h2 class="mb-3">Education</h2>

<div class="row">
{% include about/timeline_education.html %}
</div>
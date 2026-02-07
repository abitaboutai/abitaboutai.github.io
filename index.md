---
layout: home
author_profile: false
---

Decision-useful writing for people building and shipping AI.

{% capture intro %}
  - title: "For builders"
    excerpt: "Playbooks, failure modes, and implementation details for long-context systems, RAG, agents, and evaluation."
    url: "/categories/"
    btn_label: "Browse posts"
    btn_class: "btn--primary"
  - title: "For product & leadership"
    excerpt: "Budgeting, governance, and rollout patterns that keep reliability and spend under control."
    url: "/llm/budgeting-and-planning-llm-spend-in-an-enterprise/"
    btn_label: "Start here"
    btn_class: "btn--primary"
  - title: "Paper → Product"
    excerpt: "Short briefs that translate high-attention papers into shippable features and system design choices."
    url: "/categories/"
    btn_label: "Coming next"
    btn_class: "btn--primary"
{% endcapture %}

{% include feature_row id="intro" type="center" %}

## Start here

**Budgeting and Planning LLM Spend in an Enterprise (Vendor‑Neutral)**  
A practical approach to forecasting, guardrails, attribution, and the engineering levers that change unit economics.

## What this blog covers

- Long-context systems (what breaks at scale)
- Self-hosted RAG (grounded answers, debugging)
- Agents (tool use, reliability, observability)
- Efficiency (latency, throughput, cost control)

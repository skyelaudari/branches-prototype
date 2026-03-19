import { useState, useCallback, useRef, useEffect } from "react";

const TRUNK_ID = "trunk";

const SEED_PROJECT = {
  id: TRUNK_ID, name: "European Family Vacation — Summer 2026", type: "trunk", parentId: null, mode: "chat", containerId: null, projectId: "vacation",
  contextEntries: [
    { id: "c1", label: "Family", content: "Family of 4: two adults (Skye, mid-30s; partner, early 30s), two kids (ages 7 and 4). Dual US/Italian citizenship (Skye)." },
    { id: "c2", label: "Budget & Dates", content: "Budget: ~$15K total for 3 weeks. Travel dates: mid-June to early July 2026." },
    { id: "c3", label: "Preferences", content: "Food, culture, history, beaches, kid-friendly activities, not overly touristy. Prefer apartments/villas over hotels. Mix of active exploration and downtime. Trains preferred over flying within Europe." },
    { id: "c4", label: "Destinations", content: "Considering: Rome, Amalfi Coast, Puglia, and possibly Sicily." },
  ],
  confirmedItems: [
    "Flying into Rome FCO on June 14, departing from Catania on July 5",
    "Rome: 4 nights (June 14-18), apartment in Trastevere booked via VRBO",
    "Amalfi base: Maiori, 5 nights (June 18-23)",
    "Transport from Rome to Amalfi: high-speed train to Salerno + private transfer (~€80-100)",
  ],
  messages: [
    { role: "user", content: "We're planning a 3-week family trip to Italy this summer. Family of 4 — me and my partner (both mid-30s), and our kids who are 7 and 4. We have dual US/Italian citizenship. Budget is around $15K. We're thinking Rome, Amalfi Coast, Puglia, and Sicily. Can you help me think about how to structure this?" },
    { role: "assistant", content: "Great trip — and three weeks gives you enough time to actually settle into each place rather than rushing through. Here's how I'd think about structuring it:\n\n## Suggested Flow\n\n**Rome (4 nights)** → **Amalfi Coast (5 nights)** → **Puglia (5-6 nights)** → **Sicily (5-6 nights)**\n\nThis moves south naturally and avoids backtracking. Rome is the best starting point since you're flying in, and it gives you a couple of days to adjust to the time zone before heading to more relaxed destinations. Ending in Sicily works well for a Catania departure.\n\n## Key Considerations\n\n- **Transportation between legs**: Train from Rome to the Amalfi area (Naples or Salerno) is straightforward. Amalfi to Puglia is trickier — likely a car or a combination of ferry and train. Puglia to Sicily could be a short flight from Bari or Brindisi to Catania, or a longer but scenic drive/ferry route.\n- **With kids 4 and 7**: You'll want to avoid more than 3-4 hours of travel between legs. Build in buffer days. Apartments and villas with pools will save you on days when the kids need downtime.\n- **Budget allocation**: Rome and Amalfi will eat more of the budget. Puglia and Sicily are significantly more affordable for accommodations and dining.\n\nWant me to start digging into any specific leg? I'd suggest tackling them in order since each one's dates depend on the previous." },
    { role: "user", content: "This is great. I've already booked flights — we're flying into Rome FCO on June 14 and out of Catania on July 5. I also found a great apartment in Trastevere for 4 nights (June 14-18) on VRBO. Let's set up separate workstreams for each remaining leg so we can research them independently without everything getting jumbled together." },
    { role: "assistant", content: "Smart approach. With Rome booked, you have June 18 through July 5 to fill across three legs — that's 17 nights.\n\nI'd suggest splitting the research into:\n\n- **Amalfi Coast Leg** — accommodations, kid-friendly towns, getting there from Rome, activities\n- **Puglia Leg** — trulli stays, beaches, food experiences, how to get there from Amalfi\n- **Sicily Leg** — east coast focus since you fly out of Catania, final leg logistics\n\nEach branch will have all your family context, budget, and the confirmed Rome details. When you book something in one leg, you can push that decision back up here so the other legs stay informed on dates and remaining budget.\n\nReady to start with any particular leg?" },
  ],
};

const SEED_BRANCHES = [
  {
    id: "amalfi", name: "Amalfi Coast Leg", type: "branch", parentId: TRUNK_ID, mode: "chat", containerId: null, projectId: "vacation",
    contextEntries: [{ id: "a1", label: "Focus", content: "Research and plan the Amalfi Coast segment. Kid-friendly accommodations (apartment or villa with pool preferred), best towns to base from with young kids, transportation from Rome, activities, and realistic day-trip planning given ages 4 and 7." }],
    confirmedItems: [
      "Amalfi base: Maiori, 5 nights (June 18-23)",
      "Transport from Rome to Amalfi: high-speed train to Salerno + private transfer (~€80-100)",
    ],
    messages: [
      { role: "user", content: "Let's figure out the Amalfi Coast leg. We'd be arriving from Rome on June 18. What towns would you recommend as a base with young kids?" },
      { role: "assistant", content: "For a family base on the Amalfi Coast with kids aged 4 and 7, I'd focus on three options:\n\n**Maiori** is probably your best bet. It has the longest real beach on the Amalfi Coast (most towns have tiny or rocky beaches), it's less crowded and more affordable than Positano or Amalfi town, and it has a flat waterfront promenade where the kids can run around. There are actual grocery stores and casual restaurants, which matters with young kids.\n\n**Minori** is Maiori's quieter neighbor. Smaller, very walkable, also has a decent beach. Slightly more charming but fewer restaurant options.\n\n**Ravello** is up in the hills — stunning views, cooler temperatures, quieter. But no beach access without driving down, which adds friction with kids. Better for a day trip than a base.\n\nI'd recommend Maiori for 5 nights (June 18-23). It's central enough for day trips to Positano, Amalfi town, and Ravello, but it's a real town where your family can settle in rather than feeling like you're navigating a tourist attraction.\n\nFor accommodations, you want an apartment or villa with a pool if possible. That's your release valve for afternoons when the kids are done with sightseeing. Budget around $150-200/night for a 2-bedroom with outdoor space in Maiori." },
      { role: "user", content: "Maiori sounds perfect. How do we get there from Rome?" },
      { role: "assistant", content: "Two solid options:\n\n**Option 1: Train + bus (budget-friendly)**\nRome Termini → Salerno by high-speed train (2.5 hours, ~€25-35/person). Then SITA bus from Salerno to Maiori (about 1 hour, very cheap). The bus ride along the coast is beautiful but winding — worth having motion sickness remedies for the 4-year-old.\n\n**Option 2: Train + private transfer (easier with kids)**\nSame train to Salerno, then a pre-booked private car from Salerno to Maiori (about 45 minutes, roughly €80-100). This is what I'd recommend with two young kids and luggage. No waiting for buses, no navigating schedules, and the driver can stop if someone needs a break.\n\nTotal travel time either way is about 3.5-4 hours door to door, which is manageable if you take the morning train and arrive by early afternoon. The kids can nap in the car for the last stretch.\n\nI'd avoid renting a car for the Amalfi Coast itself. The roads are narrow, parking is a nightmare, and the bus system between towns is fine for day trips." },
      { role: "user", content: "Let's go with the train + private transfer. Can you find some villa options in Maiori with a pool? 2 bedrooms, June 18-23." },
      { role: "assistant", content: "I'd recommend searching on these platforms for the best options:\n\n**VRBO/Airbnb**: Search \"Maiori villa pool 2 bedroom\" for June 18-23. Filter for Superhost/Premier Host status. In this area you'll find options ranging from €150-250/night.\n\n**Key things to look for:**\n- Pool or plunge pool (even a small one makes a huge difference with kids)\n- Outdoor terrace with shade — you'll eat breakfast and lunch outside most days\n- Walking distance to the beach and town center (under 15 minutes). Some villas are perched up hillsides with beautiful views but brutal stair access with a 4-year-old\n- Washing machine (5 nights with kids, you'll need it)\n- A/C — June on the Amalfi Coast will be warm\n\n**Budget check**: 5 nights at $175/night average = $875 for accommodations. That's reasonable against your $15K total. With Rome at roughly $800 (4 nights), you'd have about $13,300 remaining for Puglia, Sicily, and all transportation/food/activities across the full trip.\n\nOnce you find a place you like, share the listing and I can help evaluate whether the location works for your itinerary." },
    ],
  },
  {
    id: "puglia", name: "Puglia Leg", type: "branch", parentId: TRUNK_ID, mode: "chat", containerId: null, projectId: "vacation",
    contextEntries: [{ id: "p1", label: "Focus", content: "Research and plan the Puglia segment. Trulli accommodations in Valle d'Itria, getting there from Amalfi Coast, beaches for young kids, local food experiences, and how many nights to allocate." }],
    confirmedItems: [],
    messages: [
      { role: "user", content: "Okay, moving on to Puglia. We'll be coming from Maiori on June 23. What's the best way to get there and where should we stay?" },
      { role: "assistant", content: "Getting from the Amalfi Coast to Puglia is the trickiest transit of your trip, but very doable.\n\n## Getting There\n\nBest option: **Private transfer from Maiori to Salerno** (45 min, ~€80), then **train from Salerno to Bari or Lecce**. Salerno to Bari is about 3.5 hours on the Frecciarossa. From Bari, the Valle d'Itria (where you want to be) is about an hour south.\n\nAlternatively, you could do Salerno → Lecce (4-4.5 hours) if you want to base in southern Puglia. But with kids, I'd stick with the closer option.\n\nTotal travel day: about 5-6 hours. Plan for an early departure and a low-key arrival afternoon.\n\n## Where to Stay\n\nThe **Valle d'Itria** is the heart of Puglia for visitors, and for good reason. This is trulli country — those iconic white stone houses with conical roofs. Your kids will love them.\n\n**Ostuni** (the White City) is the most visually striking town and has good beach access (15-20 min drive to sandy beaches). Slightly more tourist infrastructure.\n\n**Cisternino** is quieter, more local, famous for its butcher shops where you pick your meat and they grill it for you. Less beach-convenient but more authentic.\n\n**Locorotondo** is a beautiful circular old town, very walkable, slightly more central to the Valle d'Itria.\n\nI'd recommend **Ostuni** as your base. It gives you the best mix of charm, beach access, and practical amenities for a family. 6 nights (June 23-29) would give you time to genuinely relax rather than rushing.\n\nAccommodations are significantly cheaper here — a trullo or masseria with a pool runs €100-150/night for a nice 2-bedroom." },
    ],
  },
  { id: "sicily", name: "Sicily Leg", type: "branch", parentId: TRUNK_ID, mode: "chat", containerId: null, projectId: "vacation", contextEntries: [{ id: "s1", label: "Focus", content: "Plan Sicily as the final leg before flying out of Catania. East coast (Catania/Syracuse/Taormina), kid-friendly beaches, accommodations, getting there from Puglia (ferry vs. flight)." }], confirmedItems: [], messages: [] },
];

const PROJECTS = [
  { id: "vacation", name: "European Family Vacation — Summer 2026", trunkId: TRUNK_ID },
  { id: "launch", name: "Contextual Onboarding — Q3 Launch", trunkId: "launch-trunk" },
];

const LAUNCH_PROJECT = {
  id: "launch-trunk", name: "Contextual Onboarding — Q3 Launch", type: "trunk", parentId: null, mode: "chat", containerId: null, projectId: "launch",
  contextEntries: [
    { id: "lt1", label: "Product Brief", content: "Launching contextual onboarding for the enterprise tier. The feature should adapt the onboarding experience based on user role, team size, and usage patterns rather than running all users through the same linear flow." },
    { id: "lt2", label: "Target Personas", content: "Enterprise customers onboarding new teams. Three segments identified in early research: power users who skip onboarding entirely, methodical learners who want guided step-by-step paths, and delegators who need to set up their team before engaging themselves." },
    { id: "lt3", label: "Success Metrics", content: "Primary: 30-day activation rate (target: 65%, current: 41%). Secondary: time-to-first-value, onboarding completion rate, 90-day retention by segment." },
    { id: "lt4", label: "Constraints", content: "Engineering capacity: 2 full-stack engineers + 1 ML engineer for 8 weeks. Must work within existing design system. Compliance review required for any data collection changes. Launch target: end of Q3." },
  ],
  confirmedItems: [
    "Three user segments validated through 12 customer interviews",
    "Adaptive approach approved by VP Product — no linear onboarding",
    "Power users identifiable by: skip welcome modal, navigate directly to settings or API docs within first 2 minutes",
    "Delegators identifiable by: first action is inviting team members or visiting admin panel",
    "All 5 competitors use linear onboarding — none adapt to user behavior mid-flow",
  ],
  messages: [
    { role: "user", content: "I'm kicking off a new feature for our enterprise product — contextual onboarding that adapts based on user behavior instead of running everyone through the same linear flow. We have 2 full-stack engineers and 1 ML engineer for 8 weeks, with a target launch at end of Q3. Current 30-day activation rate is 41% and we need to get it to 65%. Help me think about how to structure the workstreams for this." },
    { role: "assistant", content: "This is a well-scoped initiative. An adaptive onboarding system that routes users based on behavioral signals rather than self-reported roles is a strong differentiator — most enterprise products still run linear onboarding flows.\n\nHere's how I'd break down the workstreams:\n\n## Research\nStart here. You need to validate the user segments and identify the behavioral signals that predict which onboarding path someone needs. This informs everything downstream. Interview existing customers, analyze product analytics for early-session behavior patterns, and define the routing logic.\n\n## Competitive Analysis\nRun this in parallel with research. Map how the top 5 competitors handle onboarding. You're looking for gaps you can exploit and patterns to avoid. This feeds directly into positioning and also helps the spec by showing what the market considers table stakes.\n\n## Product Spec\nDepends on research and competitive findings. Define the adaptive logic, the distinct onboarding paths per segment, the signals that trigger routing, and the fallback experience. Must fit within your 8-week engineering constraint.\n\n## GTM Planning\nStarts after the spec stabilizes. Positioning, internal enablement for sales and CS, launch communications. The research segments should directly inform how you message this to prospects vs. existing customers.\n\nI'd suggest starting Research and Competitive Analysis this week, targeting spec work starting week 2-3 as findings come in, and GTM planning in weeks 4-5. That gives engineering weeks 3-8 for build, with the ML engineer starting on the routing model early.\n\nWant to set up workstreams for each of these?" },
    { role: "user", content: "Yes, let's create branches for each. We've already done 12 customer interviews and I've got some strong signal on the segments. Let me set that context in the research branch and work from there." },
  ],
};

const LAUNCH_BRANCHES = [
  {
    id: "launch-research", name: "User Research", type: "branch", parentId: "launch-trunk", mode: "chat", containerId: null, projectId: "launch",
    contextEntries: [{ id: "lr1", label: "Focus", content: "Synthesize findings from customer interviews. Identify behavioral patterns that predict which onboarding segment a user falls into. Define the signals the product can detect in the first session to route users to the right experience." }],
    confirmedItems: [
      "Power users identifiable by: skip welcome modal, navigate directly to settings or API docs within first 2 minutes",
      "Delegators identifiable by: first action is inviting team members or visiting admin panel",
      "2-minute behavioral detection window with intent question fallback for ambiguous users",
    ],
    messages: [
      { role: "user", content: "I've completed 12 customer interviews across our enterprise accounts. The three segments are really clear. Power users basically skip everything — they close the welcome modal immediately and go straight to settings or API docs. Methodical learners want to be walked through each feature systematically. And delegators don't engage with the product at all initially — their first action is always inviting their team or going to the admin panel. How should we think about routing signals for each?" },
      { role: "assistant", content: "These segments are clean and the behavioral signals are already pointing in the right direction. Let me map out a routing framework:\n\n## Power Users\n**Detection signals (first 2 minutes):**\n- Dismiss or close welcome modal within 5 seconds\n- Navigate to settings, API docs, or integrations page\n- Attempt keyboard shortcuts or use search\n\n**Onboarding response:** Get out of their way. Show a minimal \"quick reference\" card with keyboard shortcuts, API endpoints, and advanced settings. Let them self-serve. Any friction here and you'll lose them.\n\n## Methodical Learners\n**Detection signals:**\n- Read the welcome modal fully (dwell time >15 seconds)\n- Click through suggested first steps\n- Hover over tooltips, open help documentation\n\n**Onboarding response:** Guided tour with progressive disclosure. Show one feature at a time, let them complete a task before introducing the next. Include checkboxes or progress indicators — these users are motivated by completion.\n\n## Delegators\n**Detection signals:**\n- First click is \"Invite team\" or \"Team settings\" or admin panel\n- Visit billing/subscription page early\n- Don't interact with core product features in first session\n\n**Onboarding response:** Team setup wizard first. Help them configure roles, permissions, and invitations. Only after their team is set up, offer a personal onboarding path. These users need to feel their team is taken care of before they'll invest in learning the product themselves.\n\n## Fallback\nUsers who don't exhibit clear signals within the first 2 minutes get a brief intent question: \"What brings you here today?\" with three options that map to the segments. This is your safety net — it should catch <20% of users if the behavioral routing works well.\n\nThe ML engineer should start building the classification model now. Two minutes of behavioral data is enough signal, and you can refine the thresholds with A/B testing post-launch." },
      { role: "user", content: "This is strong. The 2-minute detection window with the intent question fallback is the right approach. Let me propagate the key signals up to the project so the spec branch has them." },
    ],
  },
  {
    id: "launch-competitive", name: "Competitive Analysis", type: "branch", parentId: "launch-trunk", mode: "chat", containerId: null, projectId: "launch",
    contextEntries: [{ id: "lc1", label: "Focus", content: "Analyze onboarding experiences of top 5 competitors in the enterprise collaboration space. Identify gaps and opportunities for differentiation." }],
    confirmedItems: [
      "All 5 competitors use linear onboarding — none adapt to user behavior mid-flow",
      "No competitor differentiates admin vs. end-user onboarding for enterprise accounts",
      "Biggest opportunity: implicit behavioral routing vs. explicit self-reported routing",
    ],
    messages: [
      { role: "user", content: "I need to map out how our top competitors handle enterprise onboarding. The main ones are Notion, Figma, Linear, Slack, and Asana. What does each do and where are the gaps?" },
      { role: "assistant", content: "Here's what each does and where they fall short:\n\n## Notion\nUses a template-based approach — asks what you're using Notion for (project management, docs, wiki) and pre-fills your workspace. It's the closest to adaptive, but the adaptation is based on a single self-reported question, not behavior. The onboarding doesn't adjust once you're in the product.\n\n## Figma\nVery minimal onboarding. Drops you into a tutorial file and lets you learn by doing. Works well for designers who are already tool-savvy, but enterprise admins setting up team accounts get essentially the same experience as individual users. No role-based differentiation.\n\n## Linear\nClean, fast onboarding focused on getting your first project created. Very opinionated about workflow (which is their brand). But completely linear — every user goes through the same steps regardless of role or intent.\n\n## Slack\nPrimarily channel and team setup. Good for the delegator persona but offers almost nothing for power users or methodical learners. The onboarding is team-centric, not user-centric.\n\n## Asana\nMost comprehensive but also most bloated. Multi-step wizard with project templates. Tries to serve everyone and ends up being too long for power users and too shallow for complex setups.\n\n## Key Gaps\n\n**No one adapts mid-flow.** Every competitor makes a routing decision at the start (if at all) and then runs a fixed sequence. If someone's behavior changes or the initial routing was wrong, there's no correction mechanism.\n\n**No one differentiates admin vs. end user onboarding.** Enterprise accounts need both — the person setting up the account has completely different needs from the team members they're inviting.\n\n**No one uses behavioral signals.** Routing is always based on explicit questions (\"What's your role?\") rather than observed behavior. This is your biggest opportunity: implicit routing feels seamless, explicit routing feels like a form." },
      { role: "user", content: "The mid-flow adaptation point is really interesting. None of them adjust once you're in. Let me propagate the main competitive finding." },
    ],
  },
  { id: "launch-spec", name: "Product Spec", type: "branch", parentId: "launch-trunk", mode: "chat", containerId: null, projectId: "launch", contextEntries: [{ id: "ls1", label: "Focus", content: "Define the product specification for contextual onboarding. Should incorporate research findings on user segments and competitive gaps. Must fit within engineering constraints defined at the project level." }], confirmedItems: [], messages: [] },
  { id: "launch-gtm", name: "GTM Planning", type: "branch", parentId: "launch-trunk", mode: "chat", containerId: null, projectId: "launch", contextEntries: [{ id: "lg1", label: "Focus", content: "Develop go-to-market strategy for the contextual onboarding launch. Positioning, messaging, enablement materials for sales and CS teams, launch communications." }], confirmedItems: [], messages: [] },
];

function getAncestorChain(nodeId, nodes) {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node || !node.parentId) return [];
  const chain = [];
  let cur = nodes.find((n) => n.id === node.parentId);
  while (cur) { chain.unshift(cur); cur = cur.parentId ? nodes.find((n) => n.id === cur.parentId) : null; }
  return chain;
}

function buildSystemPrompt(node, ancestors) {
  let p = "You are Claude, assisting with a project. Respond with clean formatting using markdown: use **bold** for emphasis, ## for section headers when appropriate, and - for bullet lists. Keep responses practical and actionable.\n\n";
  if (ancestors.length > 0) {
    p += "## Project Context\n";
    ancestors.forEach((a) => {
      (a.contextEntries || []).forEach((e) => { p += "\n" + e.label + ": " + e.content + "\n"; });
      if ((a.confirmedItems || []).length > 0) p += "\nConfirmed:\n" + a.confirmedItems.map((i) => "- " + i).join("\n") + "\n";
    });
  }
  if (node.type === "trunk") {
    (node.contextEntries || []).forEach((e) => { p += "\n" + e.label + ": " + e.content + "\n"; });
  } else {
    p += "\n## This Branch: " + node.name + "\n";
    (node.contextEntries || []).forEach((e) => { p += "\n" + e.label + ": " + e.content + "\n"; });
  }
  if ((node.confirmedItems || []).length > 0) {
    p += "\nConfirmed here:\n" + node.confirmedItems.map((i) => "- " + i).join("\n") + "\n";
  }
  p += "\nBe helpful, concise, and specific.";
  // Context suggestion instructions — applies to all modes
  p += '\n\nIMPORTANT: When your response contains key decisions, confirmed facts, important findings, or actionable conclusions that would benefit other conversations in this project, wrap each one in <<SUGGEST_CONTEXT>> tags. These should be concise, standalone statements (not full paragraphs). Examples:\n- <<SUGGEST_CONTEXT>>Rome dates confirmed: June 14-18, Trastevere apartment booked via VRBO<<SUGGEST_CONTEXT>>\n- <<SUGGEST_CONTEXT>>Budget split: 40% accommodation, 25% transport, 20% food, 15% activities<<SUGGEST_CONTEXT>>\nOnly suggest items that represent decisions, confirmed plans, key constraints, or important findings — not routine discussion points. Aim for 0-3 suggestions per response. Do NOT suggest context that is already listed in the project context or confirmed items above.';
  if (node.mode === "cowork") {
    p += "\n\nYou have access to web search and document creation. When the user asks about current prices, availability, reviews, specific venues, or anything that benefits from live data, use the web_search tool to find relevant information. Synthesize the results into a clear, actionable response. Cite sources where appropriate.";
    p += "\n\nYou can also create professional documents: PowerPoint presentations (.pptx), Excel spreadsheets (.xlsx), Word documents (.docx), and PDFs. When the user requests a document, create it using your code execution environment.";
  } else if (node.type === "branch") {
    p += '\n\nYou are in Chat mode without web search. If the user asks for something that would benefit from live web data (current prices, availability, reviews, bookings, specific venue info), provide a helpful answer from your knowledge, then end your response by wrapping a single short question (asking if they\'d like you to search for more specific/current info) inside these markers: <<COWORK_Q>>your question here<<SUGGEST_COWORK>>. Do NOT mention "Cowork mode", "toggle", or "web search" in your text — the interface will handle that. The question should be specific to their request (e.g. "Want me to find current availability and pricing for family-friendly villas in Ravello for your June dates?").';
  }
  return p;
}

// --- Lightweight Markdown Renderer ---
function renderMarkdown(text, onLinkClick) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={"ul-" + elements.length} style={{ margin: "8px 0", paddingLeft: 20 }}>{listItems}</ul>);
      listItems = [];
    }
  };

  const renderInline = (str) => {
    const parts = [];
    let remaining = str;
    let key = 0;
    const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|(https?:\/\/[^\s<>]+))/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(remaining)) !== null) {
      if (match.index > lastIndex) parts.push(<span key={key++}>{remaining.slice(lastIndex, match.index)}</span>);
      if (match[2]) parts.push(<strong key={key++}><em>{match[2]}</em></strong>);
      else if (match[3]) parts.push(<strong key={key++}>{match[3]}</strong>);
      else if (match[4]) parts.push(<em key={key++}>{match[4]}</em>);
      else if (match[5]) parts.push(<code key={key++} style={{ background: "rgba(0,0,0,0.05)", padding: "1px 5px", borderRadius: 4, fontSize: "0.9em", fontFamily: '"SF Mono", "Fira Code", monospace' }}>{match[5]}</code>);
      else if (match[6]) {
        const fullMatch = match[6];
        const trailingMatch = fullMatch.match(/[.,;:!?)}\]]+$/);
        const url = trailingMatch ? fullMatch.slice(0, -trailingMatch[0].length) : fullMatch;
        const trailing = trailingMatch ? trailingMatch[0] : "";
        parts.push(<a key={key++} href={url} onClick={(e) => { e.preventDefault(); if (onLinkClick) onLinkClick(url); }} style={{ color: "#D97757", textDecoration: "underline", textDecorationColor: "rgba(217,119,87,0.4)", cursor: "pointer", wordBreak: "break-all" }}>{url}</a>);
        if (trailing) parts.push(<span key={key++}>{trailing}</span>);
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < remaining.length) parts.push(<span key={key++}>{remaining.slice(lastIndex)}</span>);
    return parts.length > 0 ? parts : [remaining];
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.match(/^#{1,3}\s/)) {
      flushList();
      const level = line.match(/^(#{1,3})\s/)[1].length;
      const content = line.replace(/^#{1,3}\s/, "");
      const sizes = { 1: 16, 2: 15, 3: 14 };
      elements.push(
        <div key={"h-" + i} style={{ fontSize: sizes[level], fontWeight: 600, color: "#1A1915", marginTop: elements.length > 0 ? 16 : 0, marginBottom: 6, lineHeight: 1.35 }}>
          {renderInline(content)}
        </div>
      );
    } else if (line.match(/^\s*[-*]\s/)) {
      const content = line.replace(/^\s*[-*]\s/, "");
      listItems.push(
        <li key={"li-" + i} style={{ fontSize: 14, lineHeight: 1.65, color: "#1A1915", marginBottom: 3 }}>
          {renderInline(content)}
        </li>
      );
    } else if (line.match(/^\s*\d+\.\s/)) {
      flushList();
      const content = line.replace(/^\s*\d+\.\s/, "");
      if (!listItems._ordered) { listItems = []; listItems._ordered = true; }
      listItems.push(
        <li key={"oli-" + i} style={{ fontSize: 14, lineHeight: 1.65, color: "#1A1915", marginBottom: 3 }}>
          {renderInline(content)}
        </li>
      );
    } else if (line.trim() === "") {
      flushList();
      if (elements.length > 0) {
        elements.push(<div key={"br-" + i} style={{ height: 8 }} />);
      }
    } else {
      flushList();
      elements.push(
        <p key={"p-" + i} style={{ fontSize: 14, lineHeight: 1.65, color: "#1A1915", margin: "0 0 4px 0" }}>
          {renderInline(line)}
        </p>
      );
    }
    i++;
  }
  flushList();
  return elements;
}

// --- Design Tokens ---
const t = {
  bg: "#FAFAF8", surface: "#FFFFFF", surfaceMuted: "#F5F4F0", border: "#E8E5DE", borderSubtle: "#EFECE6",
  text: "#1A1915", textSecondary: "#6B6560", textTertiary: "#9C9690", textPlaceholder: "#B8B3AC",
  accent: "#D97757", accentSoft: "rgba(217,119,87,0.08)", accentBorder: "rgba(217,119,87,0.25)", accentText: "#C4623E",
  green: "#3D8B5E", greenSoft: "rgba(61,139,94,0.07)", greenBorder: "rgba(61,139,94,0.2)",
  amber: "#A07D3A", amberSoft: "rgba(160,125,58,0.07)", amberBorder: "rgba(160,125,58,0.18)",
  white: "#FFFFFF",
  shadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
  shadowLg: "0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
  radius: "10px", radiusSm: "7px",
};

const COWORK_TOOLS = [
  {
    name: "web_search",
    description: "Search the web for current information. Use this when the user asks about prices, availability, reviews, current events, or anything that benefits from up-to-date web data.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "The search query to find relevant information" },
      },
      required: ["query"],
    },
  },
];

const SKILLS_CONFIG = {
  skills: [
    { type: "anthropic", skill_id: "pptx", version: "latest" },
    { type: "anthropic", skill_id: "xlsx", version: "latest" },
    { type: "anthropic", skill_id: "docx", version: "latest" },
    { type: "anthropic", skill_id: "pdf", version: "latest" },
  ],
};

const CODE_EXECUTION_TOOL = { type: "code_execution_20250825", name: "code_execution" };

const FILE_TYPE_COLORS = {
  pptx: "#C4623E", xlsx: "#3D8B5E", docx: "#3B6BB5", pdf: "#C0392B",
};

function FileCard({ file }) {
  const ext = (file.filename || "").split(".").pop()?.toLowerCase() || "";
  const color = FILE_TYPE_COLORS[ext] || t.textSecondary;
  const displayName = file.filename || `file-${file.file_id.slice(0, 8)}`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `/api/files/${file.file_id}`;
    link.download = displayName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div onClick={handleDownload}
      style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 14px", background: t.surfaceMuted, border: "1px solid " + t.border, borderRadius: t.radiusSm, cursor: "pointer", transition: "all 0.15s" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = t.surface; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.surfaceMuted; }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 8, background: color + "14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color, textTransform: "uppercase" }}>
        {ext || "?"}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: t.text, lineHeight: 1.3 }}>{displayName}</div>
        <div style={{ fontSize: 11, color: t.textTertiary, marginTop: 1 }}>Click to download</div>
      </div>
      <span style={{ fontSize: 14, color: t.textTertiary, marginLeft: 4 }}>↓</span>
    </div>
  );
}

function LoadingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "16px 0", color: t.textTertiary, fontSize: 13 }}>
      <style>{"@keyframes bpulse{0%,80%,100%{opacity:.25}40%{opacity:.8}}"}</style>
      {[0, 0.2, 0.4].map((d, i) => (<div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: t.accent, animation: "bpulse 1.4s ease-in-out " + d + "s infinite" }} />))}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,25,21,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
      <div style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 14, padding: 28, width: 480, maxWidth: "90vw", maxHeight: "80vh", overflowY: "auto", boxShadow: t.shadowLg }} onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function ContextEditor({ entries, onChange, label }) {
  const [adding, setAdding] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [labeling, setLabeling] = useState(null); // entry id currently being auto-labeled
  const entriesRef = useRef(entries);
  entriesRef.current = entries;
  const addEntry = () => {
    if (!newContent.trim()) return;
    const content = newContent.trim();
    const entryId = "ce-" + Date.now();
    onChange([...entries, { id: entryId, label: "Labeling...", content }]);
    setNewContent(""); setAdding(false);
    setLabeling(entryId);
    fetch("/api/name", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: content }),
    }).then((r) => r.json()).then((data) => {
      const autoLabel = data.name || content.substring(0, 30);
      onChange(entriesRef.current.map((x) => x.id === entryId ? { ...x, label: autoLabel } : x));
      setLabeling(null);
    }).catch(() => {
      onChange(entriesRef.current.map((x) => x.id === entryId ? { ...x, label: content.substring(0, 30) } : x));
      setLabeling(null);
    });
  };
  const cancel = () => { setNewContent(""); setAdding(false); };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: t.textTertiary, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</div>
        {!adding && <button onClick={() => setAdding(true)} style={{ padding: "4px 10px", borderRadius: t.radiusSm, border: "1px solid " + t.border, background: "transparent", color: t.textSecondary, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>+ Add context</button>}
      </div>
      {entries.map((entry) => (
        <div key={entry.id} style={{ background: t.surfaceMuted, border: "1px solid " + t.borderSubtle, borderRadius: t.radiusSm, padding: "10px 12px", marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ color: labeling === entry.id ? t.textTertiary : t.text, fontSize: 12, fontWeight: 600, fontStyle: labeling === entry.id ? "italic" : "normal" }}>{entry.label}</span>
            <button onClick={() => onChange(entries.filter((x) => x.id !== entry.id))} style={{ background: "transparent", border: "none", color: t.textTertiary, cursor: "pointer", fontSize: 13, padding: "0 4px" }}>×</button>
          </div>
          <textarea value={entry.content} onChange={(e) => onChange(entries.map((x) => x.id === entry.id ? { ...x, content: e.target.value } : x))} style={{ width: "100%", background: "transparent", border: "none", color: t.textSecondary, fontSize: 13, outline: "none", resize: "vertical", fontFamily: t.font, lineHeight: 1.55, minHeight: 28, padding: 0, boxSizing: "border-box" }} />
        </div>
      ))}
      {adding && (
        <div style={{ background: t.surface, border: "1px solid " + t.accentBorder, borderRadius: t.radiusSm, padding: 12, marginBottom: 6 }}>
          <textarea placeholder="Add context, instructions, notes, links..." value={newContent} onChange={(e) => setNewContent(e.target.value)} autoFocus style={{ width: "100%", background: "transparent", border: "none", color: t.textSecondary, fontSize: 13, outline: "none", resize: "vertical", fontFamily: t.font, lineHeight: 1.55, minHeight: 48, padding: 0, boxSizing: "border-box" }} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 8 }}>
            <button onClick={cancel} style={{ padding: "5px 12px", borderRadius: t.radiusSm, border: "1px solid " + t.border, background: "transparent", color: t.textSecondary, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
            <button onClick={addEntry} style={{ padding: "5px 12px", borderRadius: t.radiusSm, border: "none", background: t.accent, color: t.white, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Add</button>
          </div>
        </div>
      )}
      {entries.length === 0 && !adding && <div style={{ fontSize: 13, color: t.textPlaceholder, padding: "8px 0" }}>No context added yet.</div>}
    </div>
  );
}

function PasscodeGate({ children }) {
  const [authState, setAuthState] = useState("checking"); // checking | gate | authenticated
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) setAuthState("authenticated");
        else if (data.gateEnabled) setAuthState("gate");
        else setAuthState("authenticated");
      })
      .catch(() => setAuthState("authenticated")); // If auth endpoint fails, allow access
  }, []);

  const submit = () => {
    if (!passcode.trim()) return;
    setError(null);
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: passcode.trim() }),
    })
      .then((r) => {
        if (r.ok) setAuthState("authenticated");
        else setError("Incorrect passcode");
      })
      .catch(() => setError("Connection error"));
  };

  if (authState === "checking") {
    return (
      <div style={{ background: t.bg, color: t.text, fontFamily: t.font, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 13, color: t.textTertiary }}>Loading...</div>
      </div>
    );
  }

  if (authState === "gate") {
    return (
      <div style={{ background: t.bg, color: t.text, fontFamily: t.font, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 340, textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: t.text, marginBottom: 4 }}>Branches</div>
          <div style={{ fontSize: 13, color: t.textTertiary, marginBottom: 24 }}>Enter passcode to continue</div>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="Passcode"
            autoFocus
            style={{
              width: "100%", padding: "11px 14px", fontSize: 14, fontFamily: t.font,
              background: t.surfaceMuted, border: "1px solid " + t.border, borderRadius: t.radius,
              color: t.text, outline: "none", boxSizing: "border-box", marginBottom: 12,
            }}
            onFocus={(e) => e.target.style.borderColor = t.accentBorder}
            onBlur={(e) => e.target.style.borderColor = t.border}
          />
          {error && <div style={{ fontSize: 13, color: "#c0392b", marginBottom: 12 }}>{error}</div>}
          <button onClick={submit} style={{
            width: "100%", padding: "11px", borderRadius: t.radius, border: "none",
            background: t.accent, color: t.white, fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>Enter</button>
        </div>
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <PasscodeGate>
      <BranchesPrototype />
    </PasscodeGate>
  );
}

function BranchesPrototype() {
  const [nodes, setNodes] = useState([SEED_PROJECT, ...SEED_BRANCHES, LAUNCH_PROJECT, ...LAUNCH_BRANCHES]);
  const [projects, setProjects] = useState(PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState("vacation");
  const [activeId, setActiveId] = useState(TRUNK_ID);
  const [input, setInput] = useState("");
  const [loadingNodeId, setLoadingNodeId] = useState(null);
  const [modal, setModal] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [toast, setToast] = useState(null);
  const [popover, setPopover] = useState(null);
  const [hoveredMsg, setHoveredMsg] = useState(null);
  const [copiedMsg, setCopiedMsg] = useState(null);
  const [linkConfirm, setLinkConfirm] = useState(null);
  const [appLoading, setAppLoading] = useState(true);
  const [sidebarMenu, setSidebarMenu] = useState(null);
  const [renaming, setRenaming] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contextBarOpen, setContextBarOpen] = useState(false);
  const msgRef = useRef(null);
  const chatInputRef = useRef(null);
  const dbEnabled = useRef(false);
  const isInitialLoad = useRef(true);
  const saveTimer = useRef(null);

  // Load state from DB on mount (or fall back to seed data)
  useEffect(() => {
    fetch("/api/state")
      .then((r) => r.json())
      .then((data) => {
        if (!data.useSeeds) {
          dbEnabled.current = true;
          if (data.projects && data.projects.length > 0) {
            setProjects(data.projects);
            setNodes(data.nodes || []);
            setActiveProjectId(data.projects[0].id);
            setActiveId(data.projects[0].trunkId);
          } else {
            // DB exists but empty — start fresh
            setProjects([]);
            setNodes([]);
            setActiveProjectId(null);
            setActiveId(null);
          }
        }
        // If useSeeds, keep the default seed state
        setAppLoading(false);
        requestAnimationFrame(() => { isInitialLoad.current = false; });
      })
      .catch(() => {
        setAppLoading(false);
        requestAnimationFrame(() => { isInitialLoad.current = false; });
      });
  }, []);

  // Auto-save to DB on state changes (debounced 1s)
  useEffect(() => {
    if (isInitialLoad.current || !dbEnabled.current) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects, nodes }),
      }).catch(console.error);
    }, 1000);
    return () => clearTimeout(saveTimer.current);
  }, [projects, nodes]);

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const active = nodes.find((n) => n.id === activeId);
  const ancestors = getAncestorChain(activeId, nodes);
  const parentNode = active ? nodes.find((n) => n.id === active.parentId) : null;
  const loading = loadingNodeId === activeId; // Show spinner only when viewing the loading branch

  useEffect(() => {
    if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }, [active?.messages?.length, loadingNodeId]);

  useEffect(() => { setShowContext(false); setPopover(null); }, [activeId]);

  const showToast = (text) => { setToast(text); setTimeout(() => setToast(null), 3000); };

  const propagateItem = useCallback((text) => {
    if (!active || !active.parentId) return;
    const summary = text.length > 300 ? text.substring(0, 300) + "..." : text;
    setNodes((prev) => prev.map((n) => {
      if (n.id === activeId) return { ...n, confirmedItems: [...(n.confirmedItems || []), summary] };
      if (n.id === active.parentId) return { ...n, confirmedItems: [...(n.confirmedItems || []), summary] };
      return n;
    }));
    showToast(summary.length > 70 ? summary.substring(0, 70) + "..." : summary);
  }, [active, activeId]);

  // Text selection handler
  const handleMouseUpInMessages = useCallback(() => {
    if (active?.type === "trunk") return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      return; // don't dismiss on empty selection to avoid flicker
    }
    const text = selection.toString().trim();
    if (text.length < 3) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const container = msgRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    // Position relative to viewport, rendered in fixed position
    setPopover({
      text,
      top: rect.top - 40,
      left: rect.left + rect.width / 2 - 75,
    });
  }, [active?.type]);

  // Dismiss popover on click outside or scroll
  useEffect(() => {
    const dismiss = () => setPopover(null);
    const container = msgRef.current;
    if (container) container.addEventListener("scroll", dismiss);
    return () => { if (container) container.removeEventListener("scroll", dismiss); };
  }, [activeId]);

  // Close sidebar menu on click outside
  useEffect(() => {
    if (!sidebarMenu) return;
    const close = () => setSidebarMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [sidebarMenu]);

  const updateNode = (id, updates) => setNodes((prev) => prev.map((n) => n.id === id ? { ...n, ...updates } : n));

  const send = useCallback(async () => {
    if (!input.trim() || loadingNodeId) return;
    const txt = input.trim();
    const targetId = activeId; // Capture target so response lands even if user switches branches
    setInput("");
    const updated = nodes.map((n) => n.id === targetId ? { ...n, messages: [...n.messages, { role: "user", content: txt }] } : n);
    setNodes(updated);
    setLoadingNodeId(targetId);
    try {
      const nd = updated.find((n) => n.id === targetId);
      // Auto-name branch from first message via lightweight Haiku call
      if (nd.type === "branch" && nd.messages.length === 1 && nd.name === "New branch") {
        fetch("/api/name", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: txt }),
        }).then((r) => r.json()).then((data) => {
          const label = data.name || txt.substring(0, 40);
          setNodes((prev) => prev.map((n) => n.id === targetId && n.name === "New branch" ? { ...n, name: label } : n));
        }).catch(() => {
          setNodes((prev) => prev.map((n) => n.id === targetId && n.name === "New branch" ? { ...n, name: txt.substring(0, 40) } : n));
        });
      }
      const anc = getAncestorChain(targetId, updated);
      const sys = buildSystemPrompt(nd, anc);
      // Build messages, injecting search context from prior tool calls so Claude remembers raw results
      const apiMessages = [];
      for (const m of nd.messages) {
        apiMessages.push({ role: m.role, content: m.content });
        if (m._searchContext) {
          apiMessages.push({ role: "user", content: "[Search results from previous tool use for reference]\n" + m._searchContext });
          apiMessages.push({ role: "assistant", content: "Noted, I have the search results with URLs available for reference." });
        }
      }
      const requestBody = { model: "claude-sonnet-4-5-20250929", max_tokens: nd.mode === "cowork" ? 8192 : 1000, system: sys, messages: apiMessages };
      if (nd.mode === "cowork") {
        requestBody.tools = [...COWORK_TOOLS, CODE_EXECUTION_TOOL];
        requestBody.tool_choice = { type: "auto" };
        const containerConfig = { ...SKILLS_CONFIG };
        if (nd.containerId) containerConfig.id = nd.containerId;
        requestBody.container = containerConfig;
      }
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        const errMsg = data.error?.message || data.error || `API error (${res.status})`;
        console.error("API error:", data);
        setNodes((prev) => prev.map((n) => n.id === targetId ? { ...n, messages: [...n.messages, { role: "assistant", content: "Error: " + errMsg }] } : n));
        setLoadingNodeId(null);
        return;
      }
      let reply = data.content?.filter((b) => b.type === "text").map((b) => b.text).join("\n") || "Could not generate a response.";
      const toolCalls = data._toolCalls || null;
      const searchContext = data._searchContext || null;
      const files = data._files || null;
      const containerId = data._containerId || null;
      let coworkQuestion = null;
      const coworkMatch = reply.match(/<<COWORK_Q>>([\s\S]*?)<<(?:SUGGEST_COWORK|COWORK_Q)>>/);
      if (coworkMatch) {
        coworkQuestion = coworkMatch[1].trim();
        reply = reply.replace(/\s*<<COWORK_Q>>[\s\S]*?<<(?:SUGGEST_COWORK|COWORK_Q)>>\s*/g, "").trim();
      }
      // Extract suggested context items
      const suggestedContext = [];
      const ctxRegex = /<<SUGGEST_CONTEXT>>([\s\S]*?)<<SUGGEST_CONTEXT>>/g;
      let ctxMatch;
      while ((ctxMatch = ctxRegex.exec(reply)) !== null) {
        const item = ctxMatch[1].trim();
        if (item) suggestedContext.push(item);
      }
      reply = reply.replace(/\s*<<SUGGEST_CONTEXT>>[\s\S]*?<<SUGGEST_CONTEXT>>\s*/g, "").trim();
      setNodes((prev) => prev.map((n) => {
        if (n.id !== targetId) return n;
        const updated = { ...n, messages: [...n.messages, { role: "assistant", content: reply, _toolCalls: toolCalls, _searchContext: searchContext, _files: files || undefined, _suggestCowork: coworkQuestion || undefined, _suggestedContext: suggestedContext.length > 0 ? suggestedContext : undefined }] };
        if (containerId) updated.containerId = containerId;
        return updated;
      }));
    } catch (err) {
      setNodes((prev) => prev.map((n) => n.id === targetId ? { ...n, messages: [...n.messages, { role: "assistant", content: "Connection error. The prototype's context architecture is working — branch inheritance and propagation are functional." }] } : n));
    }
    setLoadingNodeId(null);
  }, [input, loadingNodeId, activeId, nodes]);

  // Handle "Switch to Cowork" button — keep existing conversation, switch mode, send a follow-up to search
  const handleSwitchToCowork = useCallback((msgIndex) => {
    const nd = nodes.find((n) => n.id === activeId);
    if (!nd) return;
    // Clear the _suggestCowork flag and switch to cowork mode
    setNodes((prev) => prev.map((n) => {
      if (n.id !== activeId) return n;
      const msgs = n.messages.map((m, i) => i === msgIndex ? { ...m, _suggestCowork: undefined } : m);
      return { ...n, mode: "cowork", messages: msgs };
    }));
    // Send a follow-up that triggers the search based on the prior conversation
    setInput("Yes, please search for that.");
    setTimeout(() => {
      document.querySelector("[data-send-btn]")?.click();
    }, 100);
  }, [activeId, nodes]);

  // Handle "Answer from knowledge" — ask Claude to answer without tools
  const handleAnswerFromKnowledge = useCallback((msgIndex) => {
    const nd = nodes.find((n) => n.id === activeId);
    if (!nd) return;
    // Clear the _suggestCowork flag on that message
    setNodes((prev) => prev.map((n) => {
      if (n.id !== activeId) return n;
      const msgs = n.messages.map((m, i) => i === msgIndex ? { ...m, _suggestCowork: undefined } : m);
      return { ...n, messages: msgs };
    }));
    setInput("Go ahead and give me your best answer from your knowledge, without web search.");
    setTimeout(() => {
      document.querySelector("[data-send-btn]")?.click();
    }, 50);
  }, [activeId, nodes]);

  const copyMessage = useCallback((text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMsg(index);
      setTimeout(() => setCopiedMsg(null), 1500);
    });
  }, []);
  const quickCreateBranch = (parentId) => {
    const id = "b-" + Date.now();
    const parent = nodes.find((n) => n.id === parentId);
    const projId = parent?.projectId || activeProjectId;
    setNodes((prev) => [...prev, { id, name: "New branch", type: "branch", parentId, mode: "chat", containerId: null, projectId: projId, contextEntries: [], confirmedItems: [], messages: [] }]);
    setActiveId(id);
    setSidebarMenu(null);
    setTimeout(() => chatInputRef.current?.focus(), 50);
  };

  const startRename = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) { setRenaming(nodeId); setRenameValue(node.name); setSidebarMenu(null); }
  };

  const commitRename = () => {
    if (renaming && renameValue.trim()) {
      updateNode(renaming, { name: renameValue.trim() });
      const node = nodes.find((n) => n.id === renaming);
      if (node?.type === "trunk") {
        setProjects((prev) => prev.map((p) => p.trunkId === renaming ? { ...p, name: renameValue.trim() } : p));
      }
    }
    setRenaming(null); setRenameValue("");
  };

  const requestDelete = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    setSidebarMenu(null);
    if (node.type === "trunk") {
      setDeleteConfirm({ nodeId, type: "project", sharedItems: [] });
      return;
    }
    const parent = nodes.find((n) => n.id === node.parentId);
    const sharedItems = (node.confirmedItems || []).filter((item) => (parent?.confirmedItems || []).includes(item));
    setDeleteConfirm({ nodeId, type: "branch", sharedItems });
  };

  const executeDelete = (removeSharedContext) => {
    if (!deleteConfirm) return;
    const { nodeId, type, sharedItems } = deleteConfirm;
    if (type === "project") {
      const node = nodes.find((n) => n.id === nodeId);
      const projId = node?.projectId;
      setNodes((prev) => prev.filter((n) => n.projectId !== projId));
      const remaining = projects.filter((p) => p.id !== projId);
      setProjects(remaining);
      if (remaining.length > 0) { setActiveProjectId(remaining[0].id); setActiveId(remaining[0].trunkId); }
      else { setActiveProjectId(null); setActiveId(null); }
    } else {
      const node = nodes.find((n) => n.id === nodeId);
      // Collect all descendant IDs to delete
      const getDescendants = (id) => {
        const children = nodes.filter((n) => n.parentId === id);
        return [id, ...children.flatMap((c) => getDescendants(c.id))];
      };
      const idsToDelete = new Set(getDescendants(nodeId));
      setNodes((prev) => {
        let result = prev;
        if (removeSharedContext && sharedItems.length > 0 && node) {
          result = result.map((n) => n.id === node.parentId ? { ...n, confirmedItems: (n.confirmedItems || []).filter((item) => !sharedItems.includes(item)) } : n);
        }
        return result.filter((n) => !idsToDelete.has(n.id));
      });
      if (activeId === nodeId && node) setActiveId(node.parentId);
    }
    setDeleteConfirm(null);
  };

  const promoteToProject = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node || node.type === "trunk") return;
    setSidebarMenu(null);
    const trunkId = "trunk-" + Date.now();
    const projId = "proj-" + Date.now();
    // Gather inherited context from the branch's ancestor chain
    const ancestors = getAncestorChain(nodeId, nodes);
    const inheritedContext = ancestors.flatMap((a) => a.contextEntries || []);
    const inheritedConfirmed = ancestors.flatMap((a) => a.confirmedItems || []);
    // Merge inherited + branch's own context (deduplicate confirmed items)
    const mergedContext = [...inheritedContext, ...(node.contextEntries || [])];
    const mergedConfirmed = [...new Set([...inheritedConfirmed, ...(node.confirmedItems || [])])];
    // Create new trunk with the branch's full state
    setNodes((prev) => [...prev, { id: trunkId, name: node.name, type: "trunk", parentId: null, mode: "chat", containerId: node.containerId || null, projectId: projId, contextEntries: mergedContext, confirmedItems: mergedConfirmed, messages: [...node.messages] }]);
    setProjects((prev) => [...prev, { id: projId, name: node.name, trunkId }]);
    setActiveProjectId(projId);
    setActiveId(trunkId);
  };

  const createProject = () => {
    if (!projectName.trim()) return;
    const trunkId = "trunk-" + Date.now();
    const projId = "proj-" + Date.now();
    setNodes((prev) => [...prev, { id: trunkId, name: projectName.trim(), type: "trunk", parentId: null, mode: "chat", containerId: null, projectId: projId, contextEntries: [], confirmedItems: [], messages: [] }]);
    setProjects((prev) => [...prev, { id: projId, name: projectName.trim(), trunkId }]);
    setActiveProjectId(projId);
    setActiveId(trunkId);
    setProjectName(""); setModal(null);
  };

  function renderTree(parentId, depth) {
    const items = parentId === null ? nodes.filter((n) => n.id === activeProject.trunkId) : nodes.filter((n) => n.parentId === parentId);
    return items.map((node) => {
      const isActive = activeId === node.id;
      const isRenaming = renaming === node.id;
      const menuOpen = sidebarMenu === node.id;
      return (
        <div key={node.id} className="sb-item" style={{ position: "relative" }}>
          <div onClick={() => { if (!isRenaming) { setActiveId(node.id); setSidebarOpen(false); } }}
            style={{ padding: "10px 14px", paddingLeft: 14 + depth * 22, borderRadius: t.radiusSm, cursor: "pointer", background: isActive ? t.accentSoft : "transparent", marginBottom: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = t.surfaceMuted; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = isActive ? t.accentSoft : "transparent"; }}>
            <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
              {depth > 0 && <span style={{ color: t.textPlaceholder, marginRight: 8, fontSize: 11 }}>↳</span>}
              <div style={{ flex: 1, minWidth: 0 }}>
                {isRenaming ? (
                  <input value={renameValue} onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") { setRenaming(null); setRenameValue(""); } }}
                    onBlur={commitRename} autoFocus onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 13, fontWeight: 600, color: t.text, background: t.surfaceMuted, border: "1px solid " + t.accentBorder, borderRadius: 4, padding: "2px 6px", outline: "none", width: "100%", fontFamily: t.font, boxSizing: "border-box" }} />
                ) : (
                  <>
                    <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? t.text : t.textSecondary, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.name}</div>
                    {loadingNodeId === node.id ? (
                      <div style={{ fontSize: 11, color: t.accent, marginTop: 2 }}>thinking…</div>
                    ) : (node.messages.length > 0 || (node.confirmedItems || []).length > 0) && (
                      <div style={{ fontSize: 11, color: t.textTertiary, marginTop: 2 }}>
                        {node.messages.length > 0 && (node.messages.length + " msg" + (node.messages.length !== 1 ? "s" : ""))}
                        {node.messages.length > 0 && (node.confirmedItems || []).length > 0 && " · "}
                        {(node.confirmedItems || []).length > 0 && ((node.confirmedItems || []).length + " confirmed")}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {!isRenaming && (
              <button className={"sb-dots" + (menuOpen ? " sb-dots-active" : "")}
                onClick={(e) => { e.stopPropagation(); setSidebarMenu(menuOpen ? null : node.id); }}
                style={{ background: "transparent", border: "none", color: t.textTertiary, cursor: "pointer", fontSize: 13, padding: "0 4px", flexShrink: 0 }}>
                ···
              </button>
            )}
          </div>
          {menuOpen && (
            <div style={{ position: "absolute", right: 8, top: "100%", zIndex: 50, background: t.surface, border: "1px solid " + t.border, borderRadius: t.radiusSm, boxShadow: t.shadowLg, overflow: "hidden", minWidth: 120 }}>
              <button onClick={(e) => { e.stopPropagation(); startRename(node.id); }}
                style={{ display: "block", width: "100%", padding: "8px 14px", border: "none", background: "transparent", color: t.text, fontSize: 12, fontWeight: 500, cursor: "pointer", textAlign: "left" }}
                onMouseEnter={(e) => e.currentTarget.style.background = t.surfaceMuted} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>Rename</button>
              {node.type === "branch" && (
                <button onClick={(e) => { e.stopPropagation(); promoteToProject(node.id); }}
                  style={{ display: "block", width: "100%", padding: "8px 14px", border: "none", background: "transparent", color: t.text, fontSize: 12, fontWeight: 500, cursor: "pointer", textAlign: "left" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = t.surfaceMuted} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>Promote to Project</button>
              )}
              <button onClick={(e) => { e.stopPropagation(); requestDelete(node.id); }}
                style={{ display: "block", width: "100%", padding: "8px 14px", border: "none", background: "transparent", color: "#c0392b", fontSize: 12, fontWeight: 500, cursor: "pointer", textAlign: "left" }}
                onMouseEnter={(e) => e.currentTarget.style.background = t.surfaceMuted} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>Delete</button>
            </div>
          )}
          {renderTree(node.id, depth + 1)}
        </div>
      );
    });
  }

  const allInheritedConfirmed = ancestors.flatMap((a) => (a.confirmedItems || []));
  const allInheritedContextLabels = ancestors.flatMap((a) => (a.contextEntries || []).map((e) => e.label));

  // Loading screen while fetching state
  if (appLoading) {
    return (
      <div style={{ background: t.bg, color: t.text, fontFamily: t.font, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Branches</div>
          <div style={{ fontSize: 13, color: t.textTertiary }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: t.bg, color: t.text, fontFamily: t.font, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        .sb-item .sb-dots{opacity:0;transition:opacity .1s}.sb-item:hover .sb-dots,.sb-dots.sb-dots-active{opacity:.6}.sb-dots:hover{opacity:1!important}
        @media(max-width:768px){
          .sidebar-panel{position:fixed!important;left:0;top:0;bottom:0;z-index:100;width:300px!important;transform:translateX(-100%);transition:transform .25s ease;box-shadow:none!important}
          .sidebar-panel.sidebar-open{transform:translateX(0);box-shadow:4px 0 24px rgba(0,0,0,.15)!important}
          .sidebar-overlay{display:none;position:fixed;inset:0;z-index:99;background:rgba(0,0,0,.3)}
          .sidebar-overlay.sidebar-open{display:block}
          .mobile-menu-btn{display:flex!important}
          .main-header-title{font-size:15px!important}
          .main-header{padding:14px 16px 10px!important}
          .main-header-actions{gap:4px!important}
          .main-header-actions button{padding:5px 8px!important;font-size:11px!important}
          .msg-area{padding:16px 12px!important}
          .input-area{padding:10px 12px 14px!important}
          .context-panel{padding:14px 12px!important}
        }
        @media(min-width:769px){
          .mobile-menu-btn{display:none!important}
          .sidebar-overlay{display:none!important}
        }
      `}</style>
      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid " + t.border, display: "flex", alignItems: "center", gap: 10, flexShrink: 0, background: t.surface }}>
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ display: "none", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: t.text, fontSize: 20, cursor: "pointer", padding: "0 4px 0 0", lineHeight: 1 }}>
          ☰
        </button>
        <span style={{ fontSize: 16, fontWeight: 600, color: t.text, letterSpacing: "-0.01em" }}>Branches</span>
        <span style={{ fontSize: 11, fontWeight: 500, color: t.textTertiary }}>prototype</span>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        {/* Sidebar overlay for mobile */}
        <div className={"sidebar-overlay" + (sidebarOpen ? " sidebar-open" : "")} onClick={() => setSidebarOpen(false)} />
        {/* Sidebar */}
        <div className={"sidebar-panel" + (sidebarOpen ? " sidebar-open" : "")} style={{ width: 270, borderRight: "1px solid " + t.border, display: "flex", flexDirection: "column", flexShrink: 0, background: t.surface }}>
          {/* Project switcher */}
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid " + t.borderSubtle }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: t.textTertiary, letterSpacing: "0.04em", textTransform: "uppercase" }}>Projects</span>
              <button onClick={() => setModal("project")} style={{ padding: "3px 10px", borderRadius: t.radiusSm, border: "1px solid " + t.border, background: "transparent", color: t.textSecondary, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>+ New</button>
            </div>
            {projects.map((proj) => {
              const projMenuOpen = sidebarMenu === "proj-" + proj.id;
              const projRenaming = renaming === proj.trunkId;
              return (
                <div key={proj.id} className="sb-item" style={{ position: "relative" }}>
                  <div
                    onClick={() => { if (!projRenaming) { setActiveProjectId(proj.id); setActiveId(proj.trunkId); setSidebarOpen(false); } }}
                    style={{
                      padding: "7px 10px", borderRadius: t.radiusSm, cursor: "pointer", marginBottom: 2,
                      background: activeProjectId === proj.id ? t.accentSoft : "transparent",
                      display: "flex", alignItems: "center", gap: 8,
                    }}
                    onMouseEnter={(e) => { if (activeProjectId !== proj.id) e.currentTarget.style.background = t.surfaceMuted; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = activeProjectId === proj.id ? t.accentSoft : "transparent"; }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: activeProjectId === proj.id ? t.accent : t.border }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {projRenaming ? (
                        <input value={renameValue} onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") { setRenaming(null); setRenameValue(""); } }}
                          onBlur={commitRename} autoFocus onClick={(e) => e.stopPropagation()}
                          style={{ fontSize: 12, fontWeight: 600, color: t.text, background: t.surfaceMuted, border: "1px solid " + t.accentBorder, borderRadius: 4, padding: "2px 6px", outline: "none", width: "100%", fontFamily: t.font, boxSizing: "border-box" }} />
                      ) : (
                        <div style={{ fontSize: 12, fontWeight: activeProjectId === proj.id ? 600 : 500, color: activeProjectId === proj.id ? t.text : t.textSecondary, lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {proj.name}
                        </div>
                      )}
                    </div>
                    {!projRenaming && (
                      <button className={"sb-dots" + (projMenuOpen ? " sb-dots-active" : "")}
                        onClick={(e) => { e.stopPropagation(); setSidebarMenu(projMenuOpen ? null : "proj-" + proj.id); }}
                        style={{ background: "transparent", border: "none", color: t.textTertiary, cursor: "pointer", fontSize: 13, padding: "0 4px", flexShrink: 0 }}>
                        ···
                      </button>
                    )}
                  </div>
                  {projMenuOpen && (
                    <div style={{ position: "absolute", right: 8, top: "100%", zIndex: 50, background: t.surface, border: "1px solid " + t.border, borderRadius: t.radiusSm, boxShadow: t.shadowLg, overflow: "hidden", minWidth: 120 }}>
                      <button onClick={(e) => { e.stopPropagation(); startRename(proj.trunkId); setSidebarMenu(null); }}
                        style={{ display: "block", width: "100%", padding: "8px 14px", border: "none", background: "transparent", color: t.text, fontSize: 12, fontWeight: 500, cursor: "pointer", textAlign: "left" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = t.surfaceMuted} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>Rename</button>
                      <button onClick={(e) => { e.stopPropagation(); requestDelete(proj.trunkId); setSidebarMenu(null); }}
                        style={{ display: "block", width: "100%", padding: "8px 14px", border: "none", background: "transparent", color: "#c0392b", fontSize: 12, fontWeight: 500, cursor: "pointer", textAlign: "left" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = t.surfaceMuted} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>Delete</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Branch tree */}
          {activeProject && (
            <>
              <div style={{ padding: "10px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: t.textTertiary, letterSpacing: "0.04em", textTransform: "uppercase" }}>Branches</span>
                <button onClick={() => quickCreateBranch(activeProject.trunkId)} style={{ padding: "5px 12px", borderRadius: t.radiusSm, border: "1px solid " + t.border, background: "transparent", color: t.textSecondary, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>+ Branch</button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 8px" }}>{renderTree(null, 0)}</div>
            </>
          )}
        </div>

        {/* Main — empty state when no projects */}
        {!active && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: t.bg }}>
            <div style={{ textAlign: "center", maxWidth: 400 }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: t.text, marginBottom: 8 }}>Welcome to Branches</div>
              <div style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.6, marginBottom: 24 }}>
                Create your first project to get started. Each project has a trunk for shared context and branches for parallel workstreams.
              </div>
              <button onClick={() => setModal("project")} style={{ padding: "10px 20px", borderRadius: t.radius, border: "none", background: t.accent, color: t.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Create your first project</button>
            </div>
          </div>
        )}

        {/* Main */}
        {active && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: t.bg }}>
            {/* Header */}
            <div className="main-header" style={{ padding: "18px 28px 14px", flexShrink: 0, background: t.surface, borderBottom: "1px solid " + t.border }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="main-header-title" style={{ fontSize: 17, fontWeight: 600, color: t.text, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{active.name}</div>
                  <div style={{ fontSize: 13, color: t.textTertiary, marginTop: 3 }}>
                    {active.type === "trunk" ? "Project — shared with all branches" : "Branch of " + (parentNode?.name || "")}
                  </div>
                </div>
                <div className="main-header-actions" style={{ display: "flex", gap: 6, flexShrink: 0, marginTop: 2 }}>
                  <button onClick={() => setShowContext(!showContext)} style={{ padding: "6px 12px", borderRadius: t.radiusSm, border: "1px solid " + (showContext ? t.accentBorder : t.border), background: showContext ? t.accentSoft : "transparent", color: showContext ? t.accentText : t.textSecondary, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Context</button>
                  <button onClick={() => quickCreateBranch(activeProject.trunkId)} style={{ padding: "6px 12px", borderRadius: t.radiusSm, border: "1px solid " + t.border, background: "transparent", color: t.textSecondary, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>+ Branch</button>
                </div>
              </div>
              {/* Mode toggle */}
              {(active.type === "branch" || active.type === "trunk") && (
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", borderRadius: 20, border: "1px solid " + t.border, overflow: "hidden", background: t.surfaceMuted }}>
                    {["chat", "cowork"].map((m) => (
                      <button key={m} onClick={() => updateNode(activeId, { mode: m })}
                        style={{ padding: "4px 14px", fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer", transition: "all 0.15s", background: active.mode === m ? t.accent : "transparent", color: active.mode === m ? t.white : t.textSecondary }}>
                        {m === "chat" ? "Chat" : "Cowork"}
                      </button>
                    ))}
                  </div>
                  {active.mode === "cowork" && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <span style={{ fontSize: 11, color: t.accent, background: t.accentSoft, border: "1px solid " + t.accentBorder, padding: "3px 9px", borderRadius: 12 }}>web search</span>
                      <span style={{ fontSize: 11, color: t.accent, background: t.accentSoft, border: "1px solid " + t.accentBorder, padding: "3px 9px", borderRadius: 12 }}>docs</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Context panel */}
            {showContext && (
              <div className="context-panel" style={{ padding: "18px 28px", borderBottom: "1px solid " + t.border, background: t.surface, flexShrink: 0, maxHeight: 340, overflowY: "auto" }}>
                {ancestors.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: t.textTertiary, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Inherited</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {allInheritedContextLabels.map((label, i) => (
                        <span key={"il-" + i} style={{ fontSize: 12, color: t.amber, background: t.amberSoft, border: "1px solid " + t.amberBorder, padding: "3px 10px", borderRadius: 20 }}>{label}</span>
                      ))}
                      {allInheritedConfirmed.map((item, i) => (
                        <span key={"ic-" + i} style={{ fontSize: 12, color: t.amber, background: t.amberSoft, border: "1px solid " + t.amberBorder, padding: "3px 10px", borderRadius: 20 }}>{item.length > 45 ? item.substring(0, 45) + "..." : item}</span>
                      ))}
                    </div>
                  </div>
                )}
                <ContextEditor entries={active.contextEntries || []} onChange={(entries) => updateNode(activeId, { contextEntries: entries })} label={active.type === "trunk" ? "Project Context" : "Branch Context"} />
                {(active.confirmedItems || []).length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: t.textTertiary, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Confirmed</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {active.confirmedItems.map((item, i) => (
                        <span key={i} style={{ fontSize: 12, color: t.green, background: t.greenSoft, border: "1px solid " + t.greenBorder, padding: "3px 10px", borderRadius: 20 }}>{item.length > 60 ? item.substring(0, 60) + "..." : item}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Compact context bar — collapsible drawer */}
            {!showContext && (allInheritedConfirmed.length > 0 || (active.confirmedItems || []).length > 0) && (
              <div style={{ borderBottom: "1px solid " + t.borderSubtle, background: t.surface, flexShrink: 0 }}>
                <button onClick={() => setContextBarOpen(!contextBarOpen)}
                  style={{ width: "100%", padding: "6px 28px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: t.font }}>
                  <span style={{ fontSize: 10, color: t.textTertiary, transform: contextBarOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .15s", display: "inline-block" }}>▶</span>
                  <span style={{ fontSize: 11, color: t.textTertiary, fontWeight: 500 }}>
                    {allInheritedConfirmed.length + (active.confirmedItems || []).length} confirmed item{(allInheritedConfirmed.length + (active.confirmedItems || []).length) !== 1 ? "s" : ""}
                    {allInheritedConfirmed.length > 0 ? " (" + allInheritedConfirmed.length + " inherited)" : ""}
                  </span>
                </button>
                {contextBarOpen && (
                  <div style={{ padding: "0 28px 8px", display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {allInheritedConfirmed.map((item, i) => (
                      <span key={"ih-" + i} style={{ fontSize: 11, color: t.amber, background: t.amberSoft, border: "1px solid " + t.amberBorder, padding: "2px 8px", borderRadius: 16 }}>{item.length > 40 ? item.substring(0, 40) + "..." : item}</span>
                    ))}
                    {(active.confirmedItems || []).map((item, i) => (
                      <span key={i} style={{ fontSize: 11, color: t.green, background: t.greenSoft, border: "1px solid " + t.greenBorder, padding: "2px 8px", borderRadius: 16 }}>{item.length > 40 ? item.substring(0, 40) + "..." : item}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            <div ref={msgRef} onMouseUp={handleMouseUpInMessages} className="msg-area" style={{ flex: 1, overflowY: "auto", padding: "20px 28px", position: "relative" }}>
              {active.messages.length === 0 && !loading && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: t.textTertiary }}>
                    {active.type === "trunk" ? "Start planning your project" : "Start working on this branch"}
                  </div>
                  <div style={{ fontSize: 13, color: t.textPlaceholder, maxWidth: 400, textAlign: "center", lineHeight: 1.55 }}>
                    {active.type === "branch"
                      ? "Claude has the full project context. Select text from any response to save decisions to the project."
                      : "Add context, then start chatting. Decisions here flow to all branches."}
                  </div>
                </div>
              )}
              {active.messages.map((msg, i) => (
                <div key={i} style={{ marginBottom: 22, maxWidth: msg.role === "user" ? "75%" : "100%", marginLeft: msg.role === "user" ? "auto" : 0 }}>
                  <div style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: t.textTertiary }}>{msg.role === "user" ? "You" : "Claude"}</span>
                    {msg.role === "assistant" && active.type === "branch" && (
                      <button
                        onClick={() => propagateItem(msg.content)}
                        style={{ fontSize: 11, color: t.green, background: "transparent", border: "1px solid " + t.greenBorder, borderRadius: 14, padding: "2px 10px", cursor: "pointer", fontWeight: 500, opacity: 0.7, transition: "opacity 0.15s" }}
                        onMouseEnter={(e) => e.target.style.opacity = 1}
                        onMouseLeave={(e) => e.target.style.opacity = 0.7}
                      >
                        Save to project ↑
                      </button>
                    )}
                  </div>
                  {msg._toolCalls && msg._toolCalls.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                      {msg._toolCalls.map((tc, j) => (
                        <span key={j} style={{ fontSize: 11, color: t.accent, background: t.accentSoft, border: "1px solid " + t.accentBorder, padding: "2px 8px", borderRadius: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          {tc.tool === "web_search" ? "Searched: " + (tc.input?.query || "web") : tc.tool}
                        </span>
                      ))}
                    </div>
                  )}
                  {msg._files && msg._files.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                      {msg._files.map((file, j) => <FileCard key={j} file={file} />)}
                    </div>
                  )}
                  <div
                    onMouseEnter={() => setHoveredMsg(i)}
                    onMouseLeave={() => setHoveredMsg(null)}
                    style={{
                      padding: "14px 18px", borderRadius: 14, position: "relative",
                      background: msg.role === "user" ? t.surfaceMuted : t.surface,
                      border: "1px solid " + (msg.role === "user" ? t.borderSubtle : t.border),
                      boxShadow: msg.role === "assistant" ? t.shadow : "none",
                    }}
                  >
                    {msg.role === "assistant" ? renderMarkdown(msg.content, (url) => setLinkConfirm(url)) : (
                      <p style={{ fontSize: 14, lineHeight: 1.65, color: t.text, margin: 0 }}>{msg.content}</p>
                    )}
                    {hoveredMsg === i && (
                      <button
                        onClick={() => copyMessage(msg.content, i)}
                        style={{
                          position: "absolute", top: 8, right: 8,
                          background: t.surfaceMuted, border: "1px solid " + t.border,
                          borderRadius: 6, padding: "4px 6px", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 4,
                          color: copiedMsg === i ? t.green : t.textTertiary,
                          fontSize: 11, fontWeight: 500, transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = t.border; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = t.surfaceMuted; }}
                      >
                        {copiedMsg === i ? (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Copied</>
                        ) : (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg> Copy</>
                        )}
                      </button>
                    )}
                  </div>
                  {msg._suggestedContext && msg._suggestedContext.length > 0 && (
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                      {msg._suggestedContext.map((ctx, ci) => (
                        <div key={ci} style={{ background: t.greenSoft || "rgba(76,141,107,0.08)", border: "1px solid " + t.greenBorder, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>💡</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, lineHeight: 1.5, color: t.text, margin: 0 }}>{ctx}</p>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                            <button onClick={() => {
                              propagateItem(ctx);
                              // Remove this suggestion from the message
                              setNodes((prev) => prev.map((n) => {
                                if (n.id !== activeId) return n;
                                return { ...n, messages: n.messages.map((m, mi) => mi !== i ? m : { ...m, _suggestedContext: m._suggestedContext.filter((_, si) => si !== ci) }) };
                              }));
                            }}
                              style={{ padding: "5px 12px", borderRadius: 16, border: "none", background: t.green, color: t.white, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "opacity 0.15s" }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                            >Save to project ↑</button>
                            <button onClick={() => {
                              setNodes((prev) => prev.map((n) => {
                                if (n.id !== activeId) return n;
                                return { ...n, messages: n.messages.map((m, mi) => mi !== i ? m : { ...m, _suggestedContext: m._suggestedContext.filter((_, si) => si !== ci) }) };
                              }));
                            }}
                              style={{ padding: "5px 8px", borderRadius: 16, border: "1px solid " + t.border, background: "transparent", color: t.textTertiary, fontSize: 11, cursor: "pointer", transition: "color 0.15s" }}
                              onMouseEnter={(e) => e.currentTarget.style.color = t.text}
                              onMouseLeave={(e) => e.currentTarget.style.color = t.textTertiary}
                            >×</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {msg._suggestCowork && (
                    <div style={{ marginTop: 10, background: t.accentSoft, border: "1px solid " + t.accentBorder, borderRadius: 12, padding: "12px 16px" }}>
                      <p style={{ fontSize: 13, lineHeight: 1.55, color: t.text, margin: "0 0 10px 0" }}>{msg._suggestCowork}</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => handleSwitchToCowork(i)}
                          style={{ padding: "7px 14px", borderRadius: 20, border: "1px solid " + t.accentBorder, background: t.accent, color: t.white, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                        >Search with Cowork</button>
                        <button onClick={() => handleAnswerFromKnowledge(i)}
                          style={{ padding: "7px 14px", borderRadius: 20, border: "1px solid " + t.border, background: t.surface, color: t.textSecondary, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = t.surfaceMuted; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = t.surface; }}
                        >Answer from knowledge</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <LoadingDots />
                  {active.mode === "cowork" && <span style={{ fontSize: 12, color: t.textTertiary }}>Working...</span>}
                </div>
              )}
            </div>

            {/* Selection popover - fixed positioning */}
            {popover && (
              <div style={{
                position: "fixed", top: popover.top, left: Math.max(8, popover.left), zIndex: 50,
                background: t.surface, border: "1px solid " + t.greenBorder, borderRadius: t.radiusSm,
                padding: "4px 6px", boxShadow: t.shadowLg, display: "flex", gap: 4,
              }}>
                <button onClick={() => { propagateItem(popover.text); setPopover(null); window.getSelection()?.removeAllRanges(); }}
                  style={{ padding: "4px 10px", borderRadius: 5, border: "none", background: t.green, color: t.white, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                  Save to project ↑
                </button>
                <button onClick={() => { setPopover(null); window.getSelection()?.removeAllRanges(); }}
                  style={{ padding: "4px 6px", borderRadius: 5, border: "none", background: "transparent", color: t.textTertiary, fontSize: 11, cursor: "pointer" }}>×</button>
              </div>
            )}

            {/* Input */}
            <div className="input-area" style={{ padding: "14px 28px 18px", flexShrink: 0, background: t.surface, borderTop: "1px solid " + t.border }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <textarea ref={chatInputRef} rows={2}
                  style={{ flex: 1, background: t.surfaceMuted, border: "1px solid " + t.border, borderRadius: t.radius, padding: "11px 14px", color: t.text, fontSize: 14, outline: "none", resize: "none", fontFamily: t.font, lineHeight: 1.5 }}
                  placeholder={active.type === "trunk" ? "Message Claude about your project..." : active.mode === "cowork" ? "Ask Claude to research or create documents for " + active.name + "..." : "Message Claude about " + active.name + "..."}
                  value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  onFocus={(e) => e.target.style.borderColor = t.accentBorder}
                  onBlur={(e) => e.target.style.borderColor = t.border}
                />
                <button onClick={send} disabled={loading} data-send-btn style={{ padding: "11px 20px", borderRadius: t.radius, border: "none", background: t.accent, color: t.white, fontSize: 13, fontWeight: 600, cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1, whiteSpace: "nowrap" }}>Send</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: t.green, color: t.white, padding: "10px 20px", borderRadius: t.radius, fontSize: 13, fontWeight: 500, boxShadow: t.shadowLg, zIndex: 200, maxWidth: 420 }}>
          ✓ Saved to project: {toast}
        </div>
      )}

      {/* Link confirmation */}
      {linkConfirm && (
        <Modal onClose={() => setLinkConfirm(null)}>
          <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 12 }}>Open external link?</div>
          <p style={{ fontSize: 13, color: t.textSecondary, marginBottom: 12, lineHeight: 1.5, margin: "0 0 12px 0" }}>
            You're about to leave Branches and open this URL in a new tab:
          </p>
          <div style={{ background: t.surfaceMuted, border: "1px solid " + t.border, borderRadius: t.radiusSm, padding: "10px 12px", marginBottom: 20, wordBreak: "break-all", fontSize: 13, color: t.text, fontFamily: '"SF Mono", "Fira Code", monospace', lineHeight: 1.5 }}>
            {linkConfirm}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button onClick={() => setLinkConfirm(null)} style={{ padding: "9px 16px", borderRadius: t.radiusSm, border: "1px solid " + t.border, background: "transparent", color: t.textSecondary, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
            <button onClick={() => { window.open(linkConfirm, "_blank", "noopener,noreferrer"); setLinkConfirm(null); }} style={{ padding: "9px 16px", borderRadius: t.radiusSm, border: "none", background: t.accent, color: t.white, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Open in new tab</button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Modal onClose={() => setDeleteConfirm(null)}>
          <div style={{ fontSize: 17, fontWeight: 600, color: t.text, marginBottom: 4 }}>
            {deleteConfirm.type === "project" ? "Delete project?" : "Delete branch?"}
          </div>
          <div style={{ fontSize: 13, color: t.textTertiary, marginBottom: 20, lineHeight: 1.5 }}>
            {deleteConfirm.type === "project"
              ? "This will permanently delete the project and all its branches."
              : deleteConfirm.sharedItems.length > 0
                ? "This branch has context that was pushed up to the parent. What would you like to do?"
                : "This will permanently delete this branch and any sub-branches."}
          </div>
          {deleteConfirm.type === "branch" && deleteConfirm.sharedItems.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: t.textTertiary, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Shared context</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {deleteConfirm.sharedItems.map((item, i) => (
                  <span key={i} style={{ fontSize: 12, color: t.amber, background: t.amberSoft, border: "1px solid " + t.amberBorder, padding: "3px 10px", borderRadius: 20 }}>{item.length > 40 ? item.substring(0, 40) + "..." : item}</span>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => setDeleteConfirm(null)} style={{ padding: "9px 16px", borderRadius: t.radiusSm, border: "1px solid " + t.border, background: "transparent", color: t.textSecondary, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
            {deleteConfirm.type === "branch" && deleteConfirm.sharedItems.length > 0 && (
              <button onClick={() => executeDelete(true)} style={{ padding: "9px 16px", borderRadius: t.radiusSm, border: "1px solid #c0392b", background: "transparent", color: "#c0392b", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Delete + remove shared context</button>
            )}
            <button onClick={() => executeDelete(false)} style={{ padding: "9px 16px", borderRadius: t.radiusSm, border: "none", background: "#c0392b", color: t.white, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              {deleteConfirm.type === "project" ? "Delete project" : deleteConfirm.sharedItems.length > 0 ? "Delete, keep shared context" : "Delete branch"}
            </button>
          </div>
        </Modal>
      )}

      {/* New Project Modal */}
      {modal === "project" && (
        <Modal onClose={() => setModal(null)}>
          <div style={{ fontSize: 17, fontWeight: 600, color: t.text, marginBottom: 4 }}>New project</div>
          <div style={{ fontSize: 13, color: t.textTertiary, marginBottom: 20 }}>Create a new project with its own trunk and branches.</div>
          <label style={{ fontSize: 13, fontWeight: 500, color: t.textSecondary, marginBottom: 6, display: "block" }}>Project name</label>
          <input style={{ width: "100%", background: t.surfaceMuted, border: "1px solid " + t.border, borderRadius: t.radiusSm, padding: "10px 12px", color: t.text, fontSize: 14, outline: "none", marginBottom: 20, fontFamily: t.font, boxSizing: "border-box" }}
            placeholder="e.g., Product Launch, Research Project, Trip Planning..."
            value={projectName} onChange={(e) => setProjectName(e.target.value)} autoFocus
            onKeyDown={(e) => { if (e.key === "Enter") createProject(); }}
            onFocus={(e) => e.target.style.borderColor = t.accentBorder} onBlur={(e) => e.target.style.borderColor = t.border}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button onClick={() => { setProjectName(""); setModal(null); }} style={{ padding: "9px 16px", borderRadius: t.radiusSm, border: "1px solid " + t.border, background: "transparent", color: t.textSecondary, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
            <button onClick={createProject} disabled={!projectName.trim()} style={{ padding: "9px 16px", borderRadius: t.radiusSm, border: "none", background: !projectName.trim() ? t.border : t.accent, color: t.white, fontSize: 13, fontWeight: 500, cursor: !projectName.trim() ? "default" : "pointer" }}>Create project</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

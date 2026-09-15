/**
 * Every string on the site lives here.
 *
 * Edit this file to change copy — no component needs touching. Story
 * headlines, bylines and figures below are PLACEHOLDERS written to be
 * plausible; replace them with real published work before launch.
 */

export const site = {
  name: "Loktantra Live",
  tagline: "Where young India reports on its democracy",
  description:
    "A youth-led digital publication tracking protest, policy, and the pulse of Indian democracy. Independent, fact-first reporting from the streets to Sansad.",
  url: "https://loktantralive.in",
  locale: "en_IN",
} as const;

export const nav = {
  links: [
    { label: "The desks", href: "#desks" },
    { label: "Ground reports", href: "#ground" },
    { label: "On the feed", href: "#feed" },
    { label: "Write for us", href: "#work" },
  ],
  cta: { label: "Get the Weekly Brief", href: "#brief" },
} as const;

export const hero = {
  badge: "Filing now",
  headline: ["Where young India", "reports on its", "democracy"],
  /** Sits directly under the headline. Keep it to two lines at 1440px. */
  subline:
    "Protest, policy, and the pulse of a republic — covered by the generation that has to live with the result. No party line. No press-release journalism.",
  primaryCta: { label: "Get the Weekly Brief", href: "#brief" },
  secondaryCta: { label: "Read the latest", href: "#ground" },
  /** Shown beneath the CTAs as a quiet credibility line. */
  footnote: "Free every Sunday. 4,100 readers. No spam, no tracking pixels.",
} as const;

/** The ticker reads as a wire feed, not a fake client-logo row. */
export const ticker = {
  label: "On the wire",
  items: [
    "Explainer — What the new campus assembly rules actually change",
    "Ground report — Three days with a student union election",
    "Youth Voices — I filed my first RTI at nineteen. Here is what came back",
    "Campus Watch — Hostel fee hikes, mapped across 31 campuses",
    "Explainer — How a private member's bill actually dies",
    "Ground report — The municipal ward that fixed its own water supply",
  ],
} as const;

export const about = {
  eyebrow: "Why we exist",
  heading: "Democracy is not a spectator sport, and it is not a news cycle",
  body: [
    "Loktantra Live started in a hostel common room in 2023, after four of us realised we were arguing about a bill none of us had read. We found the text, read it, and wrote a plain-language breakdown for our classmates. Two thousand people read it that week.",
    "We are students, recent graduates, and early-career reporters filing from campuses and constituencies across the country. We publish explainers that cite the primary document, ground reports from people who were actually there, and opinion that is labelled as opinion.",
    "We are not aligned with any party, and we say so on the record. When we get something wrong, the correction stays on the page.",
  ],
  stats: [
    { value: 142, suffix: "", label: "Stories filed" },
    { value: 31, suffix: "", label: "Campuses covered" },
    { value: 68, suffix: "", label: "Contributing writers" },
  ],
  imageAlt:
    "Duotone illustration of a small newsroom: figures at a shared table with laptops and notebooks.",
} as const;

/** Bento grid. `span` drives the desktop grid; order is the mobile order. */
export const desks = {
  eyebrow: "The desks",
  heading: "Six ways we cover the republic",
  items: [
    {
      id: "latest",
      title: "Latest",
      body: "Everything we have published, newest first. Updated the moment a story clears its second read.",
      icon: "clock",
      span: "md:col-span-2 md:row-span-1",
      featured: false,
    },
    {
      id: "ground",
      title: "Ground Reports",
      body: "Reporting from where it happened — protests, panchayats, picket lines and polling booths. We go, we watch, we file.",
      icon: "pin",
      span: "md:col-span-2 md:row-span-2",
      featured: true,
    },
    {
      id: "explainers",
      title: "Explainers",
      body: "A bill, a judgment, a budget line — broken down against the primary document, with the document linked.",
      icon: "document",
      span: "md:col-span-2 md:row-span-1",
      featured: false,
    },
    {
      id: "voices",
      title: "Youth Voices",
      body: "Opinion, argument and dissent from readers under thirty. Labelled as opinion, every time.",
      icon: "quote",
      span: "md:col-span-2 md:row-span-1",
      featured: false,
    },
    {
      id: "campus",
      title: "Campus Watch",
      body: "Fee hikes, union elections, hostel rules and disciplinary orders — tracked across 31 campuses.",
      icon: "building",
      span: "md:col-span-2 md:row-span-1",
      featured: false,
    },
    {
      id: "write",
      title: "Write for Us",
      body: "Pitch a story. First-time writers are edited, not rejected. We pay for ground reports.",
      icon: "pen",
      span: "md:col-span-2 md:row-span-1",
      featured: false,
      href: "#work",
    },
  ],
} as const;

export const ground = {
  eyebrow: "Ground reports",
  heading: "We went, we watched, we filed",
  blurb:
    "Long-form reporting from the places a press release will never describe accurately.",
  items: [
    {
      id: "gr-1",
      kicker: "Student politics",
      title: "Three days inside a union election nobody expected to be close",
      dek: "Two thousand voters, four panels, and a counting hall that stayed open until 3am.",
      metric: "11,400 reads",
      readingTime: "14 min",
      dateline: "Delhi",
      imageAlt:
        "Duotone illustration of raised blank placards silhouetted against a bright sky.",
      href: "#",
    },
    {
      id: "gr-2",
      kicker: "Campus Watch",
      title: "The hostel fee hike that arrived as a notice board PDF",
      dek: "We filed eleven RTIs across four states. Seven came back. This is what they showed.",
      metric: "9 RTIs published",
      readingTime: "11 min",
      dateline: "Pune",
      imageAlt:
        "Duotone illustration of students seated in a circle on campus steps at dusk.",
      href: "#",
    },
    {
      id: "gr-3",
      kicker: "Policy",
      title: "How a private member's bill actually dies",
      dek: "We tracked one from drafting to lapse, and asked the member what the point was.",
      metric: "Cited by 3 outlets",
      readingTime: "9 min",
      dateline: "New Delhi",
      imageAlt:
        "Duotone illustration of a curved stone colonnade photographed from below.",
      href: "#",
    },
    {
      id: "gr-4",
      kicker: "Local government",
      title: "The ward that got tired of waiting and fixed its own water supply",
      dek: "A residents' committee, a borewell, and eighteen months of municipal correspondence.",
      metric: "Policy response",
      readingTime: "16 min",
      dateline: "Kochi",
      imageAlt:
        "Duotone illustration of raised hands with inked index fingers.",
      href: "#",
    },
  ],
} as const;

export const feed = {
  eyebrow: "On the feed",
  heading: "Explainers that fit on a phone screen",
  blurb:
    "Carousels, breakdowns and 60-second reads for the people who find us on Instagram first.",
  handle: "@loktantralive",
  handleHref: "https://instagram.com/loktantralive",
  items: [
    { id: "f1", title: "What a money bill is, and why it matters", type: "carousel", stat: "18.2k" },
    { id: "f2", title: "Your MP's attendance record, in one chart", type: "chart", stat: "24.7k" },
    { id: "f3", title: "Reading a budget line without crying", type: "video", stat: "31.5k" },
    { id: "f4", title: "How to file an RTI in nine steps", type: "carousel", stat: "42.1k" },
    { id: "f5", title: "Who actually calls a bandh?", type: "video", stat: "12.8k" },
    { id: "f6", title: "The difference between an ordinance and an act", type: "carousel", stat: "15.3k" },
  ],
} as const;

export const voices = {
  eyebrow: "What they say",
  heading: "Read by the people we report on",
  items: [
    {
      id: "v1",
      quote:
        "They called the registrar's office before they published, which is more than the three national outlets that ran the same story did.",
      name: "Ananya Rao",
      role: "General Secretary, students' union",
    },
    {
      id: "v2",
      quote:
        "I pitched a piece with no clips and no journalism degree. The edit took nine days and taught me more than a semester did.",
      name: "Imran Qureshi",
      role: "Contributing writer",
    },
    {
      id: "v3",
      quote:
        "We use their explainers in our civics sessions. They are the only ones that link the actual gazette notification.",
      name: "Dr. Meera Nambiar",
      role: "Faculty, public policy",
    },
    {
      id: "v4",
      quote:
        "Fact-first, genuinely nonpartisan, and young enough to know which rumour is going around before we do.",
      name: "Sahil Dutta",
      role: "Researcher, civil society organisation",
    },
  ],
} as const;

export const brief = {
  eyebrow: "The Weekly Brief",
  heading: "One email. Every Sunday. Everything that actually moved.",
  body: "The week's rulings, bills, protests and corrections — with the primary documents linked, in under a thousand words.",
  cta: "Get the Weekly Brief",
  placeholder: "you@university.edu",
  consent: "No spam, no tracking pixels. Unsubscribe in one click.",
  success: {
    heading: "You're on the list",
    body: "The next brief lands Sunday morning. Check your inbox for a confirmation.",
  },
} as const;

export const work = {
  eyebrow: "Work with us",
  heading: "Pitch a story, send a tip, or bring us a collaboration",
  body: "First-time writers are edited, not rejected. If you saw something on your campus or in your ward that the news missed, tell us.",
  inquiryTypes: [
    { value: "story", label: "Submit a story or pitch" },
    { value: "tip", label: "Send a campus tip" },
    { value: "collab", label: "Propose a collaboration" },
    { value: "press", label: "Press or syndication" },
  ],
  fields: {
    name: { label: "Your name", placeholder: "Aisha Menon" },
    email: { label: "Email", placeholder: "you@university.edu" },
    type: { label: "What is this about?" },
    message: {
      label: "Tell us more",
      placeholder:
        "If you're pitching: what happened, who you spoke to, and why it matters now.",
    },
  },
  submit: "Send it over",
  submitting: "Sending…",
  success: {
    heading: "Got it",
    body: "We read every submission. If it's a fit, an editor will reply within five working days.",
  },
  errors: {
    name: "Tell us what to call you.",
    email: "Enter an email we can reply to.",
    message: "Add a few lines so we know what this is about.",
    messageShort: "A little more detail — at least 20 characters.",
  },
} as const;

export const footer = {
  wordmark: "Loktantra Live",
  blurb:
    "Independent, fact-first reporting on youth activism and the state of Indian democracy.",
  columns: [
    {
      heading: "Sections",
      links: [
        { label: "Latest", href: "#desks" },
        { label: "Ground Reports", href: "#ground" },
        { label: "Explainers", href: "#desks" },
        { label: "Youth Voices", href: "#desks" },
        { label: "Campus Watch", href: "#desks" },
      ],
    },
    {
      heading: "About",
      links: [
        { label: "Why we exist", href: "#about" },
        { label: "Write for us", href: "#work" },
        { label: "Corrections policy", href: "#" },
        { label: "Funding and ethics", href: "#" },
      ],
    },
  ],
  socials: [{ label: "Instagram", handle: "@loktantralive", href: "https://instagram.com/loktantralive" }],
  colophon:
    "Set in Bricolage Grotesque and Geist. Built on the subcontinent.",
  legal: `© ${new Date().getFullYear()} Loktantra Live. Corrections stay on the page.`,
} as const;

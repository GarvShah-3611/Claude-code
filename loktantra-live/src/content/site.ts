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

/** Nav addresses pages now, not scroll anchors. `route` maps to lib/router. */
export const nav = {
  links: [
    { label: "Ground reports", route: "ground" },
    { label: "Watchlist", route: "watch" },
    { label: "On the feed", route: "feed" },
    { label: "Why we exist", route: "about" },
    { label: "Write for us", route: "write" },
  ],
  cta: { label: "Get the Weekly Brief", route: "write" },
} as const;

/** The home page's index of desks — each card opens a page. */
export const home = {
  eyebrow: "The desks",
  heading: "Pick a desk",
  blurb:
    "Six ways we cover the republic. Every one of them opens on its own page — no endless scrolling for the thing you came for.",
  cards: [
    { route: "ground", title: "Ground Reports", body: "Reporting from where it happened — protests, panchayats, picket lines and polling booths.", icon: "pin", count: "4 stories" },
    { route: "watch", title: "Watchlist", body: "The clearest explainers we have found on how the republic actually works, credited to the people who made them.", icon: "play", count: "6 videos" },
    { route: "feed", title: "On the feed", body: "Carousels, breakdowns and 60-second reads for the people who find us on Instagram first.", icon: "layers", count: "6 posts" },
    { route: "voices", title: "Youth Voices", body: "What readers, campus organisers and collaborators say about the work.", icon: "quote", count: "4 voices" },
    { route: "about", title: "Why we exist", body: "How this started in a hostel common room, and what we will and will not publish.", icon: "building", count: "The story" },
    { route: "write", title: "Write for us", body: "Pitch a story, send a campus tip, or reach the desk directly. First-time writers are edited, not rejected.", icon: "pen", count: "Open" },
  ],
} as const;

export const hero = {
  badge: "Filing now",
  headline: ["Where young India", "reports on its", "democracy"],
  /** Sits directly under the headline. Keep it to two lines at 1440px. */
  subline:
    "Protest, policy, and the pulse of a republic — covered by the generation that has to live with the result. No party line. No press-release journalism.",
  primaryCta: { label: "Get the Weekly Brief", route: "write" },
  secondaryCta: { label: "Read the ground reports", route: "ground" },
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
  photo: "media/about/newsroom.jpg",
} as const;


export const ground = {
  eyebrow: "Ground reports",
  heading: "We went, we watched, we filed",
  blurb:
    "Long-form reporting from the places a press release will never describe accurately.",
  items: [
    {
      id: "gr-1",
      photo: "media/ground/gr-1.jpg",
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
      photo: "media/ground/gr-2.jpg",
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
      photo: "media/ground/gr-3.jpg",
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
      photo: "media/ground/gr-4.jpg",
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
    { id: "f1", photo: "media/feed/f1.jpg", title: "What a money bill is, and why it matters", type: "carousel", stat: "18.2k" },
    { id: "f2", photo: "media/feed/f2.jpg", title: "Your MP's attendance record, in one chart", type: "chart", stat: "24.7k" },
    { id: "f3", photo: "media/feed/f3.jpg", title: "Reading a budget line without crying", type: "video", stat: "31.5k" },
    { id: "f4", photo: "media/feed/f4.jpg", title: "How to file an RTI in nine steps", type: "carousel", stat: "42.1k" },
    { id: "f5", photo: "media/feed/f5.jpg", title: "Who actually calls a bandh?", type: "video", stat: "12.8k" },
    { id: "f6", photo: "media/feed/f6.jpg", title: "The difference between an ordinance and an act", type: "carousel", stat: "15.3k" },
  ],
} as const;

export const voices = {
  eyebrow: "What they say",
  heading: "Read by the people we report on",
  items: [
    {
      id: "v1",
      photo: "media/voices/v1.jpg",
      quote:
        "They called the registrar's office before they published, which is more than the three national outlets that ran the same story did.",
      name: "Ananya Rao",
      role: "General Secretary, students' union",
    },
    {
      id: "v2",
      photo: "media/voices/v2.jpg",
      quote:
        "I pitched a piece with no clips and no journalism degree. The edit took nine days and taught me more than a semester did.",
      name: "Imran Qureshi",
      role: "Contributing writer",
    },
    {
      id: "v3",
      photo: "media/voices/v3.jpg",
      quote:
        "We use their explainers in our civics sessions. They are the only ones that link the actual gazette notification.",
      name: "Dr. Meera Nambiar",
      role: "Faculty, public policy",
    },
    {
      id: "v4",
      photo: "media/voices/v4.jpg",
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
  /** Shown beside the form so a pitch has somewhere to go that is not a form. */
  direct: {
    heading: "Or reach the desk directly",
    name: "Garv Shah",
    role: "Founding editor",
    phone: "+91 73097 82696",
    phoneHref: "tel:+917309782696",
  },
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

/**
 * Explainers worth watching, published by other people.
 *
 * These are third-party YouTube videos, credited to their channels. They are
 * deliberately framed as a recommended watchlist, NOT as Loktantra Live's own
 * work — presenting someone else's reporting as your own is exactly the thing
 * a fact-first publication cannot do. Video IDs, titles, channels and view
 * counts were pulled from YouTube rather than invented.
 */
export const watch = {
  eyebrow: "Watchlist",
  heading: "Explainers worth your evening",
  blurb:
    "We did not make these. They are the clearest things we have found on how the republic actually works — credited to the people who made them.",
  note: "Opens on YouTube in a new tab. We do not host or claim any of this work.",
  items: [
    {
      id: "MvwJ49hGr9s",
      title: "Lok Sabha and Rajya Sabha, and what actually separates them",
      channel: "StudyIQ IAS",
      views: "2.1M views",
      length: "13:08",
    },
    {
      id: "Bs6YhOqxfeQ",
      title: "How the Prime Minister of India is actually chosen",
      channel: "Priya Jain",
      views: "1.1M views",
      length: "7:38",
    },
    {
      id: "NKqm9LfI5Qc",
      title: "India's foreign policy, 1947 to now",
      channel: "StudyIQ IAS",
      views: "495K views",
      length: "14:11",
    },
    {
      id: "mK3UUU-TSAc",
      title: "Delimitation and the women's quota, and why they are tied together",
      channel: "StudyIQ IAS",
      views: "354K views",
      length: "17:18",
    },
    {
      id: "aRmHV0y46cc",
      title: "The Indian Parliament in five minutes",
      channel: "The Polymath",
      views: "171K views",
      length: "7:07",
    },
    {
      id: "616FsCeSCYw",
      title: "How the Indian election system works, in Telugu",
      channel: "Telugu Badi",
      views: "738K views",
      length: "13:01",
    },
  ],
} as const;

export const footer = {
  wordmark: "Loktantra Live",
  blurb:
    "Independent, fact-first reporting on youth activism and the state of Indian democracy.",
  columns: [
    {
      heading: "Pages",
      links: [
        { label: "Ground Reports", href: "#/ground" },
        { label: "Watchlist", href: "#/watch" },
        { label: "On the feed", href: "#/feed" },
        { label: "Youth Voices", href: "#/voices" },
      ],
    },
    {
      heading: "About",
      links: [
        { label: "Why we exist", href: "#/about" },
        { label: "Write for us", href: "#/write" },
        { label: "Corrections policy", href: "#/about" },
        { label: "Funding and ethics", href: "#/about" },
      ],
    },
  ],
  socials: [{ label: "Instagram", handle: "@loktantralive", href: "https://instagram.com/loktantralive" }],
  contact: {
    heading: "Contact",
    name: "Garv Shah",
    role: "Founding editor",
    phone: "+91 73097 82696",
    phoneHref: "tel:+917309782696",
  },
  colophon:
    "Set in Bricolage Grotesque and Geist. Built on the subcontinent.",
  legal: `© ${new Date().getFullYear()} Loktantra Live. Corrections stay on the page.`,
} as const;

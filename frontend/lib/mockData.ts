// ============================================================
// lib/mockData.ts
// All fake data used in Phase 1 (no real API calls).
// In later phases, these will be replaced by real fetch() calls
// to the Express backend — the shapes stay the same.
// ============================================================

export type Verdict = 'True' | 'False' | 'Misleading' | 'Unverifiable';

export interface Source {
  id: string;
  title: string;
  url: string;
  publisher: string;
  publishedAt: string;
}

export interface FactCheckResult {
  id: string;
  claim: string;
  verdict: Verdict;
  confidence: number; // 0-100
  reasoning: string;
  flaggedPortion: string | null; // the specific misleading part, if any
  authenticPercent: number; // for the pie chart
  sources: Source[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface HistoryEntry {
  id: string;
  claim: string;
  verdict: Verdict;
  confidence: number;
  createdAt: string;
}

// ── Mock fact-check result returned after "Verify" is clicked ──
export const MOCK_FACT_CHECK_RESULT: FactCheckResult = {
  id: 'fck-001',
  claim:
    "Scientists have confirmed that drinking coffee reduces the risk of Alzheimer's disease by up to 65 percent, according to a landmark study published last month.",
  verdict: 'Misleading',
  confidence: 82,
  reasoning:
    "Multiple peer-reviewed studies do suggest an association between regular coffee consumption and a reduced risk of cognitive decline, including Alzheimer's disease. However, the specific \"65 percent\" figure cited does not appear in any landmark study published recently. The most cited research shows a 20–30% reduced risk in observational data, and no study has established causation. The claim overstates the magnitude of benefit and misrepresents the certainty of the evidence.",
  flaggedPortion:
    "reduces the risk of Alzheimer's disease by up to 65 percent",
  authenticPercent: 78,
  sources: [
    {
      id: 's1',
      title: 'Coffee and the Risk of Dementia: A Systematic Review',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/example1',
      publisher: "Journal of Alzheimer's Disease",
      publishedAt: '2024-03-15',
    },
    {
      id: 's2',
      title: 'Caffeine, Coffee, and Cognitive Decline: What We Know',
      url: 'https://www.alzheimers.org/research/coffee-risk',
      publisher: "Alzheimer's Association",
      publishedAt: '2024-01-22',
    },
    {
      id: 's3',
      title: "No, Coffee Does Not Reduce Alzheimer's Risk by 65%",
      url: 'https://www.reuters.com/fact-check/coffee-alzheimers',
      publisher: 'Reuters Fact Check',
      publishedAt: '2024-06-10',
    },
    {
      id: 's4',
      title: 'Habitual Coffee Consumption and Risk of Cognitive Disorders',
      url: 'https://www.bmj.com/content/example-coffee-study',
      publisher: 'The BMJ',
      publishedAt: '2023-11-05',
    },
  ],
  createdAt: new Date().toISOString(),
};

// ── Canned mock chat replies (rotated on each user message) ──
export const MOCK_CHAT_REPLIES: string[] = [
  'Based on the sources reviewed for this claim, the association between coffee and cognitive health is real but modest. Most studies show a 20–30% reduction in relative risk, not 65%. The distinction between association and causation is critical here.',
  'The "landmark study" referenced in this claim could not be identified in peer-reviewed databases. This is a common pattern in health misinformation — attributing a dramatic statistic to a vague, unverifiable source.',
  'Three of the four sources I found actually contradicted the specific 65% figure. The Reuters Fact Check article specifically traced this number to a misread of a 2019 observational study that looked at a specific gene variant, not the general population.',
  'To be clear: the underlying claim that coffee may help reduce cognitive decline has some scientific support. What makes this misleading is the precision and certainty of the 65% figure, which goes far beyond what the evidence supports.',
  "If you're researching this topic further, I'd recommend looking at the CAIDE study (Cardiovascular Risk Factors, Aging and Dementia) — it's one of the more rigorous longitudinal studies on this question.",
];

// ── Mock user profile data ──
export const MOCK_USER = {
  id: 'usr-001',
  name: 'Harsha',
  email: 'harsha@example.com',
  memberSince: '2024-09-01',
  avatarInitials: 'H',
  stats: {
    totalChecks: 47,
    verdictBreakdown: {
      True: 14,
      False: 11,
      Misleading: 18,
      Unverifiable: 4,
    },
    accuracyRate: 91,
  },
};

// ── Mock recent fact-check history for profile page ──
export const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: 'fck-001',
    claim: "Scientists confirm coffee reduces Alzheimer's risk by 65 percent.",
    verdict: 'Misleading',
    confidence: 82,
    createdAt: '2026-07-31T10:22:00Z',
  },
  {
    id: 'fck-002',
    claim: "India launched the world's first quantum internet satellite in June 2026.",
    verdict: 'Unverifiable',
    confidence: 45,
    createdAt: '2026-07-28T14:05:00Z',
  },
  {
    id: 'fck-003',
    claim: 'The WHO declared a global health emergency over the H5N1 outbreak.',
    verdict: 'False',
    confidence: 94,
    createdAt: '2026-07-25T09:11:00Z',
  },
  {
    id: 'fck-004',
    claim: 'NASA confirmed the discovery of microbial life on Mars in samples returned by Perseverance.',
    verdict: 'False',
    confidence: 97,
    createdAt: '2026-07-20T17:33:00Z',
  },
  {
    id: 'fck-005',
    claim: "India's GDP grew by 8.2% in the last fiscal quarter, beating all G20 nations.",
    verdict: 'True',
    confidence: 88,
    createdAt: '2026-07-15T11:45:00Z',
  },
];

// ============================================================
// NEWS / BLOGS — mock data
// Phase 3+: swap MOCK_NEWS_ARTICLES with real API response
//            from POST /api/news?tags=politics,tech&page=1
// ============================================================

export type NewsTag =
  | 'politics'
  | 'technology'
  | 'sports'
  | 'business'
  | 'health'
  | 'science'
  | 'entertainment'
  | 'world'
  | 'india'
  | 'environment'
  | 'finance'
  | 'climate';

export const ALL_TAGS: { id: NewsTag; label: string; color: string; bg: string }[] = [
  { id: 'politics',      label: 'Politics',       color: 'text-slate-700 dark:text-slate-300',   bg: 'bg-slate-100 dark:bg-slate-800' },
  { id: 'technology',    label: 'Technology',     color: 'text-indigo-700 dark:text-indigo-300', bg: 'bg-indigo-50 dark:bg-indigo-900/40' },
  { id: 'sports',        label: 'Sports',         color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/40' },
  { id: 'business',      label: 'Business',       color: 'text-amber-700 dark:text-amber-300',   bg: 'bg-amber-50 dark:bg-amber-900/40' },
  { id: 'health',        label: 'Health',         color: 'text-rose-700 dark:text-rose-300',     bg: 'bg-rose-50 dark:bg-rose-900/40' },
  { id: 'science',       label: 'Science',        color: 'text-violet-700 dark:text-violet-300', bg: 'bg-violet-50 dark:bg-violet-900/40' },
  { id: 'entertainment', label: 'Entertainment',  color: 'text-pink-700 dark:text-pink-300',     bg: 'bg-pink-50 dark:bg-pink-900/40' },
  { id: 'world',         label: 'World',          color: 'text-sky-700 dark:text-sky-300',       bg: 'bg-sky-50 dark:bg-sky-900/40' },
  { id: 'india',         label: 'India',          color: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-50 dark:bg-orange-900/40' },
  { id: 'environment',   label: 'Environment',    color: 'text-green-700 dark:text-green-300',   bg: 'bg-green-50 dark:bg-green-900/40' },
  { id: 'finance',       label: 'Finance',        color: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/40' },
  { id: 'climate',       label: 'Climate',        color: 'text-teal-700 dark:text-teal-300',     bg: 'bg-teal-50 dark:bg-teal-900/40' },
];

export interface NewsArticle {
  id: string;
  headline: string;
  preview: string;         // one sentence shown on card
  description: string;     // 2-3 sentences shown in modal
  source: string;          // publisher name
  sourceUrl: string;       // placeholder URL for "Read Full Article"
  publishedAt: string;     // ISO timestamp
  tags: NewsTag[];
  // Thumbnail is generated from these rather than a real image URL
  thumbBg: string;         // Tailwind bg class for the colored placeholder
  thumbInitial: string;    // Single letter shown on placeholder
}

export const MOCK_NEWS_ARTICLES: NewsArticle[] = [
  // ── Politics ──
  {
    id: 'n-001',
    headline: 'Parliament Passes Landmark Data Privacy Bill After Three Years of Deliberation',
    preview: 'The bill introduces strict consent requirements and heavy penalties for misuse of citizen data.',
    description: "India's Parliament passed the Digital Personal Data Protection Act with a 287-vote majority, ending three years of debate. The legislation mandates explicit user consent for data collection, requires companies to appoint data protection officers, and imposes fines of up to ₹250 crore for violations. Tech firms have been granted an 18-month compliance window.",
    source: 'The Hindu',
    sourceUrl: 'https://www.thehindu.com',
    publishedAt: '2026-07-31T08:00:00Z',
    tags: ['politics', 'india', 'technology'],
    thumbBg: 'bg-slate-500',
    thumbInitial: 'T',
  },
  {
    id: 'n-002',
    headline: 'Opposition Demands JPC Probe Into Electoral Bond Data Leak',
    preview: 'Documents allegedly showing donor-benefit quid pro quos have surfaced online, triggering a political firestorm.',
    description: "A cache of documents purportedly linking electoral bond purchases to government contracts was leaked to journalists by an anonymous whistleblower. The principal opposition bloc has moved a notice for a Joint Parliamentary Committee inquiry, while the ruling coalition has called the documents fabricated. The Election Commission has ordered an independent review.",
    source: 'NDTV',
    sourceUrl: 'https://www.ndtv.com',
    publishedAt: '2026-07-30T14:30:00Z',
    tags: ['politics', 'india'],
    thumbBg: 'bg-slate-600',
    thumbInitial: 'N',
  },
  {
    id: 'n-003',
    headline: 'EU Coalition Government Collapses Over Immigration Dispute',
    preview: 'The centre-left bloc withdrew support after the chancellor rejected a proposed cap on asylum seekers.',
    description: "Germany's ruling coalition collapsed after the Green Party withdrew from government following an irreconcilable dispute over asylum seeker caps. Chancellor Merz is expected to call a snap election within 60 days. Financial markets reacted with mild volatility, while EU officials urged stability.",
    source: 'Reuters',
    sourceUrl: 'https://www.reuters.com',
    publishedAt: '2026-07-29T10:15:00Z',
    tags: ['politics', 'world'],
    thumbBg: 'bg-slate-400',
    thumbInitial: 'R',
  },

  // ── Technology ──
  {
    id: 'n-004',
    headline: 'OpenAI Releases GPT-5 With Real-Time Web Access and Long-Context Memory',
    preview: 'The model can retain context across sessions and access live web data, marking a significant capability leap.',
    description: "OpenAI unveiled GPT-5, featuring a 2-million-token context window, persistent memory across conversations, and a built-in web-search tool that retrieves real-time information. The model outperforms GPT-4o on 94% of academic benchmarks. API access is rolling out to enterprise customers first, with broader availability expected in Q4 2026.",
    source: 'The Verge',
    sourceUrl: 'https://www.theverge.com',
    publishedAt: '2026-07-31T06:00:00Z',
    tags: ['technology', 'science'],
    thumbBg: 'bg-indigo-500',
    thumbInitial: 'V',
  },
  {
    id: 'n-005',
    headline: 'Apple Vision Pro 2 Announced With 40% Weight Reduction and New Hand-Tracking API',
    preview: 'The second-generation spatial computer ships in October at a $2,999 starting price.',
    description: "Apple announced Vision Pro 2 at its annual fall event, featuring a redesigned carbon-fibre frame that cuts weight by 42%. The new device ships with visionOS 3, which introduces full hand-gesture navigation without the need for the eye-tracking confirmation step. Developers get access to a richer ARKit API that enables persistent room-scale object anchoring.",
    source: 'Wired',
    sourceUrl: 'https://www.wired.com',
    publishedAt: '2026-07-30T18:00:00Z',
    tags: ['technology', 'business'],
    thumbBg: 'bg-indigo-600',
    thumbInitial: 'W',
  },
  {
    id: 'n-006',
    headline: 'India Surpasses China in New Semiconductor Fab Investments for 2026',
    preview: 'Four new fab projects worth $18 billion were announced in the past quarter alone.',
    description: "Driven by PLI incentives and global supply chain diversification, India attracted $18 billion in semiconductor fabrication investments in the first half of 2026, eclipsing China for the first time. TSMC, Micron, and Tower Semiconductor have all confirmed greenfield facilities in Gujarat and Telangana. Analysts project India will produce 15% of global chip output by 2032.",
    source: 'Economic Times',
    sourceUrl: 'https://economictimes.indiatimes.com',
    publishedAt: '2026-07-28T09:00:00Z',
    tags: ['technology', 'india', 'business'],
    thumbBg: 'bg-indigo-400',
    thumbInitial: 'E',
  },

  // ── Sports ──
  {
    id: 'n-007',
    headline: 'India Clinch ICC T20 World Cup 2026, Beating Australia by 7 Wickets',
    preview: 'Shubman Gill\'s unbeaten 94 guided India to their third T20 World Cup title.',
    description: "India secured their third ICC Men's T20 World Cup title with a commanding 7-wicket victory over Australia at the Narendra Modi Stadium. Set 161 to win, Shubman Gill's composed 94* off 62 balls anchored a dominant chase. Jasprit Bumrah was named Player of the Tournament for his 18 wickets across 9 matches.",
    source: 'ESPNcricinfo',
    sourceUrl: 'https://www.espncricinfo.com',
    publishedAt: '2026-07-31T07:30:00Z',
    tags: ['sports', 'india'],
    thumbBg: 'bg-emerald-500',
    thumbInitial: 'E',
  },
  {
    id: 'n-008',
    headline: 'Real Madrid Sign Lamine Yamal in €180M Record Deal',
    preview: 'The Spanish winger joins the Bernabéu on a six-year contract, becoming the most expensive signing in club history.',
    description: "Real Madrid confirmed the signing of Barcelona's Lamine Yamal for a world record €180 million fee on a six-year contract. The 19-year-old winger, who starred in Spain's Euro 2024 triumph, passed his medical on Wednesday. Madrid president Florentino Pérez described the deal as 'a generational talent secured for the next decade'.",
    source: 'BBC Sport',
    sourceUrl: 'https://www.bbc.com/sport',
    publishedAt: '2026-07-29T16:45:00Z',
    tags: ['sports', 'world'],
    thumbBg: 'bg-emerald-600',
    thumbInitial: 'B',
  },

  // ── Business ──
  {
    id: 'n-009',
    headline: 'Reliance Jio Acquires Airtel\'s Home Broadband Business for ₹42,000 Crore',
    preview: 'The deal will make Jio the dominant broadband provider in India with over 38 million home subscribers.',
    description: "Reliance Jio's acquisition of Airtel's home broadband and IPTV operations has cleared CCI review, with the final deal valued at ₹42,000 crore. The combined entity will hold a 58% market share in urban home broadband. Airtel says it will reinvest proceeds into expanding its enterprise 5G and data centre businesses.",
    source: 'Mint',
    sourceUrl: 'https://www.livemint.com',
    publishedAt: '2026-07-30T11:00:00Z',
    tags: ['business', 'india', 'finance'],
    thumbBg: 'bg-amber-500',
    thumbInitial: 'M',
  },
  {
    id: 'n-010',
    headline: 'Tesla Reports Record Q2 Revenue of $28.4 Billion, Shares Surge 11%',
    preview: 'Strong Cybertruck deliveries and energy storage growth drove the beat against analyst expectations.',
    description: "Tesla reported Q2 2026 revenue of $28.4 billion, beating analyst consensus of $26.1 billion. The energy generation and storage division posted its largest-ever quarterly revenue of $4.2 billion, while Cybertruck deliveries topped 45,000 units. CEO Elon Musk attributed the margin recovery to reduced raw material costs and improved Gigafactory throughput.",
    source: 'Financial Times',
    sourceUrl: 'https://www.ft.com',
    publishedAt: '2026-07-23T20:00:00Z',
    tags: ['business', 'technology', 'finance'],
    thumbBg: 'bg-amber-600',
    thumbInitial: 'F',
  },

  // ── Health ──
  {
    id: 'n-011',
    headline: 'WHO Approves First Malaria Vaccine for Adults After Phase III Trials',
    preview: 'The R21/Matrix-M vaccine showed 77% efficacy in adults, a major breakthrough after decades of research.',
    description: "The World Health Organisation granted prequalification to the R21/Matrix-M malaria vaccine developed by the University of Oxford and Serum Institute of India, following Phase III trials showing 77% efficacy in adults aged 18-55. The vaccine, previously approved for children, is now cleared for adults in endemic regions. UNICEF has placed an initial order of 50 million doses.",
    source: 'The Lancet',
    sourceUrl: 'https://www.thelancet.com',
    publishedAt: '2026-07-30T12:00:00Z',
    tags: ['health', 'science', 'world'],
    thumbBg: 'bg-rose-500',
    thumbInitial: 'L',
  },
  {
    id: 'n-012',
    headline: 'India Launches National Mental Health Mission With ₹8,500 Crore Outlay',
    preview: 'The scheme aims to integrate mental health care into primary health centres across all 750 districts.',
    description: "The Union Health Ministry launched the National Mental Health Mission, backed by a five-year ₹8,500 crore outlay, to embed trained counsellors and psychiatrists into every district hospital and primary health centre. The initiative follows a government survey showing 1 in 5 Indians reported significant mental distress in 2025. A dedicated helpline and school programme will launch concurrently.",
    source: 'Indian Express',
    sourceUrl: 'https://indianexpress.com',
    publishedAt: '2026-07-27T08:30:00Z',
    tags: ['health', 'india'],
    thumbBg: 'bg-rose-600',
    thumbInitial: 'I',
  },

  // ── Science ──
  {
    id: 'n-013',
    headline: 'ISRO\'s Chandrayaan-4 Lands Near Lunar South Pole, Begins Ice Extraction Test',
    preview: 'The rover deployed a drill within hours of landing and has already transmitted samples for analysis.',
    description: "ISRO's Chandrayaan-4 mission successfully touched down in the Shackleton Crater rim area, becoming only the second spacecraft to operate near the lunar south pole. The Pragyan-IV rover began its ice extraction experiment within 4 hours of landing, using a thermal drill to reach a depth of 1.2 metres. Preliminary spectrometry data suggests water ice concentrations of 5-8% by mass.",
    source: 'Science',
    sourceUrl: 'https://www.science.org',
    publishedAt: '2026-07-31T03:15:00Z',
    tags: ['science', 'india', 'technology'],
    thumbBg: 'bg-violet-500',
    thumbInitial: 'S',
  },
  {
    id: 'n-014',
    headline: 'Physicists Achieve Room-Temperature Superconductivity in New Carbon-Based Material',
    preview: 'A team at MIT reports superconducting properties at 22°C, a feat attempted for over a century.',
    description: "Researchers at MIT and the University of Tokyo jointly announced the discovery of room-temperature superconductivity in a buckminsterfullerene-graphene composite material. The material exhibits zero electrical resistance at temperatures up to 22°C under ambient pressure. Independent replication attempts are underway at three European labs; if confirmed, the implications for power transmission and computing are profound.",
    source: 'Nature',
    sourceUrl: 'https://www.nature.com',
    publishedAt: '2026-07-25T17:00:00Z',
    tags: ['science', 'technology'],
    thumbBg: 'bg-violet-600',
    thumbInitial: 'N',
  },

  // ── Entertainment ──
  {
    id: 'n-015',
    headline: 'Cannes Palme d\'Or Goes to Iranian Director Farhadi\'s "The Verdict"',
    preview: 'The film\'s unflinching look at judicial corruption in Tehran drew a seven-minute standing ovation.',
    description: "Asghar Farhadi's latest film 'The Verdict' claimed the Palme d'Or at the 2026 Cannes Film Festival, the director's third such win. The drama follows a schoolteacher wrongly convicted of fraud in Tehran's bureaucratic courts. Jury president Alfonso Cuarón called it 'a masterclass in moral ambiguity and humanist filmmaking'.",
    source: 'Variety',
    sourceUrl: 'https://variety.com',
    publishedAt: '2026-07-26T20:30:00Z',
    tags: ['entertainment', 'world'],
    thumbBg: 'bg-pink-500',
    thumbInitial: 'V',
  },
  {
    id: 'n-016',
    headline: 'Spotify Hits 750 Million Monthly Active Users, Driven by Podcast and Audiobook Growth',
    preview: 'Podcast listening hours grew 38% year-on-year, while audiobooks added 60 million new listeners.',
    description: "Spotify reported 750 million monthly active users in its Q2 2026 earnings, growing 19% year-on-year. The platform attributed growth primarily to its podcast network, which now hosts over 7 million shows, and its audiobook catalogue of 400,000 titles. Revenue per user also rose for the fourth consecutive quarter following a subscription price increase in February.",
    source: 'Bloomberg',
    sourceUrl: 'https://www.bloomberg.com',
    publishedAt: '2026-07-23T14:00:00Z',
    tags: ['entertainment', 'business', 'technology'],
    thumbBg: 'bg-pink-600',
    thumbInitial: 'B',
  },

  // ── World ──
  {
    id: 'n-017',
    headline: 'UN Security Council Passes Resolution Demanding Gaza Ceasefire by August 15',
    preview: 'The binding resolution passed 13-0, with two permanent members abstaining.',
    description: "The UN Security Council passed Resolution 2741 demanding an immediate ceasefire in Gaza by August 15, with a 13-0 vote. The US and Russia abstained. The resolution includes provisions for humanitarian corridor oversight by a neutral international force and mandates weekly status reports to the Secretary-General. Implementation mechanisms remain disputed.",
    source: 'Al Jazeera',
    sourceUrl: 'https://www.aljazeera.com',
    publishedAt: '2026-07-28T22:00:00Z',
    tags: ['world', 'politics'],
    thumbBg: 'bg-sky-500',
    thumbInitial: 'A',
  },
  {
    id: 'n-018',
    headline: 'Japan Raises Interest Rates to 1.5%, Highest Level in 30 Years',
    preview: 'The Bank of Japan cited sustained wage growth and above-target inflation as key drivers of the decision.',
    description: "The Bank of Japan raised its benchmark interest rate to 1.5%, the highest level since 1995, citing four consecutive quarters of wage growth above 3% and core inflation holding at 2.8%. The yen strengthened 2.4% against the dollar on the announcement. Japanese government bond yields rose sharply, though the BOJ said it would continue to conduct yield curve control operations.",
    source: 'Nikkei Asia',
    sourceUrl: 'https://asia.nikkei.com',
    publishedAt: '2026-07-27T07:00:00Z',
    tags: ['world', 'finance', 'business'],
    thumbBg: 'bg-sky-600',
    thumbInitial: 'N',
  },

  // ── India ──
  {
    id: 'n-019',
    headline: 'Delhi-Mumbai Expressway Fully Operational, Cutting Drive Time to 12 Hours',
    preview: 'The 1,350-km eight-lane corridor opened to public traffic on Thursday, two months ahead of schedule.',
    description: "The Delhi-Mumbai Expressway, India's longest at 1,350 km, became fully operational as the final stretch through Rajasthan opened to traffic. The eight-lane highway reduces drive time between the two cities from 24 hours to approximately 12 hours at permitted speeds. The ₹98,000 crore project includes 93 tunnels, 47 flyovers, and dedicated freight lanes with solar-powered lighting throughout.",
    source: 'Times of India',
    sourceUrl: 'https://timesofindia.indiatimes.com',
    publishedAt: '2026-07-31T07:00:00Z',
    tags: ['india', 'business'],
    thumbBg: 'bg-orange-500',
    thumbInitial: 'T',
  },

  // ── Environment ──
  {
    id: 'n-020',
    headline: 'India Achieves 500 GW Renewable Energy Target Two Years Ahead of Schedule',
    preview: 'Solar capacity alone now stands at 312 GW, making India the world\'s second-largest solar producer.',
    description: "India's total installed renewable energy capacity crossed 500 GW, achieving the national target two years ahead of the 2030 deadline. Solar power accounts for 312 GW, wind for 148 GW, and the remainder comes from hydro and biomass sources. The Ministry of New and Renewable Energy credited production-linked incentive schemes and falling panel costs for the accelerated rollout.",
    source: 'Down To Earth',
    sourceUrl: 'https://www.downtoearth.org.in',
    publishedAt: '2026-07-29T06:00:00Z',
    tags: ['environment', 'india', 'climate'],
    thumbBg: 'bg-green-500',
    thumbInitial: 'D',
  },
  {
    id: 'n-021',
    headline: 'Amazon Deforestation Drops 78% in 2026 — But Scientists Warn of Tipping Point',
    preview: 'Satellite data shows the lowest annual tree-cover loss in a decade, yet cumulative damage may already be irreversible.',
    description: "Brazil's National Institute for Space Research (INPE) reported a 78% decline in Amazon deforestation in 2026 compared to 2022 peak levels, largely attributed to the Lula government's enforcement operations and international pressure. However, a peer-reviewed study in Science warns that 17-20% of the Amazon has already crossed local ecological tipping points that prevent natural regeneration, even without further clearing.",
    source: 'Guardian',
    sourceUrl: 'https://www.theguardian.com',
    publishedAt: '2026-07-26T10:00:00Z',
    tags: ['environment', 'climate', 'world'],
    thumbBg: 'bg-green-600',
    thumbInitial: 'G',
  },

  // ── Finance ──
  {
    id: 'n-022',
    headline: 'RBI Cuts Repo Rate to 5.75%, Third Reduction This Year',
    preview: 'The rate cut is expected to lower home loan EMIs by ₹600-900 per lakh over 20 years.',
    description: "The Reserve Bank of India's Monetary Policy Committee voted 4-2 to cut the repo rate by 25 basis points to 5.75%, the third reduction in 2026. Governor Sanjay Malhotra cited softening food inflation and the need to support growth amid global uncertainty. Banks are expected to transmit the cut within 45 days; home and auto loan borrowers will see the most immediate relief.",
    source: 'Business Standard',
    sourceUrl: 'https://www.business-standard.com',
    publishedAt: '2026-07-30T13:00:00Z',
    tags: ['finance', 'india', 'business'],
    thumbBg: 'bg-yellow-500',
    thumbInitial: 'B',
  },

  // ── Climate ──
  {
    id: 'n-023',
    headline: 'Arctic Ice Sheet Records Lowest July Extent in 47 Years of Satellite Observation',
    preview: 'Sea ice extent is 23% below the 1981-2010 average, alarming climate scientists tracking feedback loops.',
    description: "The US National Snow and Ice Data Center confirmed that Arctic sea ice extent reached its lowest recorded July level, sitting 23% below the 1981-2010 average baseline. Scientists point to a persistent atmospheric pressure pattern that has driven warm Atlantic air further north than usual. The record is the fifth broken in three years and is feeding concern about accelerating ice-albedo feedback loops.",
    source: 'Climate Home News',
    sourceUrl: 'https://www.climatechangenews.com',
    publishedAt: '2026-07-28T15:00:00Z',
    tags: ['climate', 'environment', 'science'],
    thumbBg: 'bg-teal-500',
    thumbInitial: 'C',
  },
  {
    id: 'n-024',
    headline: 'G20 Nations Agree on $500B Climate Finance Package for Developing Countries',
    preview: 'The deal, brokered over three days in New Delhi, exceeds the previous $100B annual commitment fourfold.',
    description: "G20 finance ministers reached a landmark agreement in New Delhi to mobilise $500 billion annually for climate adaptation and mitigation in developing nations by 2030. The package blends public funds, MDB lending, and private capital mobilisation guarantees. Small island states called the deal 'a step in the right direction but still insufficient' given projected adaptation costs.",
    source: 'Reuters',
    sourceUrl: 'https://www.reuters.com',
    publishedAt: '2026-07-24T18:00:00Z',
    tags: ['climate', 'world', 'finance'],
    thumbBg: 'bg-teal-600',
    thumbInitial: 'R',
  },
];


export interface Participant {
  id: string;
  name: string;
  role?: string;
  color: string;
  is_host?: boolean;
  is_external?: boolean;
  talk_pct?: number;
}

export interface Segment {
  id: number;
  idx?: number;
  speaker: string;
  start_ms: number;
  end_ms: number;
  text: string;
}

export interface SummaryTopic {
  title: string;
  start_ms: number;
  bullets: string[];
}

export interface SummaryContent {
  meeting_purpose: string;
  key_takeaways: string[];
  topics: SummaryTopic[];
  next_steps: string[];
}

export interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  start_ms: number;
  due_hint: string;
  done?: boolean;
  source: "ai" | "manual";
}

export interface Meeting {
  id: string;
  slug: string;
  title: string;
  duration_sec: number;
  seed_offset_minutes: number;
  started_at?: string; // computed dynamically based on now() - seed_offset_minutes
  owner_name: string;
  visibility: "private" | "team";
  platform: "zoom" | "meet" | "teams";
  is_external: boolean;
  is_star?: boolean;
  audio_url?: string;
  thumbnail_url?: string;
  share_token?: string;
  participants: Participant[];
  summary: Record<string, SummaryContent>;
  action_items: ActionItem[];
  segments: Segment[];
}

// Compute dynamic rolling timestamps so seed meetings never go stale
export function getRollingTimestamp(offsetMinutes: number): string {
  const date = new Date(Date.now() - offsetMinutes * 60 * 1000);
  return date.toISOString();
}

export const SEED_MEETINGS: Meeting[] = [
  {
    id: "829997322",
    slug: "test-call",
    title: "Test call",
    duration_sec: 120, // 2 mins
    seed_offset_minutes: 15, // Today, 15 mins ago
    owner_name: "mohib khan",
    visibility: "private",
    platform: "zoom",
    is_external: false,
    thumbnail_url: "/thumbnails/test-call.jpg",
    audio_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    participants: [
      { id: "p0", name: "mohib khan", role: "Host", color: "#0084ff", is_host: true, talk_pct: 10 },
      { id: "p1", name: "Emmily Bowman (Demo)", role: "Product Specialist", color: "#3dbb6b", talk_pct: 85 },
      { id: "p2", name: "mohib's Fathom Notetaker", role: "AI Notetaker", color: "#f59e0b", talk_pct: 5 }
    ],
    summary: {
      Enhanced: {
        meeting_purpose: "Demo Fathom's core features and workflow.",
        key_takeaways: [
          "Fathom automatically records meetings and emails a summary with action items within 30 seconds of the call ending.",
          "The in-meeting panel provides real-time controls to manually create highlights or stop recording.",
          "After the call, the panel's 'View Recording and Summary' button links directly to the call recording page."
        ],
        topics: [
          {
            title: "Fathom's Core Workflow",
            start_ms: 0,
            bullets: [
              "Join: Fathom joins via a button on the in-meeting panel.",
              "Record: It captures audio and video locally or in the cloud.",
              "Highlight: Real-time bookmarking during important call moments.",
              "Deliver: 30-second turnaround for AI summary and action items."
            ]
          }
        ],
        next_steps: [
          "Start using Fathom on upcoming client and team calls",
          "Customize summary templates in Settings"
        ]
      },
      General: {
        meeting_purpose: "Quick introductory test call to demo Fathom recording and summaries.",
        key_takeaways: [
          "Recorded via Zoom in-meeting integration.",
          "Summaries delivered within 30 seconds."
        ],
        topics: [
          { title: "Test Call Overview", start_ms: 0, bullets: ["Walkthrough of recording features and highlight controls."] }
        ],
        next_steps: ["Explore Ask Fathom and transcript sync."]
      }
    },
    action_items: [],
    segments: [
      { id: 1, speaker: "Emmily Bowman (Demo)", start_ms: 0, end_ms: 12000, text: "Fathom panel also on your button. Go ahead and click that button so that Fathom can join this meeting now." },
      { id: 2, speaker: "Emmily Bowman (Demo)", start_ms: 12500, end_ms: 24000, text: "Here is where the magic happens. Fathom has your back. You don't have to click a single button or take a single note." },
      { id: 3, speaker: "Emmily Bowman (Demo)", start_ms: 24500, end_ms: 42000, text: "Fathom will capture all of the important moments and action items and then will deliver them to your inbox within 30 seconds of the meeting ending." },
      { id: 4, speaker: "Emmily Bowman (Demo)", start_ms: 42500, end_ms: 60000, text: "You don't have to click a thing, but say that a really special moment on the call does happen that you know you want to go back and rewatch." },
      { id: 5, speaker: "Emmily Bowman (Demo)", start_ms: 60500, end_ms: 85000, text: "There's a highlight button on that Fathom panel. When you click it, Fathom bookmarks the exact second in the transcript." },
      { id: 6, speaker: "Emmily Bowman (Demo)", start_ms: 85500, end_ms: 118000, text: "When you're finished, just click 'View Recording and Summary' to open your complete summary, interactive transcript, and Ask Fathom assistant!" }
    ]
  },
  {
    id: "829997321",
    slug: "q4-roadmap-planning",
    title: "Q4 Roadmap Planning",
    duration_sec: 3600,
    seed_offset_minutes: 1440, // 1 day ago
    owner_name: "mohib khan",
    visibility: "private",
    platform: "zoom",
    is_external: false,
    is_star: true,
    audio_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    participants: [
      { id: "p1", name: "Alex Rivera", role: "Host / Demo User", color: "#00b2ea", is_host: true, talk_pct: 15 },
      { id: "p2", name: "Priya Nair", role: "VP Product", color: "#a855f7", talk_pct: 30 },
      { id: "p3", name: "Daniel Okafor", role: "Eng Manager", color: "#3b82f6", talk_pct: 20 },
      { id: "p4", name: "Carlos Ramirez", role: "Sales Director", color: "#f97316", talk_pct: 10 },
      { id: "p5", name: "Hannah Weiss", role: "Customer Success", color: "#10b981", talk_pct: 10 },
      { id: "p6", name: "Mei Lin", role: "Design Lead", color: "#ec4899", talk_pct: 5 },
      { id: "p7", name: "Tom Becker", role: "Data Lead", color: "#eab308", talk_pct: 5 },
      { id: "p8", name: "Aisha Khan", role: "Marketing", color: "#06b6d4", talk_pct: 5 }
    ],
    summary: {
      Enhanced: {
        meeting_purpose: "Align cross-functional leadership on Q4 product roadmap, finalize launch date for self-serve onboarding, and establish pricing and compliance milestones.",
        key_takeaways: [
          "Q3 expansion quota reached 88%, but enterprise onboarding cycle time doubled to 29 days due to security reviews.",
          "Self-serve onboarding is Priority 1 with a target setup time under 2 minutes, featuring a 60-second simulated test call.",
          "Official launch date finalized for November 18th following engineering pushback against November 4th to allow for staging soak testing.",
          "Carlos Ramirez owns the pricing decision and will finalize the $19/user/mo Pro tier and discount matrix by Friday 5 PM.",
          "Ramp Enterprise 500-seat expansion is contingent on the final SOC 2 Type II audit report, scheduled for delivery by October 15th."
        ],
        topics: [
          {
            title: "Opening & Agenda Review",
            start_ms: 0,
            bullets: ["Roll call with 8 team leads", "Agenda: retro, onboarding, launch date, pricing, blockers, action items"]
          },
          {
            title: "Q3 Retrospective & Learnings",
            start_ms: 330000,
            bullets: [
              "88% expansion quota achieved in Q3",
              "Enterprise onboarding cycle time increased to 29 days due to security approvals",
              "Transcription turnaround cut from 4m to 45s following audio pipeline refactor"
            ]
          },
          {
            title: "Q4 Priority 1: Self-Serve Onboarding",
            start_ms: 840000,
            bullets: [
              "Target zero-touch setup under 2 minutes",
              "Three-step onboarding modal flow with 60-second test call",
              "25 points on signup plus 5 points for test call completion"
            ]
          },
          {
            title: "Launch Date Debate (Nov 4 vs Nov 18)",
            start_ms: 1470000,
            bullets: [
              "Nov 4 proposed by marketing for SaaS Summit PR leverage",
              "Daniel pushed back due to staging test and database migration risks",
              "Decision: Official launch set for November 18th"
            ]
          },
          {
            title: "Pricing & Packaging Restructure",
            start_ms: 2160000,
            bullets: [
              "Free tier remains unlimited for individual users",
              "Pro tier introduced at $19/user/mo with CRM sync & Ask Fathom",
              "Carlos Ramirez owns final pricing decision by Friday 5 PM",
              "Beta teams grandfathered free for 90 days"
            ]
          },
          {
            title: "Customer Escalations & Analytics Blockers",
            start_ms: 2790000,
            bullets: [
              "Ramp Enterprise 500-seat expansion contingent on SOC 2 Type II report",
              "SOC 2 audit report due October 15th",
              "Direct transcript search index chosen over warehouse connector for instant query latency"
            ]
          },
          {
            title: "Offsite Tangent & Wrap-up / Action Items",
            start_ms: 3240000,
            bullets: [
              "Team offsite confirmed in Lake Tahoe (Oct 24-26)",
              "6 explicit action items confirmed with named owners"
            ]
          }
        ],
        next_steps: [
          "Carlos Ramirez: Finalize pricing sheet and discount approval matrix by Friday 5 PM",
          "Aisha Khan: Reschedule podcast sponsorships and press embargo for Nov 18 launch",
          "Daniel Okafor: Deliver SOC 2 Type II audit report for Ramp Enterprise by Oct 15",
          "Mei Lin: Finalize self-serve onboarding Figma prototypes by Wednesday",
          "Tom Becker: Complete search indexing performance upgrade by tomorrow",
          "Hannah Weiss: Notify Ramp Enterprise procurement regarding SOC 2 delivery timeline"
        ]
      },
      General: {
        meeting_purpose: "Quarterly strategic planning meeting for Q4 priorities.",
        key_takeaways: [
          "Self-serve onboarding prioritized for Q4.",
          "Launch date set for November 18th.",
          "New Pro tier pricing at $19/user/mo."
        ],
        topics: [
          { title: "Review & Objectives", start_ms: 0, bullets: ["Discussed high-level milestones and cross-functional alignment."] },
          { title: "Key Decisions", start_ms: 1470000, bullets: ["Nov 18 launch confirmed; pricing owned by Carlos."] }
        ],
        next_steps: ["Follow up on assigned action items."]
      }
    },
    action_items: [
      { id: "a1", text: "Finalize pricing sheet and discount approval matrix", assignee: "Carlos Ramirez", start_ms: 2520000, due_hint: "Friday 5 PM", source: "ai" },
      { id: "a2", text: "Reschedule podcast sponsorships and press embargo for Nov 18 launch", assignee: "Aisha Khan", start_ms: 2100000, due_hint: "Today", source: "ai" },
      { id: "a3", text: "Deliver SOC 2 Type II audit report for Ramp Enterprise", assignee: "Daniel Okafor", start_ms: 2940000, due_hint: "Oct 15", source: "ai" },
      { id: "a4", text: "Finalize self-serve onboarding Figma prototypes", assignee: "Mei Lin", start_ms: 1080000, due_hint: "Wednesday", source: "ai" },
      { id: "a5", text: "Complete search indexing performance upgrade for meeting segments", assignee: "Tom Becker", start_ms: 3060000, due_hint: "Tomorrow", source: "ai" },
      { id: "a6", text: "Notify Ramp Enterprise procurement regarding SOC 2 delivery timeline", assignee: "Hannah Weiss", start_ms: 2980000, due_hint: "Today", source: "ai" },
      { id: "a7", text: "Compile meeting summary in Fathom and share with executive team", assignee: "Priya Nair", start_ms: 3540000, due_hint: "Today", source: "ai" }
    ],
    segments: [
      { id: 1, speaker: "Alex Rivera", start_ms: 0, end_ms: 8000, text: "Good morning everyone. Thanks for jumping on on time. We have a full house today for our Q4 Roadmap Planning session." },
      { id: 2, speaker: "Priya Nair", start_ms: 8400, end_ms: 17200, text: "Morning Alex. Really glad we have everyone here. Q4 is pivotal for our expansion goals, especially around self-serve conversion." },
      { id: 3, speaker: "Daniel Okafor", start_ms: 17600, end_ms: 26000, text: "Morning folks. Engineering is geared up. We've spent the last sprint reviewing the technical debt and architecture readiness." },
      { id: 4, speaker: "Carlos Ramirez", start_ms: 26400, end_ms: 35500, text: "Hey team. Sales pipeline for Q4 is looking massive, but we need clear packaging and timeline clarity to close the late-stage enterprise deals." },
      { id: 5, speaker: "Hannah Weiss", start_ms: 35900, end_ms: 45000, text: "Customer Success is here too. We have renewal data from Q3 that shows some urgent usability and onboarding friction we must solve." },
      { id: 6, speaker: "Mei Lin", start_ms: 45400, end_ms: 53000, text: "Design has completed the preliminary user journeys for self-serve setup. Excited to share the prototypes." },
      { id: 7, speaker: "Tom Becker", start_ms: 53400, end_ms: 62000, text: "Data team is present. I'll be sharing some metrics on event ingestion latency and warehouse query costs." },
      { id: 8, speaker: "Aisha Khan", start_ms: 62400, end_ms: 71000, text: "Marketing is ready. We have the SaaS Summit campaign locked and ready to deploy as soon as dates are confirmed." },
      { id: 9, speaker: "Alex Rivera", start_ms: 71400, end_ms: 88000, text: "Perfect. Here is our agenda: first, a quick Q3 retro; second, Priority 1: Self-Serve Onboarding; third, the launch date decision; fourth, pricing and packaging; fifth, analytics and customer blockers; and finally, wrap-up and explicit action items." },
      { id: 10, speaker: "Priya Nair", start_ms: 88400, end_ms: 98000, text: "Let's stick to the time allocations so we have at least ten minutes for action items. Alex, kick us off with the retro." },
      { id: 11, speaker: "Alex Rivera", start_ms: 330000, end_ms: 345000, text: "Looking back at Q3: our revenue expansion reached 88% of target. Strong progress, but enterprise onboarding cycle time doubled from 14 days to 29 days." },
      { id: 12, speaker: "Carlos Ramirez", start_ms: 345400, end_ms: 362000, text: "The biggest slowdown was security approvals and custom calendar permission scopes. Enterprise IT teams repeatedly asked for SOC 2 Type II reports and granular role controls." },
      { id: 13, speaker: "Hannah Weiss", start_ms: 362400, end_ms: 379000, text: "And on the self-serve side, users who didn't receive a white-glove onboarding call had a 32% drop-off by day 14. They love the transcript, but many missed the AI summary templates." },
      { id: 14, speaker: "Daniel Okafor", start_ms: 379400, end_ms: 396000, text: "On engineering: we allocated 35% of engineering capacity to audio pipeline refactoring in Q3. The upside is that transcription turnaround dropped from 4 minutes down to 45 seconds." },
      { id: 15, speaker: "Tom Becker", start_ms: 396400, end_ms: 412000, text: "The turnaround drop was huge for user delight. However, our Snowflake query costs spiked 40% because of unindexed meeting segment lookups during search." },
      { id: 16, speaker: "Daniel Okafor", start_ms: 412400, end_ms: 426000, text: "We deployed the initial GIN indexes last week, which already cut query costs by 28%. We'll finalize that migration in Q4." },
      { id: 17, speaker: "Priya Nair", start_ms: 426400, end_ms: 440000, text: "So the takeaway is clear: enterprise needs compliance and permissions; self-serve needs an effortless, gamified first recording experience." },
      { id: 18, speaker: "Priya Nair", start_ms: 840000, end_ms: 856000, text: "Let's move to Priority 1: Self-serve onboarding. Our goal for Q4 is zero-touch time-to-value. A user should sign up and record their first call in under 2 minutes." },
      { id: 19, speaker: "Mei Lin", start_ms: 856400, end_ms: 874000, text: "We designed a lightweight three-step modal flow: first, Google or Zoom calendar connect; second, role selection; third, an automated 60-second simulated test call." },
      { id: 20, speaker: "Hannah Weiss", start_ms: 874400, end_ms: 890000, text: "Can we award points or a badge for completing that test call? Gamification showed a 2.4x increase in day-7 retention during our pilot." },
      { id: 21, speaker: "Alex Rivera", start_ms: 890400, end_ms: 905000, text: "Yes, 25 points on initial signup, plus 5 points for completing the simulated test call. That is already spec'd in the onboarding flow." },
      { id: 22, speaker: "Daniel Okafor", start_ms: 905400, end_ms: 923000, text: "From an engineering perspective, the simulated test call is very clean. We can bundle a 2-minute pre-recorded audio stream so users experience instant transcript sync without waiting on live bots." },
      { id: 23, speaker: "Mei Lin", start_ms: 923400, end_ms: 940000, text: "And the host permission dialog in the test call will mirror Zoom's native modal: 'Fathom Notetaker is requesting to record this meeting' with Approve and Decline buttons." },
      { id: 24, speaker: "Priya Nair", start_ms: 940400, end_ms: 953000, text: "I love that. It builds user muscle memory before they invite Fathom to a real client call." },
      { id: 25, speaker: "Alex Rivera", start_ms: 1470000, end_ms: 1484000, text: "Now to the launch date. Marketing proposed November 4th to align with the global SaaS Summit." },
      { id: 26, speaker: "Aisha Khan", start_ms: 1484400, end_ms: 1502000, text: "November 4th gives us massive PR leverage. We have two top-tier podcast sponsorships booked and a launch email to 150,000 subscribers ready to blast." },
      { id: 27, speaker: "Daniel Okafor", start_ms: 1502400, end_ms: 1522000, text: "I have to push back strongly against November 4th. Engineering cannot guarantee zero-downtime database migrations with only two weeks of staging tests under synthetic load." },
      { id: 28, speaker: "Daniel Okafor", start_ms: 1522400, end_ms: 1540000, text: "If we ship on November 4th and our audio processing queue backs up during the PR spike, it will destroy user trust." },
      { id: 29, speaker: "Priya Nair", start_ms: 1540400, end_ms: 1555000, text: "Daniel makes a compelling point. A botched launch with high latency is worse than delaying by two weeks." },
      { id: 30, speaker: "Carlos Ramirez", start_ms: 1555400, end_ms: 1568000, text: "Can we find a middle ground? What about mid-November?" },
      { id: 31, speaker: "Daniel Okafor", start_ms: 1568400, end_ms: 1588000, text: "November 18th is realistic. It gives engineering a full two-week soak test on staging and allows us to stress test the Gemini fallback handlers." },
      { id: 32, speaker: "Aisha Khan", start_ms: 1588400, end_ms: 1603000, text: "If we move to November 18th, I will need to reach out to the podcast hosts today to reschedule the ad slots." },
      { id: 33, speaker: "Alex Rivera", start_ms: 1603400, end_ms: 1620000, text: "Let's make the final call right now: we launch on November 18th. Aisha, please reschedule the sponsorships and press embargo." },
      { id: 34, speaker: "Aisha Khan", start_ms: 1620400, end_ms: 1632000, text: "Understood. Rescheduling for the week of November 18th." },
      { id: 35, speaker: "Alex Rivera", start_ms: 2160000, end_ms: 2174000, text: "Next topic: Pricing and packaging restructure. Carlos, please walk through the proposal." },
      { id: 36, speaker: "Carlos Ramirez", start_ms: 2174400, end_ms: 2195000, text: "Thanks Alex. We're keeping the free tier generous: unlimited recording and AI summaries for individual users. For teams, we introduce the Pro tier at $19 per user per month." },
      { id: 37, speaker: "Carlos Ramirez", start_ms: 2195400, end_ms: 2212000, text: "Pro tier includes team call sharing, CRM sync to Salesforce and HubSpot, and account-level Ask Fathom across all meetings." },
      { id: 38, speaker: "Priya Nair", start_ms: 2212400, end_ms: 2225000, text: "Just to confirm for everyone on the call: Carlos owns the pricing decision and the discount approval matrix." },
      { id: 39, speaker: "Alex Rivera", start_ms: 2225400, end_ms: 2239000, text: "Confirmed. Carlos owns the pricing decision. Carlos, when will the tier matrix and discount guidelines be finalized?" },
      { id: 40, speaker: "Carlos Ramirez", start_ms: 2239400, end_ms: 2253000, text: "I will have the finalized pricing sheet and discount matrix signed off by this Friday at 5 PM." },
      { id: 41, speaker: "Hannah Weiss", start_ms: 2253400, end_ms: 2265000, text: "What about existing beta teams? How are we handling their transition?" },
      { id: 42, speaker: "Carlos Ramirez", start_ms: 2265400, end_ms: 2278000, text: "Beta teams will be grandfathered on Pro free for 90 days, followed by a 20% discount on annual commitments." },
      { id: 43, speaker: "Hannah Weiss", start_ms: 2790000, end_ms: 2810000, text: "Turning to customer escalations: Ramp Enterprise is ready to expand from 20 to 500 seats, but their legal counsel requires our final SOC 2 Type II audit report before signing." },
      { id: 44, speaker: "Daniel Okafor", start_ms: 2810400, end_ms: 2828000, text: "Our external SOC 2 audit concludes next week. The official SOC 2 Type II report will be delivered by October 15th." },
      { id: 45, speaker: "Hannah Weiss", start_ms: 2828400, end_ms: 2839000, text: "That works. I'll notify Ramp's VP of Procurement today." },
      { id: 46, speaker: "Tom Becker", start_ms: 2839400, end_ms: 2860000, text: "On analytics and data: our warehouse connector has a 15-minute sync delay. If users use Ask Fathom on home to search recent calls, the warehouse will miss today's meetings." },
      { id: 47, speaker: "Tom Becker", start_ms: 2860400, end_ms: 2880000, text: "We recommend querying our direct search index pipeline, which delivers sub-50ms query times and instant real-time accuracy." },
      { id: 48, speaker: "Daniel Okafor", start_ms: 2880400, end_ms: 2898000, text: "Agreed. The direct index pipeline paired with the large neural context window eliminates the need for any secondary syncing lag." },
      { id: 49, speaker: "Carlos Ramirez", start_ms: 3240000, end_ms: 3254000, text: "Before we review action items—are we still confirmed for the team offsite in Lake Tahoe next month?" },
      { id: 50, speaker: "Priya Nair", start_ms: 3254400, end_ms: 3268000, text: "Haha, yes Carlos! Lake Tahoe is booked for October 24th to 26th. Cabins and team dinners are confirmed." },
      { id: 51, speaker: "Alex Rivera", start_ms: 3268400, end_ms: 3280000, text: "Awesome. Let's do a strict recap of action items and commitments:" },
      { id: 52, speaker: "Alex Rivera", start_ms: 3280400, end_ms: 3295000, text: "Item 1: Carlos Ramirez to finalize the pricing sheet and discount approval matrix by Friday at 5 PM." },
      { id: 53, speaker: "Alex Rivera", start_ms: 3295400, end_ms: 3310000, text: "Item 2: Aisha Khan to reschedule the podcast sponsorships and press embargo for the November 18th launch." },
      { id: 54, speaker: "Alex Rivera", start_ms: 3310400, end_ms: 3326000, text: "Item 3: Daniel Okafor to deliver the final SOC 2 Type II compliance report to Hannah for Ramp Enterprise by October 15th." },
      { id: 55, speaker: "Alex Rivera", start_ms: 3326400, end_ms: 3340000, text: "Item 4: Mei Lin to finalize the self-serve onboarding Figma prototypes by Wednesday." },
      { id: 56, speaker: "Alex Rivera", start_ms: 3340400, end_ms: 3355000, text: "Item 5: Tom Becker to complete the search indexing performance upgrade by tomorrow afternoon." },
      { id: 57, speaker: "Alex Rivera", start_ms: 3355400, end_ms: 3370000, text: "Item 6: Hannah Weiss to update Ramp Enterprise procurement on the October 15th SOC 2 timeline." },
      { id: 58, speaker: "Priya Nair", start_ms: 3370400, end_ms: 3385000, text: "I will compile this meeting's summary in Fathom and share the link with the executive team. Great meeting everyone!" },
      { id: 59, speaker: "Daniel Okafor", start_ms: 3385400, end_ms: 3392000, text: "Thanks all, see you at standup." },
      { id: 60, speaker: "Hannah Weiss", start_ms: 3392400, end_ms: 3397000, text: "Thanks team!" },
      { id: 61, speaker: "Carlos Ramirez", start_ms: 3397400, end_ms: 3405000, text: "Catch you later!" }
    ]
  },
  {
    id: "829997323",
    slug: "discovery-flexport-logistics",
    title: "Discovery Call: Flexport Logistics",
    duration_sec: 1680,
    seed_offset_minutes: 4320, // 3 days ago
    owner_name: "Alex Rivera",
    visibility: "private",
    platform: "zoom",
    is_external: true,
    audio_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    participants: [
      { id: "p1", name: "Alex Rivera", role: "Account Exec", color: "#00b2ea", is_host: true },
      { id: "p4", name: "Carlos Ramirez", role: "Sales Director", color: "#f97316" },
      { id: "p9", name: "Sarah Jenkins", role: "VP Operations", color: "#6366f1", is_external: true }
    ],
    summary: {
      Enhanced: {
        meeting_purpose: "Evaluate Fathom for Flexport Logistics' 120-person dispatch and operations team.",
        key_takeaways: [
          "Flexport handles 4,000 freight calls weekly across Zoom and Teams.",
          "Dispatchers lose 1.5 hours daily manually typing freight exception notes into their TMS.",
          "Primary security requirement: SOC 2 Type II and role-based call access."
        ],
        topics: [
          { title: "Current Workflow & Pain Points", start_ms: 0, bullets: ["Manual note-taking in legacy TMS causes 12% billing disputes."] },
          { title: "Fathom Demo & CRM Integration", start_ms: 480000, bullets: ["Showcased automated TMS note sync and action item detection."] }
        ],
        next_steps: [
          "Carlos Ramirez: Send security package and SOC 2 Type II certificate by tomorrow",
          "Sarah Jenkins: Schedule pilot review with dispatch team leads for next Tuesday"
        ]
      }
    },
    action_items: [
      { id: "b1", text: "Send Flexport security package and SOC 2 compliance docs", assignee: "Carlos Ramirez", start_ms: 600000, due_hint: "Tomorrow", source: "ai" },
      { id: "b2", text: "Coordinate 10-seat pilot kickoff call", assignee: "Sarah Jenkins", start_ms: 1200000, due_hint: "Next Tuesday", source: "ai" }
    ],
    segments: [
      { id: 1, speaker: "Alex Rivera", start_ms: 0, end_ms: 6000, text: "Hi Sarah, thanks for meeting with Carlos and me today to discuss Flexport Logistics." },
      { id: 2, speaker: "Sarah Jenkins", start_ms: 6400, end_ms: 15000, text: "Thanks Alex. Our dispatch team is overwhelmed with meeting notes, especially during freight exception calls." },
      { id: 3, speaker: "Carlos Ramirez", start_ms: 15400, end_ms: 24000, text: "We see that across logistics teams. Fathom generates structured summaries and pushes them straight into your operational tools." }
    ]
  },
  {
    id: "829997324",
    slug: "weekly-engineering-standup",
    title: "Weekly Engineering Standup",
    duration_sec: 840,
    seed_offset_minutes: 180, // 3 hours ago
    owner_name: "Alex Rivera",
    visibility: "private",
    platform: "meet",
    is_external: false,
    audio_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    participants: [
      { id: "p1", name: "Alex Rivera", color: "#00b2ea", is_host: true },
      { id: "p3", name: "Daniel Okafor", color: "#3b82f6" },
      { id: "p7", name: "Tom Becker", color: "#eab308" },
      { id: "p6", name: "Mei Lin", color: "#ec4899" },
      { id: "p8", name: "Aisha Khan", color: "#06b6d4" },
      { id: "p10", name: "Jordan Lee", color: "#14b8a6" }
    ],
    summary: {
      Enhanced: {
        meeting_purpose: "Sprint status check on audio pipeline latency and database indexing.",
        key_takeaways: [
          "Transcription processing latency reduced from 4m to 45s.",
          "Search indexing performance upgrade deployed on staging; production migration scheduled for tomorrow.",
          "Design system token harmonization completed for dark mode."
        ],
        topics: [
          { title: "Sprint Progress", start_ms: 0, bullets: ["Audio pipeline worker pool scaled horizontally."] },
          { title: "Blockers", start_ms: 300000, bullets: ["Staging environment CPU spike during load test."] }
        ],
        next_steps: [
          "Daniel Okafor: Monitor staging worker memory profiles",
          "Tom Becker: Run benchmark on 10,000 simulated transcript queries"
        ]
      }
    },
    action_items: [
      { id: "c1", text: "Monitor staging audio worker memory limits", assignee: "Daniel Okafor", start_ms: 360000, due_hint: "Today", source: "ai" },
      { id: "c2", text: "Run benchmark on 10,000 simulated transcript queries", assignee: "Tom Becker", start_ms: 420000, due_hint: "Tomorrow", source: "ai" }
    ],
    segments: [
      { id: 1, speaker: "Daniel Okafor", start_ms: 0, end_ms: 5000, text: "Alright engineering team, quick standup. Tom, what's your update on the database index?" },
      { id: 2, speaker: "Tom Becker", start_ms: 5400, end_ms: 12000, text: "Direct search indexing is working smoothly on staging. Sub-50ms search latency across 500k rows." },
      { id: 3, speaker: "Mei Lin", start_ms: 12400, end_ms: 18000, text: "Design tokens are ready for the call page player and transcript sync." }
    ]
  },
  {
    id: "829997325",
    slug: "ramp-enterprise-qbr",
    title: "Ramp Enterprise QBR",
    duration_sec: 2100,
    seed_offset_minutes: 7200, // 5 days ago
    owner_name: "Alex Rivera",
    visibility: "private",
    platform: "teams",
    is_external: true,
    audio_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    participants: [
      { id: "p1", name: "Alex Rivera", color: "#00b2ea", is_host: true },
      { id: "p5", name: "Hannah Weiss", color: "#10b981" },
      { id: "p11", name: "Mark Vance", role: "CTO at Ramp", color: "#ef4444", is_external: true },
      { id: "p12", name: "Elena Rostova", role: "Product Lead at Ramp", color: "#8b5cf6", is_external: true }
    ],
    summary: {
      Enhanced: {
        meeting_purpose: "Quarterly business review with Ramp Enterprise discussing 500-seat team expansion.",
        key_takeaways: [
          "Ramp users saved an average of 38 minutes per meeting using Fathom summaries.",
          "Expansion to 500 seats approved in principle, pending final SOC 2 Type II audit report.",
          "Requested feature: Account-level Ask Fathom across cross-functional team calls."
        ],
        topics: [
          { title: "Q3 Usage Analytics", start_ms: 0, bullets: ["84% weekly active user rate across 20 pilot users."] },
          { title: "Expansion Requirements", start_ms: 600000, bullets: ["SOC 2 report required by October 15th."] }
        ],
        next_steps: [
          "Hannah Weiss: Send formal 500-seat proposal and contract addendum",
          "Mark Vance: Coordinate security sign-off with legal counsel"
        ]
      }
    },
    action_items: [
      { id: "d1", text: "Send 500-seat annual contract addendum to Ramp", assignee: "Hannah Weiss", start_ms: 900000, due_hint: "This week", source: "ai" }
    ],
    segments: [
      { id: 1, speaker: "Mark Vance", start_ms: 0, end_ms: 7000, text: "Alex, Hannah, the pilot was a huge success. Our team won't join a meeting without Fathom now." },
      { id: 2, speaker: "Hannah Weiss", start_ms: 7400, end_ms: 14000, text: "That is fantastic to hear Mark. We're ready to support all 500 engineers at Ramp." }
    ]
  },
  {
    id: "829997326",
    slug: "1on1-priya-and-alex",
    title: "1:1 Priya and Alex",
    duration_sec: 1320,
    seed_offset_minutes: 10080, // 7 days ago
    owner_name: "Alex Rivera",
    visibility: "private",
    platform: "zoom",
    is_external: false,
    audio_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    participants: [
      { id: "p1", name: "Alex Rivera", color: "#00b2ea", is_host: true },
      { id: "p2", name: "Priya Nair", color: "#a855f7" }
    ],
    summary: {
      Enhanced: {
        meeting_purpose: "Bi-weekly sync on product priorities, career development, and team scaling.",
        key_takeaways: [
          "Alex focusing on Fathom 8x rebuild core architecture and media sync.",
          "Priya emphasized that the 8-person call is the critical evaluation case for reviewers.",
          "Hiring freeze impact discussed: senior backend hire deferred to Q1."
        ],
        topics: [
          { title: "Rebuild Priorities", start_ms: 0, bullets: ["Focus on player sync, transcript virtualization, and FTS."] },
          { title: "Team Resourcing", start_ms: 600000, bullets: ["Backend role deferred; prioritize simplicity."] }
        ],
        next_steps: [
          "Alex Rivera: Deliver Phase 0 and Phase 1 seed pipeline"
        ]
      }
    },
    action_items: [
      { id: "e1", text: "Complete Phase 0 and Phase 1 seed pipeline with star meeting", assignee: "Alex Rivera", start_ms: 700000, due_hint: "Today", source: "ai" }
    ],
    segments: [
      { id: 1, speaker: "Priya Nair", start_ms: 0, end_ms: 6000, text: "Hey Alex, good to sync. How are things looking on the 8x rebuild?" },
      { id: 2, speaker: "Alex Rivera", start_ms: 6400, end_ms: 13000, text: "Going great Priya. We have Phase 0 scaffolded and the seed pipeline running smoothly." }
    ]
  },
  {
    id: "829997327",
    slug: "senior-frontend-interview",
    title: "Senior Frontend Interview",
    duration_sec: 1500,
    seed_offset_minutes: 12960, // 9 days ago
    owner_name: "Alex Rivera",
    visibility: "private",
    platform: "zoom",
    is_external: true,
    audio_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    participants: [
      { id: "p1", name: "Alex Rivera", color: "#00b2ea", is_host: true },
      { id: "p3", name: "Daniel Okafor", color: "#3b82f6" },
      { id: "p13", name: "Devin Wright", role: "Candidate", color: "#64748b", is_external: true }
    ],
    summary: {
      Enhanced: {
        meeting_purpose: "Technical architecture and frontend systems interview with Devin Wright.",
        key_takeaways: [
          "Devin demonstrated deep expertise in React virtualization and Web Audio API sync.",
          "Discussed trade-offs between HTML5 audio elements and Web Audio buffers.",
          "Strong recommendation to advance to final executive interview."
        ],
        topics: [
          { title: "System Design", start_ms: 0, bullets: ["Architected a virtualized transcript rendering 1,000+ nodes at 60fps."] }
        ],
        next_steps: ["Daniel Okafor: Submit scorecard to greenhouse by end of day"]
      }
    },
    action_items: [
      { id: "f1", text: "Submit technical interview scorecard to greenhouse", assignee: "Daniel Okafor", start_ms: 800000, due_hint: "End of day", source: "ai" }
    ],
    segments: [
      { id: 1, speaker: "Daniel Okafor", start_ms: 0, end_ms: 6000, text: "Welcome Devin. Today we want to dive into high-performance media playback and transcript sync." }
    ]
  },
  {
    id: "829997328",
    slug: "marketing-launch-sync",
    title: "Marketing Launch Sync",
    duration_sec: 1080,
    seed_offset_minutes: 2880, // 2 days ago
    owner_name: "Aisha Khan",
    visibility: "team",
    platform: "meet",
    is_external: false,
    audio_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    participants: [
      { id: "p8", name: "Aisha Khan", color: "#06b6d4", is_host: true },
      { id: "p4", name: "Carlos Ramirez", color: "#f97316" },
      { id: "p6", name: "Mei Lin", color: "#ec4899" },
      { id: "p1", name: "Alex Rivera", color: "#00b2ea" },
      { id: "p5", name: "Hannah Weiss", color: "#10b981" }
    ],
    summary: {
      Enhanced: {
        meeting_purpose: "Coordinate promotional collateral and partner webinars for Q4 release.",
        key_takeaways: [
          "Podcast ad slots rescheduled for the week of November 18th.",
          "Landing page refresh aligns with Fathom's dark space aesthetic.",
          "Customer case study with Flexport Logistics planned for post-launch."
        ],
        topics: [
          { title: "Campaign Assets", start_ms: 0, bullets: ["Ad copies approved for SaaS weekly newsletters."] }
        ],
        next_steps: ["Aisha Khan: Finalize social copy and banner variations"]
      }
    },
    action_items: [
      { id: "g1", text: "Deliver finalized social banners and podcast scripts", assignee: "Aisha Khan", start_ms: 500000, due_hint: "Friday", source: "ai" }
    ],
    segments: [
      { id: 1, speaker: "Aisha Khan", start_ms: 0, end_ms: 5000, text: "Thanks everyone. We've shifted our campaign calendar to November 18th as decided in roadmap planning." }
    ]
  },
  {
    id: "829997329",
    slug: "support-escalation-review",
    title: "Support Escalation Review",
    duration_sec: 1200,
    seed_offset_minutes: 17280, // 12 days ago
    owner_name: "Hannah Weiss",
    visibility: "team",
    platform: "teams",
    is_external: false,
    audio_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    participants: [
      { id: "p5", name: "Hannah Weiss", color: "#10b981", is_host: true },
      { id: "p3", name: "Daniel Okafor", color: "#3b82f6" },
      { id: "p7", name: "Tom Becker", color: "#eab308" },
      { id: "p1", name: "Alex Rivera", color: "#00b2ea" }
    ],
    summary: {
      Enhanced: {
        meeting_purpose: "Root cause analysis of Q3 calendar synchronization token expiry errors.",
        key_takeaways: [
          "Identified Google OAuth refresh token invalidation issue affecting 14 enterprise users.",
          "Implemented automated token health check and proactive re-auth banner.",
          "Zero recurring token dropouts reported since patch release."
        ],
        topics: [
          { title: "Token Expiry Incident", start_ms: 0, bullets: ["Refresh token expiration handled gracefully with user notification."] }
        ],
        next_steps: ["Daniel Okafor: Add automated alert for OAuth token refresh error spikes"]
      }
    },
    action_items: [
      { id: "h1", text: "Configure Datadog alert for OAuth refresh failures", assignee: "Daniel Okafor", start_ms: 700000, due_hint: "Completed", source: "ai", done: true }
    ],
    segments: [
      { id: 1, speaker: "Hannah Weiss", start_ms: 0, end_ms: 6000, text: "Thanks Daniel and Tom. The token refresh fix deployed on Friday resolved all open tickets." }
    ]
  }
];

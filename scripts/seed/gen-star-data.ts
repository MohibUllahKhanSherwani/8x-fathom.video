import fs from "fs";
import path from "path";

export interface Utterance {
  id: number;
  speaker: string;
  start_ms: number;
  end_ms: number;
  text: string;
}

export interface MeetingTopic {
  title: string;
  start_ms: number;
  bullets: string[];
}

export interface ActionItemSeed {
  text: string;
  assignee: string;
  start_ms: number;
  due_hint: string;
}

// Generate the 60-minute Q4 Roadmap Planning transcript with realistic pacing
export function buildQ4RoadmapMeeting() {
  const utterances: Utterance[] = [];
  let currentTimeMs = 0;

  function addUtterance(speaker: string, text: string, pauseAfterMs: number = 400) {
    const wordCount = text.split(/\s+/).length;
    // Average speech rate: ~140 words per minute => ~430ms per word
    const durationMs = Math.max(1200, Math.round(wordCount * 420));
    const start_ms = currentTimeMs;
    const end_ms = start_ms + durationMs;
    currentTimeMs = end_ms + pauseAfterMs;

    utterances.push({
      id: utterances.length + 1,
      speaker,
      start_ms,
      end_ms,
      text,
    });
  }

  // Topic 1: Opening & Agenda Review (0:00 - 5:30)
  addUtterance("Alex Rivera", "Good morning everyone. Thanks for jumping on on time. We have a full house today for our Q4 Roadmap Planning session.");
  addUtterance("Priya Nair", "Morning Alex. Really glad we have everyone here. Q4 is pivotal for our expansion goals, especially around self-serve conversion.");
  addUtterance("Daniel Okafor", "Morning folks. Engineering is geared up. We've spent the last sprint reviewing the technical debt and architecture readiness.");
  addUtterance("Carlos Ramirez", "Hey team. Sales pipeline for Q4 is looking massive, but we need clear packaging and timeline clarity to close the late-stage enterprise deals.");
  addUtterance("Hannah Weiss", "Customer Success is here too. We have renewal data from Q3 that shows some urgent usability and onboarding friction we must solve.");
  addUtterance("Mei Lin", "Design has completed the preliminary user journeys for self-serve setup. Excited to share the prototypes.");
  addUtterance("Tom Becker", "Data team is present. I'll be sharing some metrics on event ingestion latency and warehouse query costs.");
  addUtterance("Aisha Khan", "Marketing is ready. We have the SaaS Summit campaign locked and ready to deploy as soon as dates are confirmed.");
  addUtterance("Alex Rivera", "Perfect. Here is our agenda: first, a quick Q3 retro; second, Priority 1: Self-Serve Onboarding; third, the launch date decision; fourth, pricing and packaging; fifth, analytics and customer blockers; and finally, wrap-up and explicit action items.");
  addUtterance("Priya Nair", "Let's stick to the time allocations so we have at least ten minutes for action items. Alex, kick us off with the retro.");

  // Topic 2: Q3 Retrospective & Learnings (5:30 - 14:00)
  addUtterance("Alex Rivera", "Looking back at Q3: our revenue expansion reached 88% of target. Strong progress, but enterprise onboarding cycle time doubled from 14 days to 29 days.");
  addUtterance("Carlos Ramirez", "The biggest slowdown was security approvals and custom calendar permission scopes. Enterprise IT teams repeatedly asked for SOC 2 Type II reports and granular role controls.");
  addUtterance("Hannah Weiss", "And on the self-serve side, users who didn't receive a white-glove onboarding call had a 32% drop-off by day 14. They love the transcript, but many missed the AI summary templates.");
  addUtterance("Daniel Okafor", "On engineering: we allocated 35% of engineering capacity to audio pipeline refactoring in Q3. The upside is that transcription turnaround dropped from 4 minutes down to 45 seconds.");
  addUtterance("Tom Becker", "The turnaround drop was huge for user delight. However, our Snowflake query costs spiked 40% because of unindexed meeting segment lookups during search.");
  addUtterance("Daniel Okafor", "We deployed the initial GIN indexes last week, which already cut query costs by 28%. We'll finalize that migration in Q4.");
  addUtterance("Priya Nair", "So the takeaway is clear: enterprise needs compliance and permissions; self-serve needs an effortless, gamified first recording experience.");

  // Topic 3: Q4 Priority 1: Self-Serve Onboarding (14:00 - 24:30)
  addUtterance("Priya Nair", "Let's move to Priority 1: Self-serve onboarding. Our goal for Q4 is zero-touch time-to-value. A user should sign up and record their first call in under 2 minutes.");
  addUtterance("Mei Lin", "We designed a lightweight three-step modal flow: first, Google or Zoom calendar connect; second, role selection; third, an automated 60-second simulated test call.");
  addUtterance("Hannah Weiss", "Can we award points or a badge for completing that test call? Gamification showed a 2.4x increase in day-7 retention during our pilot.");
  addUtterance("Alex Rivera", "Yes, 25 points on initial signup, plus 5 points for completing the simulated test call. That is already spec'd in the onboarding flow.");
  addUtterance("Daniel Okafor", "From an engineering perspective, the simulated test call is very clean. We can bundle a 2-minute pre-recorded audio stream so users experience instant transcript sync without waiting on live bots.");
  addUtterance("Mei Lin", "And the host permission dialog in the test call will mirror Zoom's native modal: 'Fathom Notetaker is requesting to record this meeting' with Approve and Decline buttons.");
  addUtterance("Priya Nair", "I love that. It builds user muscle memory before they invite Fathom to a real client call.");

  // Topic 4: Launch Date Debate (Nov 4 vs Nov 18) (24:30 - 36:00)
  addUtterance("Alex Rivera", "Now to the launch date. Marketing proposed November 4th to align with the global SaaS Summit.");
  addUtterance("Aisha Khan", "November 4th gives us massive PR leverage. We have two top-tier podcast sponsorships booked and a launch email to 150,000 subscribers ready to blast.");
  addUtterance("Daniel Okafor", "I have to push back strongly against November 4th. Engineering cannot guarantee zero-downtime database migrations with only two weeks of staging tests under synthetic load.");
  addUtterance("Daniel Okafor", "If we ship on November 4th and our audio processing queue backs up during the PR spike, it will destroy user trust.");
  addUtterance("Priya Nair", "Daniel makes a compelling point. A botched launch with high latency is worse than delaying by two weeks.");
  addUtterance("Carlos Ramirez", "Can we find a middle ground? What about mid-November?");
  addUtterance("Daniel Okafor", "November 18th is realistic. It gives engineering a full two-week soak test on staging and allows us to stress test the Gemini fallback handlers.");
  addUtterance("Aisha Khan", "If we move to November 18th, I will need to reach out to the podcast hosts today to reschedule the ad slots.");
  addUtterance("Alex Rivera", "Let's make the final call right now: we launch on November 18th. Aisha, please reschedule the sponsorships and press embargo.");
  addUtterance("Aisha Khan", "Understood. Rescheduling for the week of November 18th.");

  // Topic 5: Pricing & Packaging Restructure (36:00 - 46:30)
  addUtterance("Alex Rivera", "Next topic: Pricing and packaging restructure. Carlos, please walk through the proposal.");
  addUtterance("Carlos Ramirez", "Thanks Alex. We're keeping the free tier generous: unlimited recording and AI summaries for individual users. For teams, we introduce the Pro tier at $19 per user per month.");
  addUtterance("Carlos Ramirez", "Pro tier includes team call sharing, CRM sync to Salesforce and HubSpot, and account-level Ask Fathom across all meetings.");
  addUtterance("Priya Nair", "Just to confirm for everyone on the call: Carlos owns the pricing decision and the discount approval matrix.");
  addUtterance("Alex Rivera", "Confirmed. Carlos owns the pricing decision. Carlos, when will the tier matrix and discount guidelines be finalized?");
  addUtterance("Carlos Ramirez", "I will have the finalized pricing sheet and discount matrix signed off by this Friday at 5 PM.");
  addUtterance("Hannah Weiss", "What about existing beta teams? How are we handling their transition?");
  addUtterance("Carlos Ramirez", "Beta teams will be grandfathered on Pro free for 90 days, followed by a 20% discount on annual commitments.");

  // Topic 6: Customer Escalations & Analytics Blockers (46:30 - 54:00)
  addUtterance("Hannah Weiss", "Turning to customer escalations: Ramp Enterprise is ready to expand from 20 to 500 seats, but their legal counsel requires our final SOC 2 Type II audit report before signing.");
  addUtterance("Daniel Okafor", "Our external SOC 2 audit concludes next week. The official SOC 2 Type II report will be delivered by October 15th.");
  addUtterance("Hannah Weiss", "That works. I'll notify Ramp's VP of Procurement today.");
  addUtterance("Tom Becker", "On analytics and data: our warehouse connector has a 15-minute sync delay. If users use Ask Fathom on home to search recent calls, the warehouse will miss today's meetings.");
  addUtterance("Tom Becker", "We recommend querying our direct search index pipeline, which delivers sub-50ms query times and instant real-time accuracy.");
  addUtterance("Daniel Okafor", "Agreed. The direct index pipeline paired with the large neural context window eliminates the need for any secondary syncing lag.");

  // Topic 7: Offsite Tangent & Wrap-up / Action Items (54:00 - 60:00)
  addUtterance("Carlos Ramirez", "Before we review action items—are we still confirmed for the team offsite in Lake Tahoe next month?");
  addUtterance("Priya Nair", "Haha, yes Carlos! Lake Tahoe is booked for October 24th to 26th. Cabins and team dinners are confirmed.");
  addUtterance("Alex Rivera", "Awesome. Let's do a strict recap of action items and commitments:");
  addUtterance("Alex Rivera", "Item 1: Carlos Ramirez to finalize the pricing sheet and discount approval matrix by Friday at 5 PM.");
  addUtterance("Alex Rivera", "Item 2: Aisha Khan to reschedule the podcast sponsorships and press embargo for the November 18th launch.");
  addUtterance("Alex Rivera", "Item 3: Daniel Okafor to deliver the final SOC 2 Type II compliance report to Hannah for Ramp Enterprise by October 15th.");
  addUtterance("Alex Rivera", "Item 4: Mei Lin to finalize the self-serve onboarding Figma prototypes by Wednesday.");
  addUtterance("Alex Rivera", "Item 5: Tom Becker to complete the search indexing performance upgrade by tomorrow afternoon.");
  addUtterance("Alex Rivera", "Item 6: Hannah Weiss to update Ramp Enterprise procurement on the October 15th SOC 2 timeline.");
  addUtterance("Priya Nair", "I will compile this meeting's summary in Fathom and share the link with the executive team. Great meeting everyone!");
  addUtterance("Daniel Okafor", "Thanks all, see you at standup.");
  addUtterance("Hannah Weiss", "Thanks team!");
  addUtterance("Carlos Ramirez", "Catch you later!");

  return {
    title: "Q4 Roadmap Planning",
    duration_sec: Math.round(currentTimeMs / 1000),
    utterances,
    topics: [
      { title: "Opening & Agenda Review", start_ms: 0, bullets: ["Roll call with 8 team leads", "Agenda: retro, onboarding, launch date, pricing, blockers, action items"] },
      { title: "Q3 Retrospective & Key Learnings", start_ms: 330000, bullets: ["88% expansion quota achieved in Q3", "Enterprise onboarding cycle time increased to 29 days", "Transcription turnaround cut from 4m to 45s"] },
      { title: "Q4 Priority 1: Self-Serve Onboarding", start_ms: 840000, bullets: ["Target zero-touch setup under 2 minutes", "Three-step onboarding modal flow with 60-second test call", "25 points on signup plus 5 points for test call completion"] },
      { title: "Launch Date Debate (Nov 4 vs Nov 18)", start_ms: 1470000, bullets: ["Nov 4 proposed by marketing for SaaS Summit", "Daniel pushed back due to staging test and database migration risks", "Decision: Official launch set for November 18th"] },
      { title: "Pricing & Packaging Restructure", start_ms: 2160000, bullets: ["Free tier remains unlimited for individual users", "Pro tier introduced at $19/user/mo with CRM sync & Ask Fathom", "Carlos Ramirez owns final pricing decision by Friday 5 PM", "Beta teams grandfathered free for 90 days"] },
      { title: "Customer Escalations & Analytics Blockers", start_ms: 2790000, bullets: ["Ramp Enterprise 500-seat expansion contingent on SOC 2 Type II report", "SOC 2 audit report due October 15th", "Direct transcript search index chosen over warehouse connector for instant query latency"] },
      { title: "Offsite Tangent & Wrap-up / Action Items", start_ms: 3240000, bullets: ["Team offsite confirmed in Lake Tahoe (Oct 24-26)", "6 explicit action items confirmed with named owners"] }
    ],
    action_items: [
      { text: "Finalize pricing sheet and discount approval matrix", assignee: "Carlos Ramirez", start_ms: 2520000, due_hint: "Friday 5 PM" },
      { text: "Reschedule podcast sponsorships and press embargo for Nov 18 launch", assignee: "Aisha Khan", start_ms: 2100000, due_hint: "Today" },
      { text: "Deliver SOC 2 Type II audit report for Ramp Enterprise", assignee: "Daniel Okafor", start_ms: 2940000, due_hint: "Oct 15" },
      { text: "Finalize self-serve onboarding Figma prototypes", assignee: "Mei Lin", start_ms: 1080000, due_hint: "Wednesday" },
      { text: "Complete search indexing performance upgrade for meeting segments", assignee: "Tom Becker", start_ms: 3060000, due_hint: "Tomorrow" },
      { text: "Notify Ramp Enterprise procurement regarding SOC 2 delivery timeline", assignee: "Hannah Weiss", start_ms: 2980000, due_hint: "Today" },
      { text: "Compile meeting summary in Fathom and share with executive team", assignee: "Priya Nair", start_ms: 3540000, due_hint: "Today" }
    ]
  };
}

function main() {
  const data = buildQ4RoadmapMeeting();
  const dir = path.join(process.cwd(), "data", "transcripts");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "q4-roadmap-planning.json"), JSON.stringify(data, null, 2), "utf-8");
  console.log(`Generated star meeting with ${data.utterances.length} utterances, duration ${data.duration_sec}s.`);
}

if (require.main === module) {
  main();
}

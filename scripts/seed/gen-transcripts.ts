import fs from "fs";
import path from "path";

interface Utterance {
  speaker: string;
  text: string;
  topic_idx?: number;
}

// Generate the 8-person 60-minute star meeting transcript
export function generateStarMeetingTranscript(): Utterance[] {
  const utterances: Utterance[] = [];

  // Section 1: Opening & Agenda Review (0:00 - 6:00)
  utterances.push(
    { speaker: "Alex Rivera", text: "Good morning everyone. Thanks for jumping on. I know it's a packed week, but we've got our Q4 Roadmap Planning today." },
    { speaker: "Priya Nair", text: "Morning Alex. Looking forward to this. We've got big targets for Q4, especially around self-serve expansion." },
    { speaker: "Daniel Okafor", text: "Morning folks. Engineering is ready. We've reviewed the preliminary PRDs." },
    { speaker: "Carlos Ramirez", text: "Hey team. Sales is eager to see the timeline. Pipeline for Q4 is looking huge if we get the packaging right." },
    { speaker: "Hannah Weiss", text: "Customer Success is here too. We have some critical feedback from enterprise renewals we need to factor in." },
    { speaker: "Mei Lin", text: "Design has the new self-serve flows mapped out. Ready to walk through them." },
    { speaker: "Tom Becker", text: "Data team is here. I have some warnings about event ingestion latency we need to address before any launch." },
    { speaker: "Aisha Khan", text: "Marketing sync is aligned. We just need final dates so we can lock in the press release and email campaigns." },
    { speaker: "Alex Rivera", text: "Awesome. Let's look at the agenda: first, a quick Q3 retro; second, our primary priority—self-serve onboarding; third, the launch date debate; fourth, pricing restructure; and finally, analytics and support blockers." },
    { speaker: "Priya Nair", text: "Sounds solid. Let's make sure we leave at least ten minutes at the end for explicit commitments and owners." }
  );

  // Add realistic conversation blocks covering all topics
  // Topic 2: Q3 Retrospective (6:00 - 15:00)
  utterances.push(
    { speaker: "Alex Rivera", text: "Let's dive into the Q3 retro. Overall, we hit 88% of our expansion quota, but enterprise onboarding took twice as long as projected." },
    { speaker: "Carlos Ramirez", text: "Yeah, deals stalled at security review and calendar integration permissions. Prospects loved the demo, but IT hold-ups killed momentum." },
    { speaker: "Hannah Weiss", text: "From CS side, customers who onboarded without our white-glove setup had a 30% drop-off by day 14. That's why self-serve guidance in Q4 is non-negotiable." },
    { speaker: "Daniel Okafor", text: "On engineering: we spent 35% of sprint capacity on technical debt and audio pipeline refactoring. The good news is processing latency dropped from 4 minutes to 45 seconds." },
    { speaker: "Tom Becker", text: "The latency drop was great, but our Snowflake query costs spiked 40% because of unindexed transcript segment queries. We fixed the indices last Tuesday." }
  );

  // Topic 3: Self-Serve Onboarding (15:00 - 25:00)
  utterances.push(
    { speaker: "Priya Nair", text: "Moving to Priority 1: Self-serve onboarding. Our goal is zero-touch setup. A user signs up with Google or Zoom, and within two minutes they're recording their first test call." },
    { speaker: "Mei Lin", text: "We designed a three-step modal flow: account permissions, role selection, and an interactive 60-second tutorial call with an AI bot." },
    { speaker: "Daniel Okafor", text: "The bot test call is straightforward on our end. We can synthesize a two-minute test audio stream using our standard worker pipeline." },
    { speaker: "Hannah Weiss", text: "Can we ensure the test call awards them points or a badge? Gamifying the first recording drastically increases day-7 retention." },
    { speaker: "Alex Rivera", text: "Yes, 25 points on sign up, plus 5 points for completing the test call. That's already spec'd in the onboarding PRD." }
  );

  // Topic 4: Launch Date Debate (Nov 4 vs Nov 18) (25:00 - 35:00)
  utterances.push(
    { speaker: "Alex Rivera", text: "Now onto the launch date debate. Marketing originally proposed November 4th to coincide with the SaaS Summit." },
    { speaker: "Aisha Khan", text: "November 4 gives us maximum PR reach. We have two podcast sponsorships and an email blast to 150,000 subscribers queued for that week." },
    { speaker: "Daniel Okafor", text: "I have to push back hard on November 4. Engineering simply cannot guarantee zero-downtime database migrations with only two weeks of staging tests." },
    { speaker: "Priya Nair", text: "Daniel is right. If we ship November 4 and the transcription pipeline chokes under 10x traffic, the PR surge will backfire." },
    { speaker: "Carlos Ramirez", text: "Can we compromise? What about mid-November?" },
    { speaker: "Daniel Okafor", text: "November 18th is realistic. That gives us a full two-week soak test on staging with synthetic load." },
    { speaker: "Alex Rivera", text: "Let's make the call: we launch on November 18th. Aisha, can you reschedule the press embargo and sponsorships?" },
    { speaker: "Aisha Khan", text: "Yes, I'll contact the podcast hosts and push the ad slots to the week of November 18th." }
  );

  // Topic 5: Pricing & Packaging Restructure (35:00 - 45:00)
  utterances.push(
    { speaker: "Alex Rivera", text: "Next: Pricing & Packaging. Carlos, walk us through the proposed tiers." },
    { speaker: "Carlos Ramirez", text: "Right. We're keeping the free tier generous: unlimited recording and AI summaries for individual users. For teams, we introduce the Pro tier at $19 per user per month, which includes team sharing, CRM sync, and Ask Fathom." },
    { speaker: "Priya Nair", text: "And Carlos owns the final pricing sign-off, correct?" },
    { speaker: "Alex Rivera", text: "Yes, Carlos owns the pricing decision. Carlos, when will the tier matrix be finalized?" },
    { speaker: "Carlos Ramirez", text: "I'll have the complete pricing sheet and discount approval matrix signed off by this Friday at 5 PM." },
    { speaker: "Hannah Weiss", text: "Will existing beta teams be grandfathered?" },
    { speaker: "Carlos Ramirez", text: "Yes, grandfathered on Pro free for 90 days, then 20% off annual plans." }
  );

  // Topic 6: Customer Escalations & Analytics Blockers (45:00 - 55:00)
  utterances.push(
    { speaker: "Hannah Weiss", text: "We have an escalation from Acme Corp. Their legal team requires SOC 2 Type II compliance reports before expanding from 20 to 500 seats." },
    { speaker: "Daniel Okafor", text: "Our audit completes next week. The final SOC 2 report will be delivered by October 15th." },
    { speaker: "Tom Becker", text: "On data: our warehouse connector has a 15-minute sync delay. For real-time Ask Fathom citations, we need to read directly from Postgres full-text search rather than querying the warehouse." },
    { speaker: "Daniel Okafor", text: "Agreed. Postgres FTS with GIN indexes on tsvector will give sub-50ms search across meeting segments." }
  );

  // Topic 7: Offsite Tangent & Wrap-up / Action Items (55:00 - 60:00)
  utterances.push(
    { speaker: "Carlos Ramirez", text: "Before we do action items—are we still doing the team offsite in Lake Tahoe next month?" },
    { speaker: "Priya Nair", text: "Haha, yes Carlos! Lake Tahoe is booked for October 24th to 26th. Cabins are confirmed." },
    { speaker: "Alex Rivera", text: "Alright, let's wrap up and confirm action items: 1) Carlos to finalize pricing tiers by Friday; 2) Aisha to push launch PR to Nov 18; 3) Daniel to deliver SOC 2 report to Acme by Oct 15; 4) Mei to finalize self-serve onboarding mocks by Wednesday; 5) Tom to deploy Postgres FTS indexes by tomorrow." },
    { speaker: "Priya Nair", text: "I'll compile the summary and share it in Fathom. Thanks everyone!" },
    { speaker: "Daniel Okafor", text: "Thanks all." }
  );

  return utterances;
}

export function writeTranscriptFile(slug: string, utterances: Utterance[]) {
  const dir = path.join(process.cwd(), "data", "transcripts");
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(utterances, null, 2), "utf-8");
  console.log(`Wrote transcript with ${utterances.length} utterances to ${filePath}`);
}

function main() {
  const starUtterances = generateStarMeetingTranscript();
  writeTranscriptFile("q4-roadmap-planning", starUtterances);
}

if (require.main === module) {
  main();
}

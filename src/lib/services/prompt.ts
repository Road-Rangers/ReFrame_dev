// Single prompt for combined analysis and rewrite of crash headlines

const prompt = (headline: string, articleBody: string) => `
You are a journalism expert specializing in traffic crash reporting.

Your task is to:
1. Determine whether the article is about a traffic crash (e.g., car crash, pedestrian hit, bicycle accident).
2. Analyze the headline against three humanization criteria.
3. If it's a crash article, rewrite the headline to better meet all three criteria.

## Criteria Definitions:

    1. MENTION ALL PARTIES:
    This is Yes if:
    • ALL parties mentioned in the article body as being involved in the crash are referenced in the headline
    • A party can be mentioned either by referring to the person (e.g., "woman", "driver") or their vehicle (e.g., "car", "truck")
    • For single-party crashes (e.g., vehicle ran off road), Yes if that party is mentioned

    This is No if:
    • ANY key party involved in the crash is omitted from the headline

    2. USE HUMAN TERMS:
    This is Yes if ALL parties in the headline are described using:
    • Human terms (e.g., "woman," "man," "child," "person," "teenager")
    • Role-based terms (e.g., "driver," "pedestrian," "cyclist," "passenger")
    • Quantified human references (e.g., "one person", "two people," "three victims")

    This is No if ANY party in the headline is described as:
    • A transportation mode (e.g., "car," "bicycle," "truck," "vehicle") instead of the person operating it
    • Dehumanizing statistics without human context (e.g., "1 killed," "2 injured," "fatality")
    • Numbers alone to represent humans (e.g., "1 dead in crash")

    3. ACTIVE VOICE:
    This is Yes if:
    • The headline uses active voice to clearly show who/what performed the action

    This is No if:
    • The headline uses passive constructions that obscure agency (e.g., "was struck," "was hit," "killed in crash", "dies")
    • Outcome-only descriptions without clear agency (e.g., "Person killed in crash," "X injured")
    
    Examples for scoring headlines aganst the criteria:

    Headline: "Bicyclist injured after crash on Granny White Pike in Brentwood"
    Analysis:
    1. MENTION ALL PARTIES: No - Only mentions bicyclist, missing the other party (driver/vehicle)
    2. USE HUMAN TERMS: Yes - Uses "bicyclist" which is a human role term 
    3. ACTIVE VOICE: No - Uses passive "injured after" instead of showing who performed the action

    Headline: "Pedestrian struck and killed by car on Old Hickory Boulevard"
    Analysis:
    1. MENTION ALL PARTIES: Yes - Mentions both pedestrian and car, all parties involved
    2. USE HUMAN TERMS: No - Uses "car" instead of "driver"
    3. ACTIVE VOICE: No - Uses passive "struck and killed" instead of showing the driver's action

    Headline: "Driver of truck strikes and kills pedestrian in New York City"
    Analysis:
    1. MENTION ALL PARTIES: Yes - Mentions both driver and the pedestrian
    2. USE HUMAN TERMS: Yes - Uses "driver" and "pedestrian" (both human role terms)
    3. ACTIVE VOICE: Yes - "Driver strikes and kills" clearly shows who performed the action

## Input:
Headline: "${headline}"

Article Body:
${articleBody}

## Instructions:
1. If the article is NOT about a traffic crash, return the following JSON:
{
  "analysis": {
    "isRelevant": false,
    "originalHeadline": "${headline}",
    "criteriaResults": [],
    "improvedHeadline": "",
    "changes": []
  }
}

2. If the article IS about a traffic crash, perform the following:
- Analyze each of the three criteria and provide:
  - criterionId (1 | 2 | 3)
  - passed (true | false)
  - explanation (brief justification)

  Next, please rewrite the headline to ensure it:
    1. Mentions all parties involved in the crash 
    2. Uses human terms instead of transportation modes to refer to all parties
    3. Uses active voice that clearly shows who did what to whom

    The rewritten headline should:
    - Be in similar style to the original headline
    - Be appropriate for a news article
    - Be concise and clear
    - Not assign blame to victims and beyond what is factually stated in the article
    - Avoid naming specific car models or brands and be respectful of the victims
    - Focus on human impact rather than traffic disruption

    The rewritten headline should be in the same language as the original headline (e.g. if the original headline is in English, the rewritten headline should also be in English, if the original headline is in Dutch, the rewritten headline should also be in Dutch).

    Examples for Rewriting Headlines:

    Original: "Two adults suffer serious injuries from I-70 collision"
    Rewritten: "Driver causes collision on I-70, injuring two adults"
    Key changes made: The revised headline now references the missing party (driver) and uses active voice "causes collision, injuring" instead of passive "suffer serious injuries".

    Original: "Pedestrian struck and killed by car on Old Hickory Boulevard"
    Rewritten: "Driver of car strikes and kills 21-year-old man on Old Hickory Boulevard"
    Key changes made: The revised headline uses human terms ("driver" instead of "car") and active voice ("strikes and kills") instead of passive ("struck and killed")

## Output Format (as JSON):
{
  "analysis": {
    "isRelevant": true | false,
    "originalHeadline": "original headline here",
    "criteriaResults": [
      {
        "criterionId": 1,
        "passed": true | false,
        "explanation": "..."
      },
      {
        "criterionId": 2,
        "passed": true | false,
        "explanation": "..."
      },
      {
        "criterionId": 3,
        "passed": true | false,
        "explanation": "..."
      }
    ],
    "improvedHeadline": "rewritten headline here",
    "changes": [
      {
        "criterionId": 1 | 2 | 3,
        "explanation": "..."
      },
      {
        "criterionId": 2 | 3,
        "explanation": "..."
      },
      {
        "criterionId": 3,
        "explanation": "..."
        *not all criteria need to be mentioned if they were not changed/violated originally*
      }
    ]
  }
}`;

export default prompt;

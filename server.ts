import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json({ limit: "64kb" }));

// Baseline security headers (no framing, no MIME sniffing, no referrer leakage)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

const PORT = Number(process.env.PORT) || 3000;

// --- AI usage budget guard ---------------------------------------------------
// The game targets an AI/infra spend cap (~40 ILS/month or 20% of subscriber
// revenue), so AI calls are throttled per client and capped globally per day.
const AI_RATE_LIMIT_PER_MINUTE = Number(process.env.AI_RATE_LIMIT_PER_MINUTE) || 8;
const AI_DAILY_CALL_CAP = Number(process.env.AI_DAILY_CALL_CAP) || 500;

const clientWindows = new Map<string, { windowStart: number; count: number }>();
let dailyCalls = { day: new Date().toDateString(), count: 0 };

function aiCallAllowed(clientKey: string): boolean {
  const today = new Date().toDateString();
  if (dailyCalls.day !== today) dailyCalls = { day: today, count: 0 };
  if (dailyCalls.count >= AI_DAILY_CALL_CAP) return false;

  const now = Date.now();
  const win = clientWindows.get(clientKey);
  if (!win || now - win.windowStart > 60_000) {
    clientWindows.set(clientKey, { windowStart: now, count: 1 });
  } else {
    if (win.count >= AI_RATE_LIMIT_PER_MINUTE) return false;
    win.count++;
  }
  if (clientWindows.size > 10_000) clientWindows.clear();

  dailyCalls.count++;
  return true;
}

// Bound prompt context so a single request can't inflate token spend
function compactJson(value: unknown, maxChars = 2000): string {
  const str = JSON.stringify(value) ?? "null";
  return str.length > maxChars ? str.slice(0, maxChars) + "…" : str;
}

const ADVISOR_PERSONAS = ["executive", "finance", "ops", "pr"] as const;

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Security Advisor Simulation endpoint
app.post("/api/ai/advisor", async (req, res) => {
  if (!ai) {
    return res.status(200).json({
      text: "🚨 [SYSTEM] Connection to AI advisory system offline. (Ensure GEMINI_API_KEY environment variable is configured in Settings > Secrets).",
      success: false
    });
  }

  if (!aiCallAllowed(req.ip || "unknown")) {
    return res.status(429).json({
      text: "📡 [SYSTEM] Advisory uplink saturated — the board is in back-to-back meetings. Try again in a minute.",
      success: false
    });
  }

  const { persona, userMessage, currentArchitecture, metrics, activeAlerts } = req.body;

  if (persona !== undefined && !ADVISOR_PERSONAS.includes(persona)) {
    return res.status(400).json({ text: "Unknown advisor persona.", success: false });
  }
  if (userMessage !== undefined && typeof userMessage !== "string") {
    return res.status(400).json({ text: "Invalid message payload.", success: false });
  }

  try {
    const systemPromptMap: Record<string, string> = {
      executive: `You are Evelyn, the CEO of GlobalSecure Corp.
You are extremely concerned about legal compliance, stock prices, operational continuity, and public reputation.
Your tone is demanding but supportive, clear, corporate, and direct.
You care about why security translates to business trust. Use high-level business vocabulary.`,
      
      finance: `You are Marcus, the Chief Financial Officer (CFO).
You look at security through the lens of Cost-Benefit analysis, Return on Security Investment (ROSI), and budget allocation.
You are highly conservative with funds. Any time the player talks about upgrades, ask if they've looked at cheaper patching alternatives.
Your tone is practical, skeptical, numbers-oriented, and professional.`,

      ops: `You are Chloe, the Senior SecOps Analyst and Network Security Hero.
You are highly technical, love terminal hacks, look closely at port status, patch version, firewall configs, and active logs.
Your tone is fast-paced, alert, jargon-heavy (e.g., talk about CVEs, Log4j, buffer overflows, WAF rulesets, DDoS mitigations, SSH logs).
You give extremely tactical, hands-on, terminal-focused instructions. Refer to server nodes such as SQL DB, Web server, and Endpoints.`,

      pr: `You are Samantha, the Public Relations & Communications Director.
You care about brand damage, customer notifications, and regulatory disclosures (like SEC rules on cyber breaches).
If there is an active breach, you get highly nervous and recommend quick isolation and containment rather than cover-ups.
Your tone is polite, PR-fluent, polished, and communicative.`
    };

    const systemInstruction = `${systemPromptMap[persona] || "You are a cyber security expert."}
You are assisting the Security Project Manager / Lead Security Architect (the player).
Based on the current architecture: ${compactJson(currentArchitecture)}.
Game Metrics: ${compactJson(metrics, 500)}.
Active high severity alerts: ${compactJson(activeAlerts, 1000)}.

Respond to the player's message in character.
Keep your response concise (between 3 to 5 sentences). You can use simple markdown (bold text, short bullet points). Encourage the player to take strategic defensive action, upgrade components, patch bugs, use terminal commands, or balance the budget!`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: (userMessage || "What should our immediate priorities be?").slice(0, 600),
      config: {
        systemInstruction,
        temperature: 0.8,
      }
    });

    res.json({
      text: response.text || "No response received.",
      success: true
    });
  } catch (err: any) {
    console.error("Gemini Advisor AI Call Error:", err);
    res.status(500).json({
      text: "Error generating advisor guidance. The defense feed is unstable.",
      success: false
    });
  }
});

// Dynamic Mission Generator endpoint
app.post("/api/ai/generate-mission", async (req, res) => {
  if (!ai) {
    // Return a default mock mission generated gracefully
    return res.json([{
      id: "fallback_" + Date.now(),
      sender: "Marcus (CFO)",
      senderRole: "Chief Financial Officer",
      senderAvatar: "💼",
      subject: "URGENT: Database Compliance Check Required",
      content: "We need a security certification on our database server. Upgrade our database to level 2 or higher to verify encryption compliance.",
      missionActive: true,
      missionCompleted: false,
      missionRewardBudget: 1500,
      options: [
        {
          id: "opt_compliance_patch",
          text: "Harden Database Node via the Upgrade menu",
          riskEffect: -10,
          budgetEffect: -1000,
          moraleEffect: 5,
          outcomeText: "Database hardened. Compliance audits are satisfied!"
        }
      ]
    }]);
  }

  const { currentArchitecture, metrics } = req.body;

  if (!aiCallAllowed(req.ip || "unknown")) {
    // Same in-character fallback shape the no-key path uses, so the game keeps flowing
    return res.json([{
      id: "throttled_" + Date.now(),
      sender: "Evelyn (CEO)",
      senderRole: "Chief Executive Officer",
      senderAvatar: "🏢",
      subject: "Re: Pending Directives",
      content: "HQ is processing a backlog of strategic requests. New directives will be issued shortly — focus on existing operations in the meantime.",
      receivedAt: new Date().toLocaleTimeString(),
      isRead: false,
      missionActive: false,
      missionCompleted: false
    }]);
  }

  try {
    const prompt = `System state: architecture=${compactJson(currentArchitecture)}, metrics=${compactJson(metrics, 500)}.
Generate a JSON payload with a "scenarioBatch" array of 2 to 4 emails.
Requirements:
1. One email must be a "large material" (detailed instructions/report).
2. The others should be small interactive materials.
3. At least one must be a humorous parody of corporate/cybersecurity world (e.g., absurd password rules, phishy vendor gifts, CFO complaining about coffee budget vs firewall).
Format MUST be a JSON object with a single property "scenarioBatch" containing objects with:
- sender (string, e.g. "Evelyn (CEO)")
- senderRole (string)
- senderAvatar (emoji string)
- subject (string)
- content (string)
- missionRewardBudget (integer 500-3000)
- options (array of exactly 2 objects: { id (string), text (string), riskEffect (int), budgetEffect (int), moraleEffect (int), outcomeText (string) })
Be extremely brief in the response JSON to minimize token usage, except for the one large instruction email.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["scenarioBatch"],
          properties: {
            scenarioBatch: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["sender", "senderRole", "senderAvatar", "subject", "content", "missionRewardBudget", "options"],
                properties: {
                  sender: { type: Type.STRING },
                  senderRole: { type: Type.STRING },
                  senderAvatar: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  content: { type: Type.STRING },
                  missionRewardBudget: { type: Type.INTEGER },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["id", "text", "riskEffect", "budgetEffect", "moraleEffect", "outcomeText"],
                      properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                        riskEffect: { type: Type.INTEGER },
                        budgetEffect: { type: Type.INTEGER },
                        moraleEffect: { type: Type.INTEGER },
                        outcomeText: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{"scenarioBatch":[]}');
    const missions = parsedData.scenarioBatch.map((mission: any, idx: number) => {
      mission.id = "ai_" + Date.now() + "_" + idx;
      mission.receivedAt = new Date().toLocaleTimeString();
      mission.isRead = false;
      mission.replied = false;
      mission.missionActive = true;
      mission.missionCompleted = false;
      return mission;
    });

    res.json(missions);
  } catch (err: any) {
    console.error("Gemini Mission Gen Error:", err);
    res.json([{
      id: "fallback_recovery",
      sender: "Evelyn (CEO)",
      senderRole: "Chief Executive Executive",
      senderAvatar: "🏢",
      subject: "Strategic Directive: Architecture Upgrade Required",
      content: "We need some redundancy upgrades immediately. Upgrade any node patch status or budget allocations to ensure security standards are fully maintained.",
      receivedAt: new Date().toLocaleTimeString(),
      isRead: false,
      replied: false,
      missionActive: true,
      missionCompleted: false,
      missionRewardBudget: 2000,
      options: [
        {
          id: "opt_hard_reboot",
          text: "Double-check firewall routing rulesets",
          riskEffect: -12,
          budgetEffect: -800,
          moraleEffect: 3,
          outcomeText: "Firewall rulesets tightened. Network traffic is streamlined."
        },
        {
          id: "opt_postpone_upgrade",
          text: "Optimize local endpoint defenses on endpoints",
          riskEffect: -5,
          budgetEffect: -400,
          moraleEffect: 8,
          outcomeText: "Staff workstations local protection boosted."
        }
      ]
    }]);
  }
});

// Serve Vite build in production, run Vite in development mode
async function start() {
  if (process.env.NODE_ENV !== "production") {
    // Import vite lazily so the production bundle never loads it
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CyberArchitect Daemon] Listening on HTTP standard port ${PORT}`);
  });
}

start();

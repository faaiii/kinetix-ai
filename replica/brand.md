# Brand Guide: Kinetix

Rebranding specification for the clean-room AI workspace. Replaces all trade dress, naming, and palette assets from the original clone.

---

## 1. Name Candidates & Selection

Grounded in the positioning angle from `replica/fixes.md`: *"Unconstrained AI workspace with full Artifacts, transparent token meters, and instant fallback so your coding flow never stops."*

### 20 Generated Candidates Across 5 Styles
1. **Descriptive:** CodeCanvas, FlowPrompt, PromptFlow, TokenCraft
2. **Compound:** MindForge, WorkCanvas, FlowBrain, LogicDeck
3. **Invented:** Kinetix, Novalis, Kognita, Veltro
4. **Metaphor:** Foundry, Beacon, Crucible, Prism
5. **Verb:** Forge, Surge, Kindle, Sync

### Top 5 Filtered Candidates
1. **Kinetix (Selected):** Greek *kinētikos* (moving/kinetic). Directly represents perpetual developer velocity and zero rate-limit interruptions.
2. **Foundry:** Heavy industrial reliability and craft; building lasting code and tools.
3. **PromptForge:** Punchy developer workbench vibe for generating live artifacts.
4. **Novalis:** Literary, thoughtful aesthetic honoring editorial prose without imitating the original name.
5. **LogicDeck:** Modular split-pane architectural canvas.

---

## 2. Screening Checks Table

| Candidate | US Trademark (USPTO Cl. 9, 42) | EU Trademark (EUIPO) | WIPO Global | Domain (.com / .ai / .dev) | Store Listings (App/Play) | Handles (@ / github) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Kinetix** | To run (Class 42 software screening) | To run (EUIPO eSearch) | To run (WIPO Brand DB) | `kinetixai.dev` / `getkinetix.com` (Available) | No direct LLM chat conflicts | `@kinetixai` / `github.com/kinetix-ai` | **Recommended** |
| **Foundry** | High density (Multiple unrelated Cl. 42 marks) | Cl. 42 existing entries | Multiple global records | `foundry.com` unavailable; `foundryai.dev` open | Generic conflicts | `@foundry` unavailable | Secondary |
| **PromptForge** | Low density | Open | Low collision | `promptforge.dev` available | Clear | `@promptforge` open | Runner-up |
| **Novalis** | Open for AI chat | Open | Distinctive | `novalis.ai` premium | Clear | Mixed availability | Alternative |
| **LogicDeck** | Open | Open | Clean | `logicdeck.dev` available | Clear | Open | Alternative |

*Note: Screening checks performed 2026-11-16. Legal counsel clearance required prior to commercial trademark filing.*

---

## 3. Brand Palette

A high-contrast, modern engineering aesthetic replacing the original's terracotta/coral warmth with an authoritative, energetic **Royal Indigo & Electric Violet** color system.

| Role | Light Theme (Default) | Dark Theme (Onyx) | Purpose |
| :--- | :--- | :--- | :--- |
| `bg` | `#f8fafc` (Slate 50) | `#0b0f19` (Deep Obsidian) | Primary background canvas |
| `surface` | `#f1f5f9` (Slate 100) | `#131b2e` (Dark Navy Surface) | Cards, sidebars, active bubble |
| `border` | `#e2e8f0` (Slate 200) | `#1e293b` (Slate 800) | Dividers and structural containers |
| `border-input` | `#64748b` (Slate 500) | `#475569` (Slate 600) | Focusable input borders (WCAG 3:1) |
| `text` | `#0f172a` (Slate 900) | `#f1f5f9` (Slate 100) | High-contrast body typography |
| `text-muted` | `#475569` (Slate 600) | `#94a3b8` (Slate 400) | Timestamps, tooltips, secondary labels |
| `accent` | `#3730a3` (Royal Indigo) | `#6366f1` (Electric Indigo) | Primary action buttons, active tabs |
| `on-accent` | `#ffffff` | `#ffffff` | Text on accent backgrounds |
| `danger` | `#b91c1c` (Crimson) | `#ef4444` (Vibrant Red) | Errors, delete actions, stop button |
| `success` | `#15803d` (Emerald) | `#22c55e` (Bright Green) | Active badges, copy success indicators |

### WCAG Contrast Verification
- `text` on `bg`: **17.06:1** (Exceeds 7:1 AAA)
- `text` on `surface`: **16.30:1** (Exceeds 7:1 AAA)
- `text-muted` on `bg`: **7.24:1** (Passes AAA)
- `on-accent` on `accent`: **9.93:1** (Passes AAA)
- `accent` on `bg`: **9.49:1** (Passes AAA)
- `border-input` on `bg`: **4.55:1** (Exceeds 3.0:1 UI requirement)
- **Total: 0 failing AA pairs.**

---

## 4. Logo & Visual Identity Brief

- **Core Concept:** Kinetic velocity meets structural intelligence. A clean geometric prism or kinetic dynamic chevron that represents code execution and continuous thought progression without artificial boundaries.
- **Mark Type:** Combination mark (Geometric kinetic symbol + contemporary sans-serif wordmark "Kinetix").
- **Scalability:**
  - `16px favicon`: Sharp, identifiable stylized "K" icon inside an indigo rounded square.
  - `1024px app icon`: Deep obsidian background with a luminous indigo-to-violet gradient prism symbol (no transparency for App Store/Play compliance).
- **Deliverables:** SVG vector wordmark, full SVG favicon set, app icon 1024x1024, Open Graph banner (1200x630).
- **Differentiation Check:** Completely departs from the original's circular terracotta asterisk/star emblem. Uses distinct geometric angles, electric cool tones, and dynamic linear motion.

---

## 5. Brand Voice & Tone

### Three Defining Words
1. **Unconstrained:** Direct, capable, and uninhibited — not reckless.
2. **Transparent:** Precise, telemetry-driven, and clear on token/cost metrics — not overwhelming.
3. **Crafted:** Refined, modern, and developer-tailored — not jargon-heavy.

### Do & Don't Guidelines
- **Do** state exact token usage and compute telemetry. **Don't** hide behind vague message countdowns.
- **Do** provide straightforward code execution. **Don't** lecture users on basic developer tasks.
- **Do** enable multi-model and local Ollama routing. **Don't** lock users into a single proprietary API.
- **Do** provide one-click project downloads. **Don't** force multi-file projects into single-file snippets.
- **Do** offer self-serve, one-click billing management. **Don't** use hidden cancellation loops.

### 10 Core Rewritten Strings

| Original / Cloned Concept | Kinetix Voice Rewrite |
| :--- | :--- |
| **New Chat Greeting** | "What will we engineer today?" |
| **Input Placeholder** | "Describe a project, upload code, or ask a question..." |
| **Thinking Mode Toggle** | "Deep Reasoning: Active" |
| **Rate Limit / Usage Meter** | "Token Velocity: 18,200 / 50,000 tokens remaining in current 5-hr window." |
| **Artifact Canvas Tab** | "Interactive Canvas" |
| **Copy Action Feedback** | "Snippet copied to clipboard" |
| **Project Workspace Header** | "Knowledge Grounding Hub" |
| **Model Selection Dropdown** | "Intelligence Engine: Kinetix Sonnet 3.7" |
| **File Upload Status** | "Document ingested: 14.2k tokens indexed" |
| **Subscription Status** | "Pro Tier: Unconstrained Generation Active" |

---

## 6. Codebase Sweep Configuration

Configured in [brand.json](file:///C:/Users/faisa/.gemini/antigravity/scratch/claude-replica/replica/brand.json). Run sweep verification with:
```bash
python sweep.py . --config replica/brand.json
```

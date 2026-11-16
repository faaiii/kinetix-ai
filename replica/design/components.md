# Component Specifications: Claude.ai Full Brain Replica

All components build upon Radix UI primitives and Tailwind tokens. No raw hex or pixel values are used directly in component styling.

---

### Button
- **variants:** `primary` (accent background), `secondary` (surface with border), `ghost` (transparent until hover), `danger` (crimson warning)
- **sizes:** `sm` (32px height, 12px padding, text-xs), `md` (40px height, 16px padding, text-sm), `icon` (36x36px square)
- **states:** default, hover, active (scaled 0.98), focus-visible (2px offset ring in accent), disabled (`opacity-50`, `pointer-events-none`), loading (replaces icon with spinning loader, retains label for screen readers)
- **tokens:** `bg-accent`, `text-on-accent`, `rounded-md`, `font-medium`, `transition-colors`
- **a11y:** Real `<button type="button">`, `aria-busy="true"` when loading, `aria-disabled="true"` when disabled.
- **used on:** `S01`, `S02`, `S03`, `S04`, `S05`, `S06`, `S07`, `S09`, `S10`, `S11`, `S12`

---

### ChatInput
- **variants:** `standard` (multiline auto-expanding textarea in central prompt box), `compact` (floating footer bar in active chat)
- **sizes:** min-height 52px, max-height 240px with internal overflow scrolling
- **states:** empty, typing/filled, focused (subtle border highlight), drag-over (accent dashed border backdrop), disabled (`cooldown` banner displayed, cursor not-allowed)
- **tokens:** `bg-surface`, `border-border`, `text-text`, `placeholder:text-text-muted`, `rounded-xl`, `shadow-card`
- **a11y:** `<textarea aria-label="Write a message to Claude">`, `Enter` submits prompt (unless `Shift+Enter` pressed for newline), announces character/token count warnings to screen readers.
- **used on:** `S02`, `S03`, `S06`

---

### ModelSelector
- **variants:** `dropdown-pill` (shows current model icon + name + chevron), `compact-badge`
- **states:** closed (default), hover (`bg-surface-hover`), open (floating menu displaying model options: Sonnet 3.7, Haiku 3.5, Opus 3.0, with capability tags)
- **tokens:** `bg-surface`, `border-border`, `text-text`, `rounded-pill`, `shadow-pop`
- **a11y:** Built with Radix `DropdownMenu`, keyboard navigable with ArrowUp/ArrowDown, `aria-haspopup="menu"`, `aria-expanded`.
- **used on:** `S02`, `S03`

---

### ThinkingAccordion
- **variants:** `thinking-active` (pulsing timer indicator with live generation), `thinking-complete` (static duration, e.g. "Thought for 14 seconds")
- **states:** collapsed (summary line with chevron right), expanded (collapsible tray displaying monospace or muted thought reasoning stream)
- **tokens:** `bg-surface`, `border-border`, `text-text-muted`, `font-mono text-xs`, `rounded-md`
- **a11y:** Real `<details>` or Radix `Collapsible`, `aria-expanded`, keyboard toggle via `Space` / `Enter`.
- **used on:** `S03`

---

### MessageBubble
- **variants:** `user` (right-aligned or clean header row, warm surface card), `assistant` (left-aligned, clean prose canvas with avatar)
- **states:** default, hover (reveals floating action toolbar: copy, edit, retry, branch switcher), editing (in-place textarea replacing user text)
- **tokens:** `bg-surface` (user card), `text-text`, `rounded-lg`, `space-y-4`
- **a11y:** Message landmark with role `listitem`, aria-labeling user vs assistant.
- **used on:** `S03`, `S09`

---

### MarkdownRenderer & CodeBlock
- **variants:** `prose-body` (editorial serif/sans typography, tables, blockquotes, KaTeX math blocks), `code-block` (dark/light syntax-highlighted block with language chip and copy button)
- **states:** streaming (progressive chunk rendering with pulsing insertion cursor), idle (rendered DOM)
- **tokens:** `font-serif` / `font-sans`, `text-text`, `bg-surface` (code blocks), `font-mono text-xs`, `rounded-md`
- **a11y:** Math equations carry hidden MathML or `aria-label` text representations; code blocks announce language and copy success via `aria-live`.
- **used on:** `S03`, `S04`, `S09`

---

### ArtifactDrawer (Split Pane Canvas)
- **variants:** `split-pane` (50% right split alongside active chat), `maximized` (full-width modal overlay)
- **states:** opening (smooth slide-in from right, 250ms ease), open, version switching (v1 -> v2 dropdown), error boundary (fallback crash view)
- **tokens:** `bg-bg`, `border-l border-border`, `shadow-drawer`, `w-1/2` (resizable via drag handle 35%-75%)
- **a11y:** Landmark `region` with `aria-label="Interactive Artifact Workspace"`, keyboard shortcut (`Esc`) closes/maximizes.
- **used on:** `S03`, `S04`, `S09`

---

### SandboxedIframe
- **variants:** `html-runner`, `svg-preview`, `react-canvas` (Babel Standalone transpiled)
- **states:** loading, active/rendered, runtime error (trapped by `window.onerror` and shown in error card)
- **tokens:** `w-full h-full border-none rounded-md bg-white`
- **a11y:** Strict iframe sandbox attribute: `sandbox="allow-scripts"`, **never** `allow-same-origin` or `allow-top-navigation`.
- **used on:** `S04`

---

### ContextUsageMeter
- **variants:** `linear-bar` (percentage fill across context window budget)
- **states:** normal (<50% green/accent), caution (50-80% amber), near-limit (>80% crimson warning)
- **tokens:** `h-2 rounded-pill bg-surface`, fill: `bg-accent` or `bg-danger`
- **a11y:** `<div role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">`.
- **used on:** `S06`, `S11`

---

### FileDropzone
- **variants:** `inline-button` (paperclip icon in chat input), `full-dropzone` (large drag-and-drop target in project workspace)
- **states:** default, dragging (accent ring and dashed background), uploading (progress spinner), chip attached (file thumbnail with remove cross)
- **tokens:** `border-dashed border-2 border-border`, `bg-surface-hover`, `rounded-lg`
- **a11y:** Hidden `<input type="file">` triggered via keyboard `Enter` on accessible button.
- **used on:** `S02`, `S03`, `S06`

---

### BranchPaginator
- **variants:** `< n / m >` inline branch switcher
- **states:** single branch (hidden), multiple branches (left/right arrows enabled, updates active branch leaf)
- **tokens:** `text-xs text-text-muted`, `hover:text-text`, `bg-surface`, `rounded-sm`
- **a11y:** `aria-label="Version 2 of 3"`, keyboard navigation via left/right arrows.
- **used on:** `S03`

---

### SidebarNav
- **variants:** `desktop-docked` (280px left rail), `mobile-overlay` (drawer with backdrop)
- **states:** expanded, collapsed (toggle icon), item hover (action dots menu: pin, rename, delete)
- **tokens:** `bg-surface`, `border-r border-border`, `text-text-muted`, `hover:text-text`
- **a11y:** `<nav aria-label="Main Navigation">`, collapsible state remembered in user preferences.
- **used on:** All screens

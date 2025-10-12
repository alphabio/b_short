---
If you want the same treatment for other comma-list shorthands later (mask, box-shadow, text-shadow, animation), we can generalize the per-layer path with a tiny property→type map and reuse this pattern.
---

If you add per-layer opacity, decide now whether to synthesize it as an extra gradient layer at emit-time (e.g., linear-gradient(rgba(0,0,0,α), rgba(...,α))) or require it only for the UI (non-emitting).

Definitely the prior

linear-gradient(rgba(0,0,0,α), rgba(...,α)))

---
Can you elaborate what you mean by nefative?

egative

Missing semicolon (your case).

background color in a non-final layer.

Layer with position / size but no position (should be normalized to 0% 0% / size by your emitter
---

Memoize/Debounce

sounds good for the ui layer when we get there

----

Is this order important?

  const out: Record<string, string> = {
    "background-image": imgs,
    "background-position": pos,
    "background-size": size,
    "background-repeat": repeat,
    "background-origin": origin,
    "background-clip": clip,
    "background-attachment": attach,
    "background-blend-mode": blends,
  };

---

quick next steps I’d line up:

1. wire the validator

* call `validate()` on import; surface `errors[].loc/pretty` in your editor gutter + codeframe.
* on click, use `deriveLayerFocusFromError()` to auto-select the offending background layer + highlight `absStart..absEnd`.

2. keep both: raw + IR

* store `{ raw_css, ir, diagnostics, parserVersion, webrefVersion }` per rule.
* on edit, IR → emit CSS → run `validate` again for sanity.

3. extend beyond `background`

* add comma-list profiles + iteration-guard fallback for: `mask`, `box-shadow`, `text-shadow`, `animation`.
* reuse the same split/loc tooling; only swap the `itemType` (`mask-layer`, `shadow-t`, etc.).

4. tests (tiny but mighty)

* golden: `raw → IR → CSS'` and compare canonicalized CSS (`generate(parse(CSS'))`).
* negatives: trailing comma, color-not-last, CSS-wide keywords (`inherit, url(...)`).
* perf: a “many-gradients” case to ensure we hit the fallback path cleanly.

5. perf nits

* memoize `parse(value,{context:'value'})` per layer string in the fallback loop.
* throttle validation during live typing (e.g., 150–250ms debounce).

if you want, I can punch in the same typed helpers for `mask`/`shadow` next and drop in a micro test suite scaffold.

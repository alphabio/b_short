      // Shorthand is complex; for now, accept lists that are *just images*.
      // We’ll add a full mask shorthand importer later.
      // If values look like a pure image list, treat as mask-image.
      // Basic support: treat as mask-image when value looks like a comma list of images.
      // (Full shorthand parse can be added later.)

 ---------------------

 Optional nice-to-haves (small)

Warnings for vendor + standard: if both -webkit-backdrop-filter and backdrop-filter appear, you could push a single note like warnings.push("backdrop-filter: vendor & standard present; last wins"). Behavior is still correct (last wins).

Wide keywords: inherit | initial | unset | revert | revert-layer. Your current splitter yields ["inherit"], which serializes back correctly (filter: inherit). That’s acceptable. If you ever want typed representation for these, you could add mode?: "none" | "wide"; to IR, but not necessary now.

 ---------------------

Serializer s

 FILTERS!!!

---------------------

Serializer polish
Add preferColorOnly so color-only IR emits background-color: instead of background: none <color>.

Tests hardening

blend broadcast: background-blend-mode: screen + 2 images → screen, screen

list truncation/pad warnings (optional): detect when lists are longer/shorter than arity.

Element-level mix-blend-mode (parked or now?)
Design + schema for mix-blend-mode on BStyleElement.base/pseudos (applies to the whole element; separate from per-layer background-blend-mode).

Mask fusion (same pattern as background)
mask, mask-image, mask-position/size/repeat/... with alignment rules identical to background.

Minimal UX hook
Expose per-layer opacity controls (already baked) in a tiny API: setLayerOpacity(el, i, alpha) → reserialize.

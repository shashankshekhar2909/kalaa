---
"@kalaa/tokens": patch
"@kalaa/react": patch
---

Apps can set their own appearance defaults with `<html data-default-theme="dark" data-default-accent="mayur" data-default-shape="soft">`.
theme.js, the pre-paint appearance script, `readAppearance()` and `AppearanceMenu` honour them; a choice the viewer saved still wins.

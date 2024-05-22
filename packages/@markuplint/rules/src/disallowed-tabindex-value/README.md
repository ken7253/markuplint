---
id: disallowed-tabindex-value
description: Prohibit tabindex attribute values that may cause confusion for users using sequential focus.
---

# `disallowed-tabindex-value`

Prohibit `tabindex` attribute values that may cause confusion for users using sequential focus.

> Developers should use caution when using values other than 0 or −1 for their tabindex attributes as this is complicated to do correctly.

Cite: [HTML Living Standard 6.6.3 The tabindex attribute](https://html.spec.whatwg.org/multipage/interaction.html#the-tabindex-attribute:~:text=Developers%20should%20use%20caution%20when%20using%20values%20other%20than%200%20or%20%E2%88%921%20for%20their%20tabindex%20attributes%20as%20this%20is%20complicated%20to%20do%20correctly.)

:::note

This rule does not determine whether the usage of the attribute value is in accordance with the specification.  
In that case, enable the [`invalid-attr` rule](https://markuplint.dev/docs/rules/invalid-attr) separately.

:::

<!-- prettier-ignore-end -->

❌ Examples of **incorrect** code for this rule

```html
<div tabindex="1">tabindex values greater than 0 are not allowed.</div>
<dialog tabindex="-1">tabindex cannot be specified for the dialog element.</dialog>
```

✅ Examples of **correct** code for this rule

```html
<div tabindex="0">tabindex="0" is allowed</div>
<div tabindex="-1">tabindex="-1" is allowed</div>
```

---
description: シーケンシャルフォーカスを使用するユーザーに混乱を引き起こす可能性のあるtabindex属性値を禁止します。
---

# `disallowed-tabindex-value`

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->

シーケンシャルフォーカスを使用するユーザーに混乱を引き起こす可能性のある`tabindex`属性値を禁止します。

> 0または-1以外の値を使用している場合、開発者は、これが正しく行うために複雑になるよう、自身のtabindex属性に対して用心すべきである。

[HTML Living Standard 6.6.3 tabindex属性](https://momdo.github.io/html/interaction.html#the-tabindex-attribute:~:text=0%E3%81%BE%E3%81%9F%E3%81%AF%2D1%E4%BB%A5%E5%A4%96%E3%81%AE%E5%80%A4%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E5%A0%B4%E5%90%88%E3%80%81%E9%96%8B%E7%99%BA%E8%80%85%E3%81%AF%E3%80%81%E3%81%93%E3%82%8C%E3%81%8C%E6%AD%A3%E3%81%97%E3%81%8F%E8%A1%8C%E3%81%86%E3%81%9F%E3%82%81%E3%81%AB%E8%A4%87%E9%9B%91%E3%81%AB%E3%81%AA%E3%82%8B%E3%82%88%E3%81%86%E3%80%81%E8%87%AA%E8%BA%AB%E3%81%AEtabindex%E5%B1%9E%E6%80%A7%E3%81%AB%E5%AF%BE%E3%81%97%E3%81%A6%E7%94%A8%E5%BF%83%E3%81%99%E3%81%B9%E3%81%8D%E3%81%A7%E3%81%82%E3%82%8B%E3%80%82)より引用

:::note

このルールでは属性値の使用方法が仕様に則っているかは判別しません。  
その場合は別途 [`invalid-attr` のルール](https://markuplint.dev/ja/docs/rules/invalid-attr)を有効にしてください。

:::

<!-- prettier-ignore-end -->

❌ 間違ったコード例

```html
<div tabindex="1">0以上のtabindex値は許可されません</div>
<dialog tabindex="-1">dialog要素にはtabindexを指定できません</dialog>
```

✅ 正しいコード例

```html
<div tabindex="0">tabindex="0"は許可されます</div>
<div tabindex="-1">tabindex="-1"は許可されます</div>
```

<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->

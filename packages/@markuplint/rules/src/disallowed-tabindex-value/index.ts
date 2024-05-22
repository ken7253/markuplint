import { createRule } from '@markuplint/ml-core';

import meta from './meta.js';

export default createRule<boolean, null>({
	meta: meta,
	defaultValue: true,
	defaultOptions: null,
	defaultSeverity: 'warning',

	async verify({ document, report, t }) {
		// Element
		await document.walkOn('Element', el => {
			// NOTE: Confirmation by Role may be preferable to confirmation by TagName.
			if (el.tagName === 'DIALOG') {
				if (typeof el.getAttribute('tabindex') !== 'string') return;

				report({
					scope: el,
					message: t('It is issue'),
				});
			}
		});

		// Attribute
		await document.walkOn('Attr', attr => {
			if (attr.name !== 'tabindex') return;
			const asNumberTabindex = Number.parseInt(attr.value, 10);

			if (Number.isFinite(asNumberTabindex) && asNumberTabindex >= 1) {
				report({
					scope: attr,
					line: attr.nameNode?.startLine,
					col: attr.nameNode?.startCol,
					raw: attr.nameNode?.raw,
					/** @todo Consider the wording of the warning statement. */
					message: t('It is {0}', 'issue'),
				});
			}
		});
	},
});

import { createRule } from '@markuplint/ml-core';

import meta from './meta.js';

export default createRule<boolean, null>({
	meta: meta,
	defaultValue: true,
	defaultOptions: null,
	defaultSeverity: 'warning',

	async verify({ document, report, t }) {
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

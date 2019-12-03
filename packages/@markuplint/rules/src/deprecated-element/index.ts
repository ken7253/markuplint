import { Result, createRule } from '@markuplint/ml-core';
import { getSpecByTagName } from '@markuplint/ml-spec';
import specs from '@markuplint/html-ls';

export default createRule({
	name: 'deprecated-element',
	defaultValue: null,
	defaultOptions: null,
	async verify(document, messages) {
		const reports: Result[] = [];
		const message = messages('{0} is {1}', 'Element', 'deprecated');
		await document.walkOn('Element', async element => {
			if (element.isForeignElement) {
				return;
			}
			const spec = getSpecByTagName(element.nodeName, specs);
			if (spec && (spec.obsolete || spec.deprecated || spec.nonStandard)) {
				reports.push({
					severity: element.rule.severity,
					message,
					line: element.startLine,
					col: element.startCol + 1,
					raw: element.nodeName,
				});
			}
		});
		return reports;
	},
});

import { mlRuleTest } from 'markuplint';
import { test, expect, describe } from 'vitest';

import rule from './index.js';

describe('The rule prohibits specifying a natural number in the tabindex attribute.', () => {
	test.each(['-1', '0'])('If %s is specified, no warning occurs.', async value => {
		const { violations } = await mlRuleTest(rule, `<div tabindex="${value}"></div>`);

		expect(violations).toStrictEqual([]);
	});

	test('Warn if a natural number greater than or equal to 0 is specified.', async () => {
		const { violations } = await mlRuleTest(rule, '<div tabindex="1"></div>');

		expect(violations).toStrictEqual([
			{
				severity: 'warn',
				line: 1,
				col: 16,
				raw: '1',
				/** @todo Consider the wording of the warning statement. */
				message: 'It is issue',
			},
		]);
	});

	test('Do not display errors for invalid attribute values.', async () => {
		const { violations: specifiedNaN } = await mlRuleTest(rule, '<div tabindex="NaN"></div>');
		const { violations: specifiedBoolean } = await mlRuleTest(rule, '<div tabindex ></div>');

		expect([...specifiedNaN, ...specifiedBoolean]).toStrictEqual([]);
	});
});

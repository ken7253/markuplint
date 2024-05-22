import { mlRuleTest } from 'markuplint';
import { test, expect, describe } from 'vitest';

import rule from './index.js';

describe('The rule prohibits specifying a natural number in the tabindex attribute.', () => {
	test.each(['-1', '0'])('If %s is specified, no warning occurs.', async value => {
		const { violations } = await mlRuleTest(rule, `<div tabindex="${value}"></div>`);

		expect(violations.length).toBe(0);
	});

	describe('The tabindex attribute cannot be specified for the Dialog element.', () => {
		test('If the tabindex attribute is specified, an error occurs.', async () => {
			const { violations } = await mlRuleTest(rule, '<dialog tabindex="-1"></dialog>');

			expect(violations).toStrictEqual([
				{
					severity: 'warning',
					col: 1,
					line: 1,
					raw: '<dialog tabindex="-1">',
					/** @todo Consider the wording of the warning statement. */
					message: 'It is issue',
				},
			]);
		});

		test('If the tabindex attribute is not specified, there is no error.', async () => {
			const { violations } = await mlRuleTest(rule, '<dialog autoFocus></dialog>');

			expect(violations.length).toBe(0);
		});
	});

	test('Warn if a natural number greater than or equal to 0 is specified.', async () => {
		const { violations } = await mlRuleTest(rule, '<div tabindex="1"></div>');

		expect(violations).toStrictEqual([
			{
				severity: 'warning',
				line: 1,
				col: 6,
				raw: 'tabindex',
				/** @todo Consider the wording of the warning statement. */
				message: 'It is issue',
			},
		]);
	});

	/**
	 * @see https://markuplint.dev/docs/rules/invalid-attr
	 */
	test('Do not display errors for invalid attribute values.', async () => {
		const { violations: specifiedNaN } = await mlRuleTest(rule, '<div tabindex="NaN"></div>');
		const { violations: specifiedInfinity } = await mlRuleTest(rule, '<div tabindex="Infinity"></div>');
		const { violations: specifiedBoolean } = await mlRuleTest(rule, '<div tabindex ></div>');

		const mergeViolations = [...specifiedNaN, ...specifiedInfinity, ...specifiedBoolean];

		expect(mergeViolations.length).toBe(0);
	});
});

import type { Config, Nullable, AnyRule, RuleConfigValue, Rules } from './types';

import deepmerge from 'deepmerge';
import { isPlainObject } from 'is-plain-object';

export function mergeConfig(a: Config, b: Config): Config {
	const config: Config = {
		...a,
		...b,
		plugins: concatArray(a.plugins, b.plugins, true, 'name'),
		parser: mergeObject(a.parser, b.parser),
		parserOptions: mergeObject(a.parserOptions, b.parserOptions),
		specs: mergeObject(a.specs, b.specs),
		excludeFiles: concatArray(a.excludeFiles, b.excludeFiles, true),
		rules: mergeRules(
			// TODO: Deep merge
			a.rules,
			b.rules,
		),
		nodeRules: concatArray(a.nodeRules, b.nodeRules),
		childNodeRules: concatArray(a.childNodeRules, b.childNodeRules),
		overrides: mergeObject(a.overrides, b.overrides),
		// delete all
		extends: undefined,
	};
	deleteUndefProp(config);
	return config;
}

export function mergeRule(a: Nullable<AnyRule>, b: AnyRule): AnyRule {
	// Particular behavior:
	//
	// If the right-side value is false, return false.
	// In short; The `false` makes the rule to be disabled absolutely.
	if (b === false || (!isRuleConfigValue(b) && b.value === false)) {
		return false;
	}

	if (a === undefined) {
		return b;
	}
	if (isRuleConfigValue(b)) {
		if (isRuleConfigValue(a)) {
			if (Array.isArray(a) && Array.isArray(b)) {
				return [...a, ...b];
			}
			return b;
		}
		const value = Array.isArray(a.value) && Array.isArray(b) ? [...a.value, b] : b;
		const res = {
			...a,
			value,
		};
		deleteUndefProp(res);
		return res;
	}
	const severity = b.severity || (!isRuleConfigValue(a) ? a.severity : undefined);
	const value = b.value || (isRuleConfigValue(a) ? a : a.value);
	const options = mergeObject(!isRuleConfigValue(a) ? a.options : undefined, b.options);
	const reason = b.reason || (!isRuleConfigValue(a) ? a.reason : undefined);
	const res = {
		severity,
		value,
		options,
		reason,
	};
	deleteUndefProp(res);
	return res;
}

function mergeObject<T>(a: Nullable<T>, b: Nullable<T>): T | undefined {
	if (a == null) {
		return b || undefined;
	}
	if (b == null) {
		return a || undefined;
	}
	const res = deepmerge<T>(a, b);
	deleteUndefProp(res);
	return res;
}

function concatArray<T extends any>(
	a: Nullable<T[]>,
	b: Nullable<T[]>,
	uniquely = false,
	comparePropName?: string,
): T[] | undefined {
	const newArray: T[] = [];
	function concat(item: T) {
		if (!uniquely) {
			newArray.push(item);
			return;
		}
		if (newArray.includes(item)) {
			return;
		}

		if (!comparePropName) {
			newArray.push(item);
			return;
		}

		const name = getName(item, comparePropName);
		if (!name) {
			newArray.push(item);
			return;
		}

		const existedIndex = newArray.findIndex(e => getName(e, comparePropName) === name);
		if (existedIndex === -1) {
			newArray.push(item);
			return;
		}

		if (typeof item === 'string') {
			return;
		}

		const existed = newArray[existedIndex];
		const merged = mergeObject(existed, item);
		if (!merged) {
			newArray.push(item);
			return;
		}

		newArray.splice(existedIndex, 1, merged);
	}

	a?.forEach(concat);
	b?.forEach(concat);

	return newArray.length === 0 ? undefined : newArray;
}

function getName(item: any, comparePropName: string) {
	if (item == null) {
		return null;
	}
	if (typeof item === 'string') {
		return item;
	}
	if (typeof item === 'object' && item && comparePropName in item && typeof item[comparePropName] === 'string') {
		return item[comparePropName] as string;
	}
	return null;
}

function mergeRules(a: Nullable<Rules>, b: Nullable<Rules>): Rules | undefined {
	if (a == null) {
		return b || undefined;
	}
	if (b == null) {
		return a || undefined;
	}
	const res = { ...a };
	for (const [key, rule] of Object.entries(b)) {
		const merged = mergeRule(res[key], rule);
		if (merged != null) {
			res[key] = merged;
		}
	}
	deleteUndefProp(res);
	return res;
}

function isRuleConfigValue(v: any): v is RuleConfigValue {
	switch (typeof v) {
		case 'string':
		case 'number':
		case 'boolean': {
			return true;
		}
	}
	if (v === null) {
		return true;
	}
	return Array.isArray(v);
}

function deleteUndefProp(obj: any) {
	if (!isPlainObject(obj)) {
		return;
	}
	for (const key in obj) {
		if (obj[key] === undefined) {
			delete obj[key];
		}
	}
}

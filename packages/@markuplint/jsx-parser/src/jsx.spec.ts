import jsxParser, { getName } from './jsx';

describe('getName', () => {
	it('tags', () => {
		// @ts-ignore
		expect(getName(jsxParser('<div></div>')[0].openingElement.name)).toBe('div');
		// @ts-ignore
		expect(getName(jsxParser('<XNode></XNode>')[0].openingElement.name)).toBe('XNode');
		// @ts-ignore
		expect(getName(jsxParser('<XNode.Prop.xxx></XNode.Prop.xxx>')[0].openingElement.name)).toBe('XNode.Prop.xxx');
		// @ts-ignore
		expect(getName(jsxParser('<svg></svg>')[0].openingElement.name)).toBe('svg');

		expect(() => jsxParser('<ns:tag></ns:tag>')).toThrow();
	});
});

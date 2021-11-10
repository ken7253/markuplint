import { MLASTNode, MLASTParentNode } from '@markuplint/ml-ast';
import { SvelteNode } from './svelte-parser';
import { nodeize } from './nodeize';

export function traverse(
	astNodes: SvelteNode[],
	parentNode: MLASTParentNode | null = null,
	rawHtml: string,
): MLASTNode[] {
	const nodeList: MLASTNode[] = [];

	let prevNode: MLASTNode | null = null;
	for (const astNode of astNodes) {
		const nodes = nodeize(astNode, prevNode, parentNode, rawHtml);
		if (!nodes) {
			continue;
		}

		let node: MLASTNode;
		if (Array.isArray(nodes)) {
			node = nodes[nodes.length - 1];
		} else {
			node = nodes;
		}

		if (prevNode) {
			if (node.type !== 'endtag') {
				prevNode.nextNode = node;
			}
			node.prevNode = prevNode;
		}
		prevNode = node;

		if (Array.isArray(nodes)) {
			nodeList.push(...nodes);
		} else {
			nodeList.push(nodes);
		}
	}

	return nodeList;
}

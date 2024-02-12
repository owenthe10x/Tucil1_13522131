export function bfsVisit(roots, visitor, beforeVisit) {
	const seenNodes = []
	let queue = [...roots.map((n) => ({...n, depth: 1}))]
	while (queue.length > 0) {
		const node = queue.shift()
		seenNodes.push(node)
		queue = queue.concat(
			node.children.map((child) => ({...child, depth: node.depth + 1}))
		)
	}
	return seenNodes
}

export function getRootsAllValues(nodes) {
	return bfsVisit(nodes).map((node) => node.value)
}

import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import React, { ReactElement, useState } from 'react';
import Icon from './Icon';
import Tree, { Node } from './models/Tree';

interface Props {
  tree: Tree;
  setTree: Function;
}

export default function ClusterTree({ tree, setTree }: Props): ReactElement {
  const [treeKey, setTreeKey] = useState(0);

  function toggleExpandCollapse(node: Node) {
    if (!tree) throw new Error('Tree is missing, cannot collapse or expand');
    const t = tree.toggleCollapseExpand(node);
    setTree(t);
    // cause re-render by updating the key
    setTreeKey((key) => key + 1);
  }

  function renderTree(nodes = tree?.getNodes()) {
    if (!tree) return null;
    if (!nodes) return null;

    return nodes.map((node) => (
      <ul key={node.id}>
        <li>
          <Icon
            icon={node.collapsed ? faCaretRight : faCaretDown}
            onClick={() => toggleExpandCollapse(node)}
          />
          {node.blog.name}
        </li>
        {!node.collapsed &&
          node.children.length > 0 &&
          renderTree(node.children)}
      </ul>
    ));
  }

  function expandAll() {
    const t = tree?.expandAll();
    if (t) setTree(t);
    setTreeKey(key => key + 1);
}

function collapseAll() {
    const t = tree?.collapseAll();
    if (t) setTree(t);
    setTreeKey(key => key + 1);
  }

  return (
    <>
      <button style={{ marginRight: '5px' }} onClick={expandAll}>
        Expand all
      </button>
      <button onClick={collapseAll}>Collapse all</button>
      <div key={treeKey}>{tree?.getNodes() && renderTree()}</div>
    </>
  );
}

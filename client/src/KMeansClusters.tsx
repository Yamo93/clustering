import { faCaretDown, faCaretRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import React, { ReactElement } from 'react';
import { Cluster } from './App';
import Icon from './Icon';

interface Props {
  clusters: Cluster[];
  setClusters: Function;
}

export default function KMeansClusters({
  clusters,
  setClusters,
}: Props): ReactElement {
  function expandAll() {
    const c = clusters.map((cluster) => ({ ...cluster, collapsed: false }));
    setClusters(c);
  }

  function collapseAll() {
    const c = clusters.map((cluster) => ({ ...cluster, collapsed: true }));
    setClusters(c);
  }
  
  function toggleCollapseExpandCluster(index: number) {
    const c = [...clusters];
    const cluster = c[index];
    cluster.collapsed = !cluster.collapsed;
    setClusters(c);
  }
  
  return (
    <>
      <div>
        <button style={{ marginRight: '5px' }} onClick={expandAll}>
          Expand all
        </button>
        <button onClick={collapseAll}>Collapse all</button>
      </div>
      <ul>
        {clusters.map((cluster, index) => (
          <div key={index}>
            <li>
              <Icon
                onClick={() => toggleCollapseExpandCluster(index)}
                icon={cluster.collapsed ? faCaretRight : faCaretDown}
              />
              Cluster {index + 1}
            </li>
            <ul>
              {!cluster.collapsed &&
                cluster.assignments.map((assignment) => (
                  <li key={assignment.name}>
                    <Icon icon={faCircle} size="xs" />
                    {assignment.name}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </ul>
    </>
  );
}

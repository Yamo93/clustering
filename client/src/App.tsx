import React, { ChangeEvent, useEffect, useState } from 'react';
import './App.css';
import ClusterTree from './ClusterTree';
import { ClusteringType, CLUSTERING_TYPES } from './const';
import KMeansClusters from './KMeansClusters';
import Tree from './models/Tree';

interface Assignment {
  name: string;
}

export interface Cluster {
  assignments: Assignment[];
  collapsed: boolean;
}

function App() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [clusteringType, setClusteringType] = useState<ClusteringType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [tree, setTree] = useState<Tree | null>(null);

  function isKMeansClustering(type = clusteringType): boolean {
    return type?.value === CLUSTERING_TYPES.KMEANS.value;
  }

  function isHierarchicalClustering(type = clusteringType): boolean {
    return type?.value === CLUSTERING_TYPES.HIERARCHICAL.value;
  }

  function handleClusteringType(e: ChangeEvent<HTMLSelectElement>): void {
    const value: string = e.target.value;
    const newClusteringType = CLUSTERING_TYPES[value];
    setClusteringType(newClusteringType);

    if (isHierarchicalClustering(newClusteringType)) {
      fetchByHierarchicalClustering();
    } else if (isKMeansClustering(newClusteringType)) {
      fetchByKMeansClustering();
    }
  }

  async function fetchByKMeansClustering() {
    try {
      setIsLoading(true);
      const response = await fetch(
        'http://localhost:3000/api/blogs/clusters-by-k-means',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const { clusters: c } = await response.json();
      setIsLoading(false);
      setClusters(c);
    } catch (error) {
      console.error('Could not fetch by k-means clustering', error);
    }
  }

  async function fetchByHierarchicalClustering() {
    try {
      setIsLoading(true);
      const response = await fetch(
        'http://localhost:3000/api/blogs/hierarchical-clustering',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const { clusters: c } = await response.json();
      setIsLoading(false);
      const t = new Tree(c[0]);
      setTree(t);
      console.log('tree', t);
    } catch (error) {
      console.error('Could not fetch by hierarchical clustering', error);
    }
  }

  useEffect(() => {
    // set default
    setClusteringType(CLUSTERING_TYPES.KMEANS);

    // fetch by k-means
    fetchByKMeansClustering();
  }, []);

  return (
    <div className="App">
      <div>
        <label>Clustering type</label>
        <select value={clusteringType?.value} onChange={handleClusteringType}>
          {Object.values(CLUSTERING_TYPES).map(({ value, text }) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
        {isLoading && <div>Loading data from server...</div>}
        {isKMeansClustering() && (
          <KMeansClusters clusters={clusters} setClusters={setClusters} />
        )}
      </div>
      {isHierarchicalClustering() && tree?.getNodes() && (
        <ClusterTree tree={tree} setTree={setTree} />
      )}
    </div>
  );
}

export default App;

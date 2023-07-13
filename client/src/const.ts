export interface ClusteringType {
    value: string;
    text: string;
}

type ClusteringTypes = {
    [key: string]: ClusteringType;
}

export const CLUSTERING_TYPES: ClusteringTypes = {
    HIERARCHICAL: {
        value: 'HIERARCHICAL',
        text: 'Hierarchical'
    },
    KMEANS: {
        value: 'KMEANS',
        text: 'K-Means'
    }
}
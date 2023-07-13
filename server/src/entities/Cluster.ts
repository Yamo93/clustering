import Blog from "./Blog";

export interface ICluster {
  parent: Cluster | null;
  left: Cluster | null;
  right: Cluster | null;
  blog: Blog | null;
  distance: number;
}

class Cluster implements ICluster {
  #parent: Cluster | null;
  left: Cluster | null;
  right: Cluster | null;
  blog: Blog | null;
  distance: number;

  constructor() {
    this.#parent = null;
    this.left = null;
    this.right = null;
    this.blog = null;
    this.distance = 0;
  }

  get parent(): Cluster | null {
      return this.#parent;
  }

  set parent(parent: Cluster | null) {
      this.#parent = parent;
  }

  public isEqual(cluster: Cluster): boolean {
    if (!this.blog || !cluster.blog) return false;
    return this.blog.isEqual(cluster.blog);
  }
}

export default Cluster;

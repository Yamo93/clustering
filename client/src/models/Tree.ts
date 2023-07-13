interface Blog {
  name: string;
}

export class Node {
  public blog: Blog;
  public children: Node[];
  public collapsed: boolean;
  public id: number;

  constructor(blog: any, id: number) {
    this.blog = blog;
    this.children = [];
    this.collapsed = false;
    this.id = id;
  }

  public hasChildren(): boolean {
    return this.children.length > 0;
  }
}

export default class Tree {
  private nodes: Node[];
  private idCounter: number;

  constructor(c: any) {
    this.nodes = [];
    this.idCounter = 1;
    this.generateTree(c);
  }

  public getNodes(): Node[] {
    return this.nodes;
  }

  private hasLeft(c: any): boolean {
    return Boolean(c.left);
  }

  private hasRight(c: any): boolean {
    return Boolean(c.right);
  }

  private generateTree(c: any, nodes = this.nodes) {
    if (!c) throw new Error('Cluster is missing.');
    // generate unique id for each node in the tree
    const node = new Node(c.blog, this.idCounter);
    this.idCounter++;
    nodes.push(node);
    if (this.hasLeft(c)) {
      this.generateTree(c.left, node.children);
    }
    if (this.hasRight(c)) {
      this.generateTree(c.right, node.children);
    }

    return this;
  }

  public toggleCollapseExpand(node: Node): Tree {
    // toggle
    node.collapsed = !node.collapsed;

    // collapse or expand
    if (node.collapsed) {
      this.collapse(node);
    } else {
      this.expand(node);
    }

    return this;
  }

  private traverse(node: Node, callback: (node: Node) => void): void {
    for (const child of node.children) {
      callback(child);
      if (child.hasChildren()) {
        this.traverse(child, callback);
      }
    }
  }

  private expand(node: Node) {
    this.traverse(node, (n) => {
      n.collapsed = false;
    });
  }

  private collapse(node: Node) {
    this.traverse(node, (n) => {
      n.collapsed = true;
    });
  }

  public expandAll(): Tree {
    const root = this.nodes[0];
    root.collapsed = false;
    this.expand(root);
    return this;
  }

  public collapseAll(): Tree {
    const root = this.nodes[0];
    root.collapsed = true;
    this.collapse(root);
    return this;
  }
}

import { MinMaxCount } from "@daos/Blog/BlogDao";
import Blog from "./Blog";

export interface ICentroid {
  assignments: Blog[];
  setWordCount: (index: number, number: number) => void;
  clearAssignments: () => void;
  assign: (blog: Blog) => void;
  getPreviousAssignment: (index: number) => Blog | null;
  hasNewAssignments: () => boolean;
  storePreviousAssignments: () => void;
}

class Centroid implements ICentroid {
  #assignments: Blog[];
  #previousAssignments: Blog[];
  #wordCounts: number[];

  constructor(counts: MinMaxCount[]) {
    this.#assignments = [];
    this.#wordCounts = [];
    this.#previousAssignments = [];
    this.generateRandomRanges(counts);
  }

  public get assignments() {
    return this.#assignments;
  }

  private generateRandomRanges(counts: MinMaxCount[]) {
    // Assign random int within minmax range for each word
    for (let i = 0; i < counts.length; i++) {
      const minMaxCount = counts[i];
      const r = minMaxCount.random();
      this.setWordCount(i, r);
    }
  }

  public setWordCount(index: number, number: number): void {
    this.#wordCounts[index] = number;
  }

  public clearAssignments(): void {
    this.#assignments = [];
  }

  public assign(blog: Blog): void {
    this.#assignments.push(blog);
  }

  public getPreviousAssignment(index: number): Blog | null {
    if (index < 0 || index >= this.#previousAssignments.length) {
      return null;
    }
    return this.#previousAssignments[index];
  }

  public hasNewAssignments(): boolean {
    return this.#assignments.some((assignment, index) => {
      return !assignment.isEqual(this.getPreviousAssignment(index));
    });
  }

  public storePreviousAssignments(): void {
    this.#previousAssignments = this.#assignments.slice();
  }
}

export default Centroid;

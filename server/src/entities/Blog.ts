class WordCount {
  word: string;
  count: number;

  constructor(word: string, count: number) {
    this.word = word;
    this.count = count;
  }
}

export interface IBlog {
  name: string;
  wordCounts: WordCount[];
  isEqual: (blog: Blog) => boolean;
  getWordCountFor: (index: number) => number;
  setWordCount: (index: number, count: number) => void;
}

class Blog implements IBlog {
  public name: string;
  #wordCounts: WordCount[];

  constructor(rawData: any = null) {
    if (rawData) {
      // Clone incoming data
      const data = { ...rawData };
      // Assign name
      this.name = data.Blog;
      // remove old name property
      delete data.Blog;

      // Parse word counts to numbers
      const wordCounts: WordCount[] = [];
      for (const key in data) {
        const wc = new WordCount(key, Number(data[key]));
        wordCounts.push(wc);
      }
      // Assign word counts
      this.#wordCounts = wordCounts;
    } else {
      this.name = "";
      this.#wordCounts = [];
    }
  }

  public getWordCountFor(index: number) {
    if (index < 0 || index >= this.#wordCounts.length) {
      throw new Error("No word exists at the index " + index);
    }

    const wc = this.#wordCounts[index];
    return wc.count;
  }

  public get wordCounts(): WordCount[] {
    return this.#wordCounts;
  }

  public isEqual(blog: Blog | null): boolean {
    if (!blog) {
        return false;
    }

    if (this.name !== blog.name) {
        return false;
    }

    // compare word counts
    for (let i = 0; i < blog.wordCounts.length; i++) {
      if (blog.getWordCountFor(i) !== this.getWordCountFor(i)) {
        return false;
      }
    }

    return true;
  }

  public setWordCount(index: number, count: number): void {
    this.#wordCounts[index] = new WordCount("", count);
  }
}

export default Blog;

import Blog, { IBlog } from '@entities/Blog';
import Centroid from '@entities/Centroid';
import Cluster from '@entities/Cluster';
import path from 'path';
import FileService from 'src/services/FileService';

interface KMeansCluster {
  assignments: Blog[];
}

export class MinMaxCount {
  min: number;
  max: number;

  constructor(value: number) {
    this.min = value;
    this.max = value;
  }

  set(count: number) {
    if (count < this.min) {
      this.min = count;
    }

    if (count > this.max) {
      this.max = count;
    }
  }

  /**
   *
   * @returns Random number between min and max (both inclusive)
   */
  random(): number {
    // taken from
    // https://stackoverflow.com
    // /questions/4959975/generate-random-number-between-two-numbers-in-javascript
    return Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
  }
}

export interface IBlogDao {
  getClustersByKMeans: () => Promise<KMeansCluster[]>;
  getClustersByHierarchy: () => Promise<Cluster[]>;
}

class BlogDao implements IBlogDao {
  public async getClustersByKMeans(): Promise<KMeansCluster[]> {
    const pathName = path.join(__dirname, '..', '..', 'data', 'blogdata.txt');
    const rawBlogs = await FileService.readCsvFile(pathName);
    const blogs: Blog[] = rawBlogs.map((blog) => new Blog(blog));

    // calculate min and max counts for every word
    const counts: MinMaxCount[] = this.calculateMinMaxCounts(blogs);

    const clusters: KMeansCluster[] = this.clusterByKMeans(blogs, counts);
    return clusters;
  }

  clusterByKMeans(blogs: Blog[], counts: MinMaxCount[]): KMeansCluster[] {
    // K-Means
    // number of words
    const n = 706;

    // generate K random centroids
    const K = 5;
    const centroids: Centroid[] = [];
    for (let i = 0; i < K; i++) {
      const c = new Centroid(counts);
      centroids.push(c);
    }

    // iteration loop
    let iterate = true;
    while (iterate) {
      // clear assignments for all centroids
      centroids.forEach((c) => c.clearAssignments());

      // assign each blog to closest centroid
      let best = new Centroid(counts);
      for (const blog of blogs) {
        let distance = Number.MAX_VALUE;
        // find closest centroid
        for (const centroid of centroids) {
          const cDist = this.pearson(centroid, blog);
          if (cDist < distance) {
            best = centroid;
            distance = cDist;
          }
        }
        // assign blog to centroid
        if (best) {
          best.assign(blog);
        }
      }

      // if there are no new assignments, i.e:
      // all blogs are assigned to the same centroids again, stop the iteration
      const newAssignmentsExist = centroids.some((c) => c.hasNewAssignments());
      if (!newAssignmentsExist) {
        iterate = false;
        return this.getKMeansClusters(centroids);
      }

      // re-calculate center for each centroid
      for (const centroid of centroids) {
        // store previous assignments for next iteration
        centroid.storePreviousAssignments();

        // find average count for each word
        for (let i = 0; i < n; i++) {
          let avg = 0;
          // iterate over all blogs assigned to this centroid
          for (const blog of centroid.assignments) {
            avg += blog.getWordCountFor(i);
          }

          avg /= centroid.assignments.length;

          // update word count for the centroid
          centroid.setWordCount(i, avg);
        }
      }
    }

    return this.getKMeansClusters(centroids);
  }

  getKMeansClusters(centroids: Centroid[]): KMeansCluster[] {
    return centroids.map((c) => ({ assignments: c.assignments }));
  }

  public async getClustersByHierarchy(): Promise<Cluster[]> {
    const pathName = path.join(__dirname, '..', '..', 'data', 'blogdata.txt');
    const rawBlogs = await FileService.readCsvFile(pathName);
    const blogs: Blog[] = rawBlogs.map((blog) => new Blog(blog));

    const clusters: Cluster[] = this.clusterByHierarchy(blogs);
    return clusters;
  }

  private calculateMinMaxCounts(blogs: IBlog[]): MinMaxCount[] {
    const counts: MinMaxCount[] = [];
    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      for (let j = 0; j < blog.wordCounts.length; j++) {
        const wc = blog.wordCounts[j];
        if (counts[j] instanceof MinMaxCount) {
          counts[j].set(wc.count);
        } else {
          const minMaxCount = new MinMaxCount(wc.count);
          counts.push(minMaxCount);
        }
      }
    }
    return counts;
  }

  private pearson(centroid: Centroid, blogB: Blog): number {
    let sumA = 0,
      sumB = 0,
      sumAsq = 0,
      sumBsq = 0,
      pSum = 0;
    const n = 706;

    for (let i = 0; i < centroid.assignments.length; i++) {
      const blogA = centroid.assignments[i];
      for (let j = 0; j < n; j++) {
        if (!blogA) continue;
        const cntA = blogA.getWordCountFor(j); // word counts for each word in A
        const cntB = blogB.getWordCountFor(j); // word counts for each word in B
        sumA += cntA; // sum of word counts for A
        sumB += cntB; // sum of word counts for B
        sumAsq += cntA ** 2; // sum of squared word counts for A
        sumBsq += cntB ** 2; // sum of squared word counts for B
        pSum += cntA * cntB; // product of word counts from A and B
      }
    }

    // calculate pearson
    const num = pSum - (sumA * sumB) / n;
    const den = Math.sqrt((sumAsq - sumA ** 2 / n) * (sumBsq - sumB ** 2 / n));

    // invert pearson score
    const inverted = 1 - num / den;
    if (inverted) return inverted;
    return 0;
  }

  private _pearson(blogA: Blog | null, blogB: Blog | null): number {
    if (!blogA) throw new Error('Blog A is missing.');
    if (!blogB) throw new Error('Blog B is missing.');
    let sumA = 0,
      sumB = 0,
      sumAsq = 0,
      sumBsq = 0,
      pSum = 0;
    const n = 706;

    for (let i = 0; i < n; i++) {
      const cntA = blogA.getWordCountFor(i); // word counts for each word in A
      const cntB = blogB.getWordCountFor(i); // word counts for each word in B
      sumA += cntA; // sum of word counts for A
      sumB += cntB; // sum of word counts for B
      sumAsq += cntA ** 2; // sum of squared word counts for A
      sumBsq += cntB ** 2; // sum of squared word counts for B
      pSum += cntA * cntB; // product of word counts from A and B
    }

    // calculate pearson
    const num = pSum - (sumA * sumB) / n;
    const den = Math.sqrt((sumAsq - sumA ** 2 / n) * (sumBsq - sumB ** 2 / n));

    // invert pearson score
    const inverted = 1 - num / den;
    if (inverted) return inverted;
    return 0;
  }

  private clusterByHierarchy(blogs: Blog[]): Cluster[] {
    // generate one cluster for each blog
    const clusters = blogs.map((blog) => {
      const c = new Cluster();
      c.blog = blog; // generate cluster
      return c;
    });

    // iteratively merge clusters one at a time until only one cluster remains
    // iterate as long as there are more than one cluster in the clusters list
    while (clusters.length > 1) {
      let closest = Number.MAX_VALUE;
      let a: Cluster = new Cluster();
      let b: Cluster = new Cluster();
      for (let i = 0; i < clusters.length; i++) {
        const cA = clusters[i];
        for (let j = 0; j < clusters.length; j++) {
          const cB = clusters[j];
          const distance = this._pearson(cA.blog, cB.blog);
          if (distance < closest && !cA.isEqual(cB)) {
            // new set of closest nodes found
            closest = distance;
            a = cA;
            b = cB;
          }
        }
      }

      // merge the two clusters
      const cluster = this.merge(a, b, closest);
      // add new cluster
      clusters.push(cluster);
      // remove the two clusters
      this.removeCluster(clusters, a);
      this.removeCluster(clusters, b);
    }
    return clusters;
  }

  removeCluster(clusters: Cluster[], c: Cluster) {
    const indexOfA = clusters.indexOf(c);
    clusters.splice(indexOfA, 1);
  }

  private merge(a: Cluster, b: Cluster, distance: number): Cluster {
    if (!a.blog) throw new Error('Blog is missing for cluster A.');
    if (!b.blog) throw new Error('Blog is missing for cluster B');
    // number of words
    const n = 706;

    // create new cluster
    const p = new Cluster();

    // fill data
    p.left = a;
    a.parent = p;
    p.right = b;
    b.parent = p;

    // merge blog data by averaging word counts for each word
    const blog = new Blog();
    for (let i = 0; i < n; i++) {
      const countA = a.blog.getWordCountFor(i);
      const countB = b.blog.getWordCountFor(i);
      // average word count
      const avg = (countA + countB) / 2;
      // set wordcount to new blog
      blog.setWordCount(i, avg);
    }

    // set blog to new cluster
    p.blog = blog;
    // set distance
    p.distance = distance;

    return p;
  }
}

export default BlogDao;

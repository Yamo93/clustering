import { Router } from 'express';
import { getClustersByKMeans, getClustersByHierarchy } from './Blogs';

// Blog-route
const blogRouter = Router();
blogRouter.get('/clusters-by-k-means', getClustersByKMeans);
blogRouter.get('/hierarchical-clustering', getClustersByHierarchy);

// Export the base-router
const baseRouter = Router();
baseRouter.use('/blogs', blogRouter);
export default baseRouter;

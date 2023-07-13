import StatusCodes from "http-status-codes";
import { Request, Response } from "express";

import BlogDao from "@daos/Blog/BlogDao";

const blogDao = new BlogDao();
const { OK } = StatusCodes;

/**
 * Get all clusters by K-Means clustering.
 *
 * @param req
 * @param res
 * @returns
 */
export function getClustersByKMeans(req: Request, res: Response) {
  blogDao.getClustersByKMeans().then((clusters) => res.status(OK).json({ clusters }));
}

/**
 * Get all clusters by hierarchical clustering.
 *
 * @param req
 * @param res
 * @returns
 */
export function getClustersByHierarchy(req: Request, res: Response) {
  blogDao.getClustersByHierarchy().then((clusters) => res.status(OK).json({ clusters }));
}

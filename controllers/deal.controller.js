import { asyncHandler } from '../utils/asyncHandler.js';
import * as dealService from '../services/deal.service.js';

export const createDealController = asyncHandler(async (req, res) => {
  const deal = await dealService.createDeal(req.body, req.user.id);
  res.status(201).json(deal);
});

export const updateDealController = asyncHandler(async (req, res) => {
  const deal = await dealService.updateDeal(req.params.dealId, req.body);
  res.status(200).json(deal);
});

export const moveDealStageController = asyncHandler(async (req, res) => {
  const deal = await dealService.moveDealStage(req.params.dealId, req.body.stage, req.user.id, req.body.lostReason);
  res.status(200).json(deal);
});

export const getPipelineController = asyncHandler(async (req, res) => {
  const pipeline = await dealService.getPipelineGroupedByStage(req.query);
  res.status(200).json(pipeline);
});

export const getConversionStatsController = asyncHandler(async (req, res) => {
  const stats = await dealService.getDealConversionStats(req.query.startDate, req.query.endDate);
  res.status(200).json(stats);
});

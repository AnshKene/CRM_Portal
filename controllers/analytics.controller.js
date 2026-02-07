import { asyncHandler } from '../utils/asyncHandler.js';
import * as analyticsService from '../services/analytics.service.js';

export const leadConversionRateController = asyncHandler(async (req, res) => {
  const data = await analyticsService.getLeadConversionRate(req.query.startDate, req.query.endDate);
  res.status(200).json(data);
});

export const dealsWonLostController = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDealsWonVsLost(req.query.startDate, req.query.endDate);
  res.status(200).json(data);
});

export const salesPerformanceController = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSalesPerformanceByUser(req.query.startDate, req.query.endDate);
  res.status(200).json(data);
});

export const monthlyRevenueController = asyncHandler(async (req, res) => {
  const data = await analyticsService.getMonthlyRevenue(req.query.startDate, req.query.endDate);
  res.status(200).json(data);
});

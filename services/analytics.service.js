import { Deal } from '../models/Deal.js';
import { Lead } from '../models/Lead.js';

const buildDateMatch = (startDate, endDate, field = 'createdAt') => ({
  [field]: {
    $gte: new Date(startDate),
    $lte: new Date(endDate),
  },
});

export const getLeadConversionRate = async (startDate, endDate) => {
  const [stats] = await Lead.aggregate([
    { $match: buildDateMatch(startDate, endDate) },
    {
      $group: {
        _id: null,
        totalLeads: { $sum: 1 },
        convertedLeads: { $sum: { $cond: [{ $ne: ['$convertedToCustomer', null] }, 1, 0] } },
      },
    },
    {
      $project: {
        _id: 0,
        totalLeads: 1,
        convertedLeads: 1,
        conversionRate: {
          $cond: [{ $eq: ['$totalLeads', 0] }, 0, { $multiply: [{ $divide: ['$convertedLeads', '$totalLeads'] }, 100] }],
        },
      },
    },
  ]);

  return stats || { totalLeads: 0, convertedLeads: 0, conversionRate: 0 };
};

export const getDealsWonVsLost = async (startDate, endDate) => Deal.aggregate([
  { $match: buildDateMatch(startDate, endDate) },
  {
    $group: {
      _id: '$stage',
      count: { $sum: 1 },
      value: { $sum: '$dealValue' },
    },
  },
  { $match: { _id: { $in: ['Won', 'Lost'] } } },
]);

export const getSalesPerformanceByUser = async (startDate, endDate) => Deal.aggregate([
  { $match: buildDateMatch(startDate, endDate) },
  {
    $group: {
      _id: '$assignedTo',
      totalDeals: { $sum: 1 },
      wonDeals: { $sum: { $cond: [{ $eq: ['$stage', 'Won'] }, 1, 0] } },
      revenue: { $sum: { $cond: [{ $eq: ['$stage', 'Won'] }, '$dealValue', 0] } },
    },
  },
  {
    $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'user',
    },
  },
  { $unwind: '$user' },
  {
    $project: {
      userId: '$_id',
      fullName: '$user.fullName',
      email: '$user.email',
      totalDeals: 1,
      wonDeals: 1,
      revenue: 1,
      _id: 0,
    },
  },
]);

export const getMonthlyRevenue = async (startDate, endDate) => Deal.aggregate([
  { $match: { ...buildDateMatch(startDate, endDate, 'expectedCloseDate'), stage: 'Won' } },
  {
    $group: {
      _id: { year: { $year: '$expectedCloseDate' }, month: { $month: '$expectedCloseDate' } },
      revenue: { $sum: '$dealValue' },
      deals: { $sum: 1 },
    },
  },
  { $sort: { '_id.year': 1, '_id.month': 1 } },
]);

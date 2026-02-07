import Joi from 'joi';
import { Deal } from '../models/Deal.js';
import { HttpError } from '../utils/httpError.js';
import { eventBus } from './eventBus.service.js';

const validTransitions = {
  Lead: ['Proposal', 'Lost'],
  Proposal: ['Negotiation', 'Lost'],
  Negotiation: ['Won', 'Lost'],
  Won: [],
  Lost: [],
};

const dealSchema = Joi.object({
  title: Joi.string().trim().required(),
  customerId: Joi.string().hex().length(24).required(),
  dealValue: Joi.number().min(0).required(),
  expectedCloseDate: Joi.date().required(),
  assignedTo: Joi.string().hex().length(24).required(),
  stage: Joi.string().valid('Lead', 'Proposal', 'Negotiation', 'Won', 'Lost').default('Lead'),
  lostReason: Joi.string().allow(null, ''),
});

export const createDeal = async (payload, userId) => {
  const { value, error } = dealSchema.validate(payload, { abortEarly: false });
  if (error) throw new HttpError(400, 'Invalid deal payload', error.details);

  return Deal.create({ ...value, createdBy: userId });
};

export const updateDeal = async (dealId, updates) => {
  const deal = await Deal.findByIdAndUpdate(dealId, updates, { new: true, runValidators: true });
  if (!deal) throw new HttpError(404, 'Deal not found');
  return deal;
};

export const moveDealStage = async (dealId, targetStage, userId, lostReason = null) => {
  const deal = await Deal.findById(dealId);
  if (!deal) throw new HttpError(404, 'Deal not found');

  if (!validTransitions[deal.stage]?.includes(targetStage)) {
    throw new HttpError(422, `Invalid stage transition from ${deal.stage} to ${targetStage}`);
  }

  const previousStageUpdatedAt = deal.stageUpdatedAt || deal.updatedAt;
  const durationInPreviousStageHours = Math.max((Date.now() - previousStageUpdatedAt.getTime()) / 36e5, 0);

  deal.history.push({
    fromStage: deal.stage,
    toStage: targetStage,
    changedBy: userId,
    durationInPreviousStageHours,
  });

  deal.stage = targetStage;
  deal.stageUpdatedAt = new Date();
  deal.lostReason = targetStage === 'Lost' ? lostReason : null;

  await deal.save();

  eventBus.emit('deal.stage.changed', {
    ...deal.toObject(),
    relatedEntity: { entityType: 'Deal', entityId: deal._id },
  });

  return deal;
};

export const getPipelineGroupedByStage = async (filters = {}) => {
  const match = {};
  if (filters.assignedTo) match.assignedTo = filters.assignedTo;

  return Deal.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$stage',
        totalDeals: { $sum: 1 },
        totalValue: { $sum: '$dealValue' },
        deals: {
          $push: {
            id: '$_id',
            title: '$title',
            customerId: '$customerId',
            dealValue: '$dealValue',
            assignedTo: '$assignedTo',
            expectedCloseDate: '$expectedCloseDate',
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const getDealConversionStats = async (startDate, endDate) => {
  const dateFilter = {
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  };

  const [summary] = await Deal.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        wonDeals: { $sum: { $cond: [{ $eq: ['$stage', 'Won'] }, 1, 0] } },
        lostDeals: { $sum: { $cond: [{ $eq: ['$stage', 'Lost'] }, 1, 0] } },
        totalDeals: { $sum: 1 },
      },
    },
  ]);

  return summary || { wonDeals: 0, lostDeals: 0, totalDeals: 0 };
};

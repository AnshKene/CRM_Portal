import Joi from 'joi';
import { Customer } from '../models/Customer.js';
import { Lead } from '../models/Lead.js';
import { HttpError } from '../utils/httpError.js';
import { eventBus } from './eventBus.service.js';

const leadSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().min(7).required(),
  source: Joi.string().trim().required(),
  status: Joi.string().valid('New', 'Contacted', 'Qualified', 'Lost').default('New'),
  assignedTo: Joi.string().hex().length(24).optional(),
});

const calculateLeadScore = ({ source, status, email }) => {
  let score = 20;
  if (['referral', 'partner'].includes(source?.toLowerCase())) score += 30;
  if (status === 'Qualified') score += 30;
  if (email?.includes('gmail.com') === false) score += 10;
  return Math.min(score, 100);
};

export const createLead = async (input, userId) => {
  const { value, error } = leadSchema.validate(input, { abortEarly: false });
  if (error) throw new HttpError(400, 'Invalid lead payload', error.details);

  const lead = await Lead.create({
    ...value,
    score: calculateLeadScore(value),
    createdBy: userId,
    activityHistory: [{ action: 'lead_created', performedBy: userId, metadata: { status: value.status } }],
  });

  eventBus.emit('lead.created', {
    ...lead.toObject(),
    relatedEntity: { entityType: 'Lead', entityId: lead._id },
  });

  return lead;
};

export const updateLead = async (leadId, updates, userId) => {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new HttpError(404, 'Lead not found');

  Object.assign(lead, updates);
  lead.score = calculateLeadScore(lead);
  lead.activityHistory.push({ action: 'lead_updated', performedBy: userId, metadata: updates });

  await lead.save();
  return lead;
};

export const assignLead = async (leadId, assignedTo, userId) => {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new HttpError(404, 'Lead not found');

  lead.assignedTo = assignedTo;
  lead.activityHistory.push({ action: 'lead_assigned', performedBy: userId, metadata: { assignedTo } });

  await lead.save();
  return lead;
};

export const deleteLead = async (leadId) => {
  const deleted = await Lead.findByIdAndDelete(leadId);
  if (!deleted) throw new HttpError(404, 'Lead not found');
};

export const listLeads = async (filters) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.assignedTo) query.assignedTo = filters.assignedTo;

  return Lead.find(query).populate('assignedTo', 'fullName email role').sort({ createdAt: -1 });
};

export const convertLeadToCustomer = async (leadId, userId) => {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new HttpError(404, 'Lead not found');
  if (lead.convertedToCustomer) throw new HttpError(409, 'Lead already converted');

  const customer = await Customer.create({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: '',
    tags: ['converted-from-lead'],
    notes: [{ note: `Converted from lead ${lead._id}`, user: userId }],
    createdBy: userId,
  });

  lead.convertedToCustomer = customer._id;
  lead.activityHistory.push({ action: 'lead_converted_to_customer', performedBy: userId, metadata: { customerId: customer._id } });
  await lead.save();

  return { lead, customer };
};

import { asyncHandler } from '../utils/asyncHandler.js';
import * as leadService from '../services/lead.service.js';

export const createLeadController = asyncHandler(async (req, res) => {
  const lead = await leadService.createLead(req.body, req.user.id);
  res.status(201).json(lead);
});

export const updateLeadController = asyncHandler(async (req, res) => {
  const lead = await leadService.updateLead(req.params.leadId, req.body, req.user.id);
  res.status(200).json(lead);
});

export const deleteLeadController = asyncHandler(async (req, res) => {
  await leadService.deleteLead(req.params.leadId);
  res.status(204).send();
});

export const listLeadController = asyncHandler(async (req, res) => {
  const leads = await leadService.listLeads(req.query);
  res.status(200).json(leads);
});

export const assignLeadController = asyncHandler(async (req, res) => {
  const lead = await leadService.assignLead(req.params.leadId, req.body.assignedTo, req.user.id);
  res.status(200).json(lead);
});

export const convertLeadController = asyncHandler(async (req, res) => {
  const result = await leadService.convertLeadToCustomer(req.params.leadId, req.user.id);
  res.status(200).json(result);
});

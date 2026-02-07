import { Workflow } from '../models/Workflow.js';
import { Task } from '../models/Task.js';
import { eventBus } from './eventBus.service.js';

const evaluateCondition = (value, operator, compareValue) => {
  switch (operator) {
    case '>': return value > compareValue;
    case '<': return value < compareValue;
    case '>=': return value >= compareValue;
    case '<=': return value <= compareValue;
    case '==': return value === compareValue;
    case '!=': return value !== compareValue;
    case 'includes': return Array.isArray(value) ? value.includes(compareValue) : String(value).includes(String(compareValue));
    default: return false;
  }
};

const executeAction = async (workflow, payload) => {
  if (workflow.action.type === 'create_task') {
    await Task.create({
      title: workflow.action.payload.title || `Follow-up: ${payload.name || payload.title}`,
      relatedEntity: workflow.action.payload.relatedEntity || payload.relatedEntity,
      dueDate: workflow.action.payload.dueDate || new Date(Date.now() + 24 * 60 * 60 * 1000),
      priority: workflow.action.payload.priority || 'Medium',
      assignedTo: workflow.action.payload.assignedTo || payload.assignedTo,
      createdBy: payload.createdBy,
    });
  }

  if (workflow.action.type === 'send_notification') {
    eventBus.emit('notification.send', {
      recipients: workflow.action.payload.recipients || [payload.assignedTo],
      message: workflow.action.payload.message || `${workflow.trigger} automation triggered`,
      meta: payload,
    });
  }
};

export const processWorkflowTrigger = async (trigger, payload) => {
  const workflows = await Workflow.find({ trigger, isActive: true }).lean();

  await Promise.all(
    workflows.map(async (workflow) => {
      const actualValue = payload[workflow.condition.field];
      const isMatch = evaluateCondition(actualValue, workflow.condition.operator, workflow.condition.value);
      if (isMatch) {
        await executeAction(workflow, payload);
      }
    })
  );
};

eventBus.on('lead.created', async (payload) => processWorkflowTrigger('lead_created', payload));
eventBus.on('deal.stage.changed', async (payload) => processWorkflowTrigger('deal_stage_changed', payload));

import { z } from 'zod';

// Node types
export const nodeTypes = [
  'trigger',
  'delay',
  'message',
  'condition',
  'kanban',
  'tag',
] as const;

// Trigger configuration
export const triggerConfigSchema = z.object({
  triggerType: z.enum(['new_contact', 'tag_added', 'tag_removed', 'date_field']),
  tagId: z.string().optional(),
  dateField: z.string().optional(),
});

// Delay configuration
export const delayConfigSchema = z.object({
  value: z.number().min(1),
  unit: z.enum(['minutes', 'hours', 'days']),
});

// Message configuration
export const messageConfigSchema = z.object({
  channel: z.enum(['WHATSAPP', 'EMAIL', 'SMS']),
  content: z.string().min(1),
  mediaUrl: z.string().optional(),
});

// Condition configuration
export const conditionConfigSchema = z.object({
  field: z.string().min(1),
  operator: z.enum(['equals', 'not_equals', 'contains', 'has_tag']),
  value: z.string(),
});

// Kanban configuration
export const kanbanConfigSchema = z.object({
  columnId: z.string().min(1),
});

// Tag configuration
export const tagConfigSchema = z.object({
  action: z.enum(['add', 'remove']),
  tagId: z.string().min(1),
});

// Node data schema
export const nodeDataSchema = z.object({
  label: z.string(),
  config: z.union([
    triggerConfigSchema,
    delayConfigSchema,
    messageConfigSchema,
    conditionConfigSchema,
    kanbanConfigSchema,
    tagConfigSchema,
  ]),
});

// Node position
export const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

// Flow node schema
export const flowNodeSchema = z.object({
  id: z.string(),
  type: z.enum(nodeTypes),
  data: nodeDataSchema,
  position: positionSchema,
});

// Flow edge schema
export const flowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(), // 'yes' | 'no' for conditions
});

// Create flow schema
export const createFlowSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  nodes: z.array(flowNodeSchema).default([]),
  edges: z.array(flowEdgeSchema).default([]),
});

// Update flow schema
export const updateFlowSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  nodes: z.array(flowNodeSchema).optional(),
  edges: z.array(flowEdgeSchema).optional(),
});

// Update status schema
export const updateStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']),
});

// List flows query schema
export const listFlowsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT', 'ALL']).optional(),
});

// Test flow schema
export const testFlowSchema = z.object({
  contactId: z.string().min(1, 'Contato é obrigatório'),
  mode: z.enum(['simulation', 'real']).default('simulation'),
});

// Types
export type CreateFlowInput = z.infer<typeof createFlowSchema>;
export type UpdateFlowInput = z.infer<typeof updateFlowSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type ListFlowsQuery = z.infer<typeof listFlowsQuerySchema>;
export type TestFlowInput = z.infer<typeof testFlowSchema>;
export type FlowNode = z.infer<typeof flowNodeSchema>;
export type FlowEdge = z.infer<typeof flowEdgeSchema>;

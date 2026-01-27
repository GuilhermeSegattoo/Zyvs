'use client';

import { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { NodePalette } from './NodePalette';
import { nodeTypes } from './CustomNodes';
import { NodeConfigModal } from '../NodeConfigModal';
import type { FlowNode, FlowEdge, NodeType, NodeData } from '../types';
import { getDefaultConfig, generateId } from '../types';

// Define a custom node type for React Flow
type ReactFlowNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
  selected?: boolean;
};

type ReactFlowEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
};

interface FlowCanvasViewProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  onNodesChange: (nodes: FlowNode[]) => void;
  onEdgesChange: (edges: FlowEdge[]) => void;
  onUpdateNode: (nodeId: string, data: NodeData) => void;
}

// Convert FlowNode to ReactFlowNode
function toReactFlowNode(node: FlowNode): ReactFlowNode {
  return {
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data as unknown as Record<string, unknown>,
  };
}

// Convert ReactFlowNode to FlowNode
function toFlowNode(node: ReactFlowNode): FlowNode {
  return {
    id: node.id,
    type: node.type as NodeType,
    position: node.position,
    data: node.data as unknown as NodeData,
  };
}

// Convert FlowEdge to ReactFlowEdge
function toReactFlowEdge(edge: FlowEdge): ReactFlowEdge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
  };
}

// Convert ReactFlowEdge to FlowEdge
function toFlowEdge(edge: ReactFlowEdge): FlowEdge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle as 'yes' | 'no' | undefined,
  };
}

// Internal component that uses React Flow hooks
function FlowCanvasInternal({
  initialNodes,
  initialEdges,
  onExternalNodesChange,
  onExternalEdgesChange,
  onUpdateNode,
}: {
  initialNodes: FlowNode[];
  initialEdges: FlowEdge[];
  onExternalNodesChange: (nodes: FlowNode[]) => void;
  onExternalEdgesChange: (edges: FlowEdge[]) => void;
  onUpdateNode: (nodeId: string, data: NodeData) => void;
}) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Convert initial data to React Flow format
  const rfInitialNodes = useMemo(() => initialNodes.map(toReactFlowNode), [initialNodes]);
  const rfInitialEdges = useMemo(() => initialEdges.map(toReactFlowEdge), [initialEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(rfInitialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfInitialEdges);
  const { screenToFlowPosition } = useReactFlow();

  // Config modal state
  const [configModalNode, setConfigModalNode] = useState<FlowNode | null>(null);

  // Check if trigger exists
  const hasTrigger = nodes.some((n) => n.type === 'trigger');

  // Sync nodes to parent when they change
  const syncNodesToParent = useCallback((currentNodes: ReactFlowNode[]) => {
    const flowNodes = currentNodes.map(toFlowNode);
    onExternalNodesChange(flowNodes);
  }, [onExternalNodesChange]);

  // Sync edges to parent when they change
  const syncEdgesToParent = useCallback((currentEdges: ReactFlowEdge[]) => {
    const flowEdges = currentEdges.map(toFlowEdge);
    onExternalEdgesChange(flowEdges);
  }, [onExternalEdgesChange]);

  // Handle nodes change from React Flow
  const handleNodesChange = useCallback(
    (changes: Parameters<typeof onNodesChange>[0]) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  // Handle edges change from React Flow
  const handleEdgesChange = useCallback(
    (changes: Parameters<typeof onEdgesChange>[0]) => {
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  // Sync when nodes change
  useEffect(() => {
    syncNodesToParent(nodes as ReactFlowNode[]);
  }, [nodes, syncNodesToParent]);

  // Sync when edges change
  useEffect(() => {
    syncEdgesToParent(edges as ReactFlowEdge[]);
  }, [edges, syncEdgesToParent]);

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // Handle drag over
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (!type) return;

      // Don't allow multiple triggers
      if (type === 'trigger' && hasTrigger) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: ReactFlowNode = {
        id: generateId(),
        type,
        position,
        data: {
          label: '',
          config: getDefaultConfig(type),
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, hasTrigger, setNodes]
  );

  // Handle node click (open config modal)
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: ReactFlowNode) => {
      setConfigModalNode(toFlowNode(node));
    },
    []
  );

  // Handle config save
  const handleConfigSave = useCallback(
    (data: NodeData) => {
      if (!configModalNode) return;

      setNodes((nds) =>
        nds.map((n) =>
          n.id === configModalNode.id
            ? { ...n, data: data as unknown as Record<string, unknown> }
            : n
        )
      );

      onUpdateNode(configModalNode.id, data);
      setConfigModalNode(null);
    },
    [configModalNode, setNodes, onUpdateNode]
  );

  // Delete selected nodes with Delete key
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter((n) => n.selected);
        // Don't delete trigger node
        const nodesToDelete = selectedNodes.filter((n) => n.type !== 'trigger');
        const idsToDelete = new Set(nodesToDelete.map((n) => n.id));

        if (idsToDelete.size === 0) return;

        setNodes((nds) => nds.filter((n) => !idsToDelete.has(n.id)));
        setEdges((eds) =>
          eds.filter((e) => !idsToDelete.has(e.source) && !idsToDelete.has(e.target))
        );
      }
    },
    [nodes, setNodes, setEdges]
  );

  // MiniMap node color
  const nodeColor = useCallback((node: { type?: string }) => {
    const colors: Record<string, string> = {
      trigger: '#00ff88',
      delay: '#ffeb3b',
      message: '#25D366',
      condition: '#f97316',
      kanban: '#ff3366',
      tag: '#6b7280',
    };
    return colors[node.type || ''] || '#6b7280';
  }, []);

  return (
    <div className="flex h-full" onKeyDown={onKeyDown} tabIndex={0}>
      {/* Sidebar Palette */}
      <NodePalette hasTrigger={hasTrigger} />

      {/* Canvas */}
      <div className="flex-1 h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          deleteKeyCode={null} // We handle delete manually
          defaultEdgeOptions={{
            style: { strokeWidth: 2, stroke: '#9ca3af' },
            type: 'smoothstep',
          }}
        >
          <Controls />
          <MiniMap nodeColor={nodeColor} zoomable pannable />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        </ReactFlow>
      </div>

      {/* Config Modal */}
      {configModalNode && (
        <NodeConfigModal
          node={configModalNode}
          onSave={handleConfigSave}
          onClose={() => setConfigModalNode(null)}
        />
      )}
    </div>
  );
}

// Main component wrapped with ReactFlowProvider
export function FlowCanvasView({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onUpdateNode,
}: FlowCanvasViewProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInternal
        initialNodes={nodes}
        initialEdges={edges}
        onExternalNodesChange={onNodesChange}
        onExternalEdgesChange={onEdgesChange}
        onUpdateNode={onUpdateNode}
      />
    </ReactFlowProvider>
  );
}

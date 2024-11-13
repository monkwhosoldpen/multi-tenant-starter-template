"use client";

import { Card, CardContent } from "@/components/ui/card";
import { roles } from "@/lib/roles";
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  Node,
  Edge,
  Panel,
  useReactFlow,
  applyNodeChanges,
  NodeChange,
  MarkerType,
  BaseEdge,
  NodeDragHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useMemo, useState, useEffect } from "react";
import useTenant from "@/lib/usetenant";
import { LoadingState } from "../_components/loading-state";
import { Input } from "@/components/ui/input";
import { Search, ZoomIn, ZoomOut } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { NodeData, RelationshipType } from "./types";
import { ChevronDown, ChevronRight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { EdgeType, edgeStyles } from './edge-types';
import { motion } from 'framer-motion';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  getGroupedPosition, 
  getDepartmentBounds, 
  isNodeInDepartment,
  getOptimalPosition 
} from './node-grouping';

// Define departments for filtering
const departments = [
  { value: 'all', label: 'All Departments' },
  { value: 'executive', label: 'Executive' },
  { value: 'operations', label: 'Operations' },
  { value: 'communications', label: 'Communications' },
  { value: 'data', label: 'Data & Analytics' },
  { value: 'events', label: 'Event Planning' },
];

const relationshipColors: Record<RelationshipType, string> = {
  'direct-report': '#2563eb', // blue
  'matrix': '#16a34a',        // green
  'collaborative': '#ca8a04',  // yellow
  'advisory': '#9333ea',      // purple
};

const filterOptions = {
  departments,
  relationships: [
    { value: 'all', label: 'All Relationships' },
    { value: 'direct-report', label: 'Direct Reports' },
    { value: 'matrix', label: 'Matrix' },
    { value: 'collaborative', label: 'Collaborative' },
    { value: 'advisory', label: 'Advisory' },
  ],
  status: [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'away', label: 'Away' },
    { value: 'inactive', label: 'Inactive' },
  ],
  teams: [
    { value: 'all', label: 'All Teams' },
    { value: 'field', label: 'Field Teams' },
    { value: 'communications', label: 'Communications' },
    { value: 'analytics', label: 'Analytics' },
  ],
};

// Mock data with status
const mockTeamMembers = {
  'campaign-director': {
    name: 'John Director',
    email: 'john@campaign.com',
    status: 'active'
  },
  'operations-director': {
    name: 'Sarah Operations',
    email: 'sarah@campaign.com',
    status: 'active'
  },
  'communications-director': {
    name: 'Mike Communications',
    email: 'mike@campaign.com',
    status: 'active'
  },
  'field-coordinator': {
    name: 'Lisa Field',
    email: 'lisa@campaign.com',
    status: 'active'
  },
  'social-media-manager': {
    name: 'Tom Social',
    email: 'tom@campaign.com',
    status: 'active'
  },
  'data-director': {
    name: 'Anna Data',
    email: 'anna@campaign.com',
    status: 'active'
  },
};

function EdgeLabel({ 
  label, 
  labelX, 
  labelY, 
  labelStyle, 
  labelBgStyle 
}: { 
  label: string; 
  labelX: number; 
  labelY: number; 
  labelStyle?: React.CSSProperties; 
  labelBgStyle?: React.CSSProperties; 
}) {
  return (
    <g transform={`translate(${labelX}, ${labelY})`}>
      <rect
        x="-10"
        y="-10"
        width={label.length * 8 + 20}
        height="20"
        rx="5"
        ry="5"
        style={labelBgStyle}
      />
      <text
        style={labelStyle}
        dominantBaseline="middle"
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
}

function CustomEdge({ data, ...props }: any) {
  const edgeStyle = edgeStyles[data.type as EdgeType];
  
  return (
    <>
      <BaseEdge
        {...props}
        style={{
          ...edgeStyle,
          strokeWidth: props.selected ? edgeStyle.strokeWidth + 1 : edgeStyle.strokeWidth,
          animation: edgeStyle.animated ? 'flow 20s linear infinite' : 'none',
        }}
      />
      {data.label && (
        <EdgeLabel
          {...props}
          label={data.label}
          labelStyle={{ fill: edgeStyle.stroke }}
          labelBgStyle={{ fill: 'white' }}
        />
      )}
    </>
  );
}

function RoleNode({ data, isConnectable, selected }: { data: NodeData; isConnectable: boolean; selected: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!data.isCollapsed);

  const renderKPIs = () => (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {data.kpis?.map((kpi, index) => (
        <div key={index} className="text-xs">
          <span className="font-medium">{kpi.name}</span>
          <div className="flex items-center space-x-1">
            <span>{kpi.value}</span>
            {kpi.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
            {kpi.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
            {kpi.trend === 'neutral' && <Minus className="h-3 w-3 text-yellow-500" />}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={false}
      animate={{
        scale: isHovered ? 1.02 : 1,
        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`bg-card rounded-lg border transition-colors duration-200
        ${selected ? 'ring-2 ring-primary' : ''}
        ${isHovered ? 'border-primary' : ''}
        ${data.isHighlighted ? 'ring-2 ring-primary' : ''}`}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={`bg-card p-4 rounded-lg border shadow-sm transition-all duration-200 
                ${isExpanded ? 'min-w-[300px]' : 'min-w-[200px]'}
                ${data.isHighlighted ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="flex items-center justify-between cursor-pointer"
                   onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center space-x-2">
                  {isExpanded ? 
                    <ChevronDown className="h-4 w-4 text-muted-foreground" /> : 
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  }
                  <h3 className="font-semibold text-sm">{data.title}</h3>
                </div>
                {data.member?.status && (
                  <Badge variant={
                    data.member.status === 'active' ? 'success' :
                    data.member.status === 'away' ? 'warning' : 'secondary'
                  }>
                    {data.member.status}
                  </Badge>
                )}
              </div>

              <div className={`mt-2 ${isExpanded ? 'block' : 'hidden'}`}>
                <p className="text-xs text-muted-foreground">{data.description}</p>
                
                {data.member && (
                  <div className="mt-2 pt-2 border-t space-y-2">
                    <div>
                      <p className="text-xs font-medium">{data.member.name}</p>
                      <p className="text-xs text-muted-foreground">{data.member.email}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {data.member.teams.map((team, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {team}
                        </Badge>
                      ))}
                    </div>

                    {data.kpis && renderKPIs()}
                    
                    <div className="text-xs space-y-1">
                      <p><span className="font-medium">Reports to:</span> {data.reportsTo}</p>
                      <p><span className="font-medium">Department:</span> {data.department}</p>
                      <p><span className="font-medium">Since:</span> {data.member.startDate}</p>
                    </div>
                  </div>
                )}

                {data.relationships && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs font-medium mb-1">Relationships:</p>
                    <div className="space-y-1">
                      {data.relationships.map((rel, index) => (
                        <div key={index} className="text-xs flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full`}
                               style={{ backgroundColor: relationshipColors[rel.type] }} />
                          <span>{rel.with}</span>
                          <span className="text-muted-foreground">({rel.type})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-2">
              <p className="font-medium">{data.title}</p>
              <p className="text-sm">{data.description}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
}

const nodeTypes = {
  role: RoleNode,
};

const departmentLayouts: Record<string, { x: number; y: number; width: number; height: number }> = {
  executive: { x: 300, y: -50, width: 400, height: 150 },
  operations: { x: -150, y: 50, width: 300, height: 300 },
  communications: { x: 200, y: 50, width: 300, height: 300 },
  data: { x: 550, y: 50, width: 300, height: 300 },
  events: { x: 900, y: 50, width: 300, height: 300 },
};

export default function OrgViewPage() {
  const { tenantConfig } = useTenant();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { fitView, zoomIn, zoomOut, getNodes, setNodes } = useReactFlow();
  const [selectedRelationType, setSelectedRelationType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [groupByDepartment, setGroupByDepartment] = useState(false);
  const [draggedNode, setDraggedNode] = useState<Node | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Enhanced node dragging with department constraints
  const onNodeDragStart: NodeDragHandler = (event, node) => {
    setDraggedNode(node);
    setIsDragging(true);
  };

  const onNodeDrag: NodeDragHandler = (event, node) => {
    if (groupByDepartment && draggedNode) {
      const newPosition = getOptimalPosition(
        node.position,
        (node.data as any).department,
        nodes
      );
      setNodes(nodes.map(n => 
        n.id === node.id ? { ...n, position: newPosition } : n
      ));
    }
  };

  const onNodeDragStop: NodeDragHandler = (event, node) => {
    setIsDragging(false);
    setDraggedNode(null);
    
    // Save positions to localStorage
    localStorage.setItem('orgChartNodes', JSON.stringify(nodes));
  };

  // Enhanced node grouping
  const getNodesWithGrouping = () => {
    if (!groupByDepartment) return nodes;

    // Count nodes per department
    const departmentCounts = nodes.reduce((acc, node) => {
      const dept = (node.data as any).department;
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Department indices for positioning
    const departmentIndices = nodes.reduce((acc, node) => {
      const dept = (node.data as any).department;
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return nodes.map(node => {
      const dept = (node.data as any).department;
      const position = getGroupedPosition(
        dept,
        node.position,
        departmentIndices[dept] - 1,
        departmentCounts[dept]
      );
      return { ...node, position };
    });
  };

  // Department background rendering
  const DepartmentBackground = ({ department }: { department: string }) => {
    const bounds = getDepartmentBounds(department);
    if (!bounds) return null;

    return (
      <div
        className="absolute rounded-lg bg-muted/20 border border-muted"
        style={{
          left: bounds.x,
          top: bounds.y,
          width: bounds.width,
          height: bounds.height,
          pointerEvents: 'none',
        }}
      >
        <div className="absolute -top-3 left-4 px-2 bg-background text-xs font-medium">
          {department}
        </div>
      </div>
    );
  };

  const { nodes, edges } = useMemo(() => {
    const filteredNodes: Node[] = [
      {
        id: 'campaign-director',
        type: 'role',
        data: { 
          title: roles[0].role,
          description: roles[0].description,
          member: mockTeamMembers['campaign-director'],
          department: 'executive',
          reportsTo: 'Board',
          isHighlighted: searchTerm ? 
            roles[0].role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            roles[0].description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mockTeamMembers['campaign-director']?.name.toLowerCase().includes(searchTerm.toLowerCase())
            : false
        },
        position: { x: 400, y: 0 },
      },
      // Operations Branch
      {
        id: 'operations-director',
        type: 'role',
        data: { 
          title: roles[1].role,
          description: roles[1].description,
          member: mockTeamMembers['operations-director']
        },
        position: { x: 0, y: 100 },
      },
      {
        id: 'field-coordinator',
        type: 'role',
        data: { 
          title: roles[2].role,
          description: roles[2].description,
          member: mockTeamMembers['field-coordinator']
        },
        position: { x: -100, y: 200 },
      },
      {
        id: 'field-organizer',
        type: 'role',
        data: { 
          title: roles[3].role,
          description: roles[3].description 
        },
        position: { x: -100, y: 300 },
      },
      // Communications Branch
      {
        id: 'communications-director',
        type: 'role',
        data: { 
          title: roles[4].role,
          description: roles[4].description,
          member: mockTeamMembers['communications-director']
        },
        position: { x: 300, y: 100 },
      },
      {
        id: 'social-media-manager',
        type: 'role',
        data: { 
          title: roles[5].role,
          description: roles[5].description,
          member: mockTeamMembers['social-media-manager']
        },
        position: { x: 300, y: 200 },
      },
      // Data & Analytics Branch
      {
        id: 'data-director',
        type: 'role',
        data: { 
          title: roles[6].role,
          description: roles[6].description,
          member: mockTeamMembers['data-director']
        },
        position: { x: 600, y: 100 },
      },
      {
        id: 'data-specialist',
        type: 'role',
        data: { 
          title: roles[7].role,
          description: roles[7].description 
        },
        position: { x: 600, y: 200 },
      },
      // Other roles
      {
        id: 'volunteer-coordinator',
        type: 'role',
        data: { 
          title: roles[8].role,
          description: roles[8].description 
        },
        position: { x: 100, y: 200 },
      },
      {
        id: 'event-director',
        type: 'role',
        data: { 
          title: roles[9].role,
          description: roles[9].description 
        },
        position: { x: 800, y: 100 },
      },
      {
        id: 'polling-lead',
        type: 'role',
        data: { 
          title: roles[10].role,
          description: roles[10].description 
        },
        position: { x: 1000, y: 100 },
      },
    ];

    // Department filtering
    const departmentFilteredNodes = selectedDepartment === 'all' 
      ? filteredNodes 
      : filteredNodes.filter(node => node.data.department === selectedDepartment);

    // Search filtering
    const searchFilteredNodes = searchTerm
      ? departmentFilteredNodes.filter(node => node.data.isHighlighted)
      : departmentFilteredNodes;

    const edges: Edge[] = [
      { 
        id: 'cd-od', 
        source: 'campaign-director', 
        target: 'operations-director',
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: '#94a3b8' },
      },
      // ... other edges
    ];

    return { nodes: searchFilteredNodes, edges };
  }, [searchTerm, selectedDepartment]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      // Delay fitView to allow nodes to filter
      setTimeout(() => fitView({ padding: 0.5 }), 100);
    }
  };

  if (!tenantConfig) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-red-600">Configuration Error</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Unable to load tenant configuration. Please contact support.
          </p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Card className="p-6">
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold text-red-600">Error Loading Organization Data</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Troubleshooting steps:</p>
              <ul className="text-sm text-muted-foreground list-disc pl-4">
                <li>Check your internet connection</li>
                <li>Verify your permissions</li>
                <li>Try refreshing the page</li>
              </ul>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
            >
              Retry Loading
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Campaign Organization Structure</h2>
          <div className="flex items-center space-x-2">
            <Switch
              checked={groupByDepartment}
              onCheckedChange={setGroupByDepartment}
              id="group-by-dept"
            />
            <Label htmlFor="group-by-dept">Group by Department</Label>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles, people, or departments..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-64"
            />
          </div>
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedRelationType}
            onValueChange={setSelectedRelationType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Relationship Type" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.relationships.map((rel) => (
                <SelectItem key={rel.value} value={rel.value}>
                  {rel.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.status.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedTeam}
            onValueChange={setSelectedTeam}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Team" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.teams.map((team) => (
                <SelectItem key={team.value} value={team.value}>
                  {team.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-[800px] w-full">
          <ReactFlow
            nodes={getNodesWithGrouping()}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={{ custom: CustomEdge }}
            fitView
            className="bg-background"
            onNodeDragStart={onNodeDragStart}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            onNodeMouseEnter={(_, node) => {
              // Highlight connected nodes
              const connectedNodeIds = edges
                .filter(e => e.source === node.id || e.target === node.id)
                .flatMap(e => [e.source, e.target]);
              setNodes(nodes.map(n => ({
                ...n,
                data: {
                  ...n.data,
                  isHighlighted: connectedNodeIds.includes(n.id),
                },
              })));
            }}
            onNodeMouseLeave={() => {
              // Remove highlights
              setNodes(nodes.map(n => ({
                ...n,
                data: {
                  ...n.data,
                  isHighlighted: false,
                },
              })));
            }}
          >
            {groupByDepartment && Object.keys(departmentLayouts).map(dept => (
              <DepartmentBackground key={dept} department={dept} />
            ))}
            <Panel position="top-left" className="bg-background/90 p-4 rounded-lg border shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search roles, people, or departments..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Panel>
            <Panel position="bottom-right" className="bg-background/90 p-2 rounded-lg border shadow-sm">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => zoomIn()}
                  className="p-2 hover:bg-accent rounded-md"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => zoomOut()}
                  className="p-2 hover:bg-accent rounded-md"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
              </div>
            </Panel>
            <Background />
            <Controls />
            <MiniMap 
              nodeColor={node => {
                const member = (node.data as any).member;
                return member?.status === 'active' ? '#22c55e' : 
                       member?.status === 'away' ? '#eab308' : 
                       '#94a3b8';
              }}
            />
          </ReactFlow>
        </div>
      </Card>
    </div>
  );
} 
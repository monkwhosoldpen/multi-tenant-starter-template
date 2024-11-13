interface Position {
  x: number;
  y: number;
}

interface DepartmentLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  padding: number;
}

const departmentLayouts: Record<string, DepartmentLayout> = {
  executive: {
    x: 400,
    y: 0,
    width: 300,
    height: 150,
    padding: 20,
  },
  operations: {
    x: 0,
    y: 200,
    width: 400,
    height: 300,
    padding: 30,
  },
  communications: {
    x: 450,
    y: 200,
    width: 400,
    height: 300,
    padding: 30,
  },
  data: {
    x: 900,
    y: 200,
    width: 400,
    height: 300,
    padding: 30,
  },
  events: {
    x: 1350,
    y: 200,
    width: 300,
    height: 200,
    padding: 30,
  },
};

export const getGroupedPosition = (
  department: string,
  originalPosition: Position,
  nodeIndex: number,
  totalNodesInDepartment: number
): Position => {
  const layout = departmentLayouts[department];
  if (!layout) return originalPosition;

  // Calculate grid position within department
  const nodesPerRow = Math.ceil(Math.sqrt(totalNodesInDepartment));
  const row = Math.floor(nodeIndex / nodesPerRow);
  const col = nodeIndex % nodesPerRow;

  // Calculate spacing
  const nodeSpacing = (layout.width - 2 * layout.padding) / nodesPerRow;
  const verticalSpacing = (layout.height - 2 * layout.padding) / Math.ceil(totalNodesInDepartment / nodesPerRow);

  return {
    x: layout.x + layout.padding + col * nodeSpacing,
    y: layout.y + layout.padding + row * verticalSpacing,
  };
};

export const getDepartmentBounds = (department: string): DepartmentLayout | undefined => {
  return departmentLayouts[department];
};

// Helper to check if a node is within its department bounds
export const isNodeInDepartment = (
  node: { position: Position; data: { department: string } }
): boolean => {
  const layout = departmentLayouts[node.data.department];
  if (!layout) return true;

  return (
    node.position.x >= layout.x &&
    node.position.x <= layout.x + layout.width &&
    node.position.y >= layout.y &&
    node.position.y <= layout.y + layout.height
  );
};

// Calculate optimal position when dragging between departments
export const getOptimalPosition = (
  position: Position,
  department: string,
  nodes: any[]
): Position => {
  const layout = departmentLayouts[department];
  if (!layout) return position;

  const departmentNodes = nodes.filter(n => n.data.department === department);
  const occupiedPositions = new Set(
    departmentNodes.map(n => `${Math.round(n.position.x)},${Math.round(n.position.y)}`)
  );

  // Grid-based positioning within department
  const gridSize = 50;
  const xPos = Math.round((position.x - layout.x) / gridSize) * gridSize + layout.x;
  const yPos = Math.round((position.y - layout.y) / gridSize) * gridSize + layout.y;

  // Ensure position is within bounds
  const boundedX = Math.max(layout.x + layout.padding,
    Math.min(layout.x + layout.width - layout.padding, xPos));
  const boundedY = Math.max(layout.y + layout.padding,
    Math.min(layout.y + layout.height - layout.padding, yPos));

  // Check if position is occupied
  let finalX = boundedX;
  let finalY = boundedY;
  while (occupiedPositions.has(`${Math.round(finalX)},${Math.round(finalY)}`)) {
    finalX += gridSize;
    if (finalX > layout.x + layout.width - layout.padding) {
      finalX = layout.x + layout.padding;
      finalY += gridSize;
    }
  }

  return { x: finalX, y: finalY };
}; 
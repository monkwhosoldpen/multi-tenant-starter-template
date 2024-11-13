export type EdgeType = 
  | 'direct-report'
  | 'matrix'
  | 'collaborative'
  | 'advisory'
  | 'temporary'
  | 'mentorship'
  | 'project-based'
  | 'cross-functional';

export interface EdgeData {
  type: EdgeType;
  label?: string;
  animated?: boolean;
  strength?: 'strong' | 'medium' | 'weak';
}

export const edgeStyles = {
  'direct-report': {
    stroke: '#2563eb',
    strokeWidth: 2,
    animated: false,
    style: 'solid',
  },
  'matrix': {
    stroke: '#16a34a',
    strokeWidth: 2,
    animated: true,
    strokeDasharray: '5,5',
  },
  'collaborative': {
    stroke: '#ca8a04',
    strokeWidth: 1.5,
    animated: true,
    strokeDasharray: '3,3',
  },
  'advisory': {
    stroke: '#9333ea',
    strokeWidth: 1,
    animated: false,
    strokeDasharray: '2,2',
  },
  'temporary': {
    stroke: '#dc2626',
    strokeWidth: 1,
    animated: true,
    strokeDasharray: '1,5',
  },
  'mentorship': {
    stroke: '#0891b2',
    strokeWidth: 1.5,
    animated: false,
    strokeDasharray: '8,2',
  },
  'project-based': {
    stroke: '#db2777',
    strokeWidth: 1.5,
    animated: true,
    strokeDasharray: '4,2,1,2',
  },
  'cross-functional': {
    stroke: '#7c3aed',
    strokeWidth: 1.5,
    animated: true,
    strokeDasharray: '6,3,2,3',
  },
};

export const edgeStrengthModifier = {
  strong: {
    strokeWidth: (base: number) => base + 1,
    opacity: 1,
  },
  medium: {
    strokeWidth: (base: number) => base,
    opacity: 0.8,
  },
  weak: {
    strokeWidth: (base: number) => base - 0.5,
    opacity: 0.6,
  },
};

// Helper function to get final edge style
export const getEdgeStyle = (type: EdgeType, strength: 'strong' | 'medium' | 'weak' = 'medium') => {
  const baseStyle = edgeStyles[type];
  const strengthMod = edgeStrengthModifier[strength];
  
  return {
    ...baseStyle,
    strokeWidth: strengthMod.strokeWidth(baseStyle.strokeWidth),
    opacity: strengthMod.opacity,
  };
};

// Animation keyframes for different edge types
export const edgeAnimations = {
  flow: `
    @keyframes flow {
      from {
        stroke-dashoffset: 24;
      }
      to {
        stroke-dashoffset: 0;
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0% {
        stroke-width: 1;
        opacity: 1;
      }
      50% {
        stroke-width: 2;
        opacity: 0.8;
      }
      100% {
        stroke-width: 1;
        opacity: 1;
      }
    }
  `,
  dash: `
    @keyframes dash {
      to {
        stroke-dashoffset: 24;
      }
    }
  `,
};

// Edge decorators for different relationship types
export const edgeDecorators = {
  'direct-report': {
    markerEnd: {
      type: 'arrow',
      color: edgeStyles['direct-report'].stroke,
    },
  },
  'matrix': {
    markerEnd: {
      type: 'arrowclosed',
      color: edgeStyles['matrix'].stroke,
    },
  },
  'collaborative': {
    markerEnd: {
      type: 'circle',
      color: edgeStyles['collaborative'].stroke,
    },
  },
  // ... add decorators for other edge types
}; 
export interface TreeNode {
  id: string;
  name: string;
  children: TreeNode[];
  isExpanded?: boolean;
  isLoading?: boolean;
  parentId?: string;
}

export interface TreeNodeProps {
  node: TreeNode;
  level: number;
  onToggle: (nodeId: string) => void;
  onAdd: (parentId: string) => void;
  onRemove: (nodeId: string) => void;
  onEdit: (nodeId: string, newName: string) => void;
  onDragOverChange?: (
    nodeId: string,
    position: "before" | "after" | "inside" | null
  ) => void;
}

export interface TreeViewProps {
  data: TreeNode[];
  onNodeChange: (nodes: TreeNode[]) => void;
}

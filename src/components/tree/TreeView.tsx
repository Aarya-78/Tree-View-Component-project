import React, { useState, useCallback } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { TreeNode, TreeViewProps } from "../../types/tree";
import { TreeNodeComponent } from "./TreeNode";
import { mockApi } from "../../utils/mockApi";
import "./TreeView.css";

export const TreeView: React.FC<TreeViewProps> = ({ data, onNodeChange }) => {
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    nodeId: string;
    position: "before" | "after" | "inside";
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleToggle = useCallback(
    async (nodeId: string) => {
      const updateNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, isExpanded: !node.isExpanded };
          }
          if (node.children.length > 0) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };

      const newData = updateNode(data);
      onNodeChange(newData);

      // Check if we need to load children
      const findNode = (nodes: TreeNode[]): TreeNode | null => {
        for (const node of nodes) {
          if (node.id === nodeId) return node;
          if (node.children.length > 0) {
            const found = findNode(node.children);
            if (found) return found;
          }
        }
        return null;
      };

      const node = findNode(newData);
      if (
        node &&
        node.isExpanded &&
        node.children.length === 0 &&
        !node.isLoading
      ) {
        // Start loading
        const setLoading = (nodes: TreeNode[]): TreeNode[] => {
          return nodes.map((n) => {
            if (n.id === nodeId) {
              return { ...n, isLoading: true };
            }
            if (n.children.length > 0) {
              return { ...n, children: setLoading(n.children) };
            }
            return n;
          });
        };

        onNodeChange(setLoading(newData));

        // Simulate API call
        try {
          const children = await mockApi.loadChildren(nodeId);

          const setChildren = (nodes: TreeNode[]): TreeNode[] => {
            return nodes.map((n) => {
              if (n.id === nodeId) {
                return { ...n, children, isLoading: false };
              }
              if (n.children.length > 0) {
                return { ...n, children: setChildren(n.children) };
              }
              return n;
            });
          };

          onNodeChange(setChildren(newData));
        } catch (error) {
          // Handle error - stop loading
          const stopLoading = (nodes: TreeNode[]): TreeNode[] => {
            return nodes.map((n) => {
              if (n.id === nodeId) {
                return { ...n, isLoading: false };
              }
              if (n.children.length > 0) {
                return { ...n, children: stopLoading(n.children) };
              }
              return n;
            });
          };

          onNodeChange(stopLoading(newData));
        }
      }
    },
    [data, onNodeChange]
  );

  const handleAdd = useCallback(
    (parentId: string) => {
      const newNodeName = prompt("Enter node name:");
      if (!newNodeName?.trim()) return;

      const updateNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
          if (node.id === parentId) {
            const newNode: TreeNode = {
              id: `${parentId}-child-${Date.now()}`,
              name: newNodeName.trim(),
              children: [],
              parentId,
            };
            return { ...node, children: [...node.children, newNode] };
          }
          if (node.children.length > 0) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };

      onNodeChange(updateNode(data));
    },
    [data, onNodeChange]
  );

  const handleRemove = useCallback(
    (nodeId: string) => {
      if (
        !confirm(
          "Are you sure you want to delete this node and all its children?"
        )
      )
        return;

      const removeNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.filter((node) => {
          if (node.id === nodeId) {
            return false;
          }
          if (node.children.length > 0) {
            node.children = removeNode(node.children);
          }
          return true;
        });
      };

      onNodeChange(removeNode(data));
    },
    [data, onNodeChange]
  );

  const handleEdit = useCallback(
    (nodeId: string, newName: string) => {
      const updateNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, name: newName };
          }
          if (node.children.length > 0) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };

      onNodeChange(updateNode(data));
    },
    [data, onNodeChange]
  );

  const findNode = useCallback(
    (nodes: TreeNode[], id: string): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children.length > 0) {
          const found = findNode(node.children, id);
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  const findParent = useCallback(
    (
      nodes: TreeNode[],
      childId: string,
      parent: TreeNode | null = null
    ): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === childId) return parent;
        if (node.children.length > 0) {
          const found = findParent(node.children, childId, node);
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  const removeNode = useCallback(
    (nodes: TreeNode[], id: string): TreeNode[] => {
      return nodes.filter((node) => {
        if (node.id === id) return false;
        if (node.children.length > 0) {
          node.children = removeNode(node.children, id);
        }
        return true;
      });
    },
    []
  );

  const insertNodeAtPosition = useCallback(
    (
      nodes: TreeNode[],
      targetId: string,
      newNode: TreeNode,
      position: "before" | "after" | "inside"
    ): TreeNode[] => {
      return nodes.reduce((acc: TreeNode[], node) => {
        if (node.id === targetId) {
          if (position === "before") {
            acc.push({ ...newNode, parentId: node.parentId });
            acc.push(node);
          } else if (position === "after") {
            acc.push(node);
            acc.push({ ...newNode, parentId: node.parentId });
          } else if (position === "inside") {
            acc.push({
              ...node,
              children: [...node.children, { ...newNode, parentId: node.id }],
            });
          }
        } else {
          if (node.children.length > 0) {
            acc.push({
              ...node,
              children: insertNodeAtPosition(
                node.children,
                targetId,
                newNode,
                position
              ),
            });
          } else {
            acc.push(node);
          }
        }
        return acc;
      }, []);
    },
    []
  );

  const handleDragStart = useCallback((_event: DragStartEvent) => {
    // Drag start is handled by individual nodes
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setDraggedNodeId(null);
      setDropTarget(null);

      if (!over || !dropTarget) return;

      const draggedId = active.id as string;
      const targetId = dropTarget.nodeId;
      const position = dropTarget.position;

      if (draggedId === targetId) return;

      // Prevent dropping on itself or its children
      const draggedNode = findNode(data, draggedId);
      if (!draggedNode) return;

      const isDescendant = (parentId: string, childId: string): boolean => {
        const parent = findNode(data, parentId);
        if (!parent) return false;
        for (const child of parent.children) {
          if (child.id === childId || isDescendant(child.id, childId))
            return true;
        }
        return false;
      };

      if (isDescendant(draggedId, targetId)) return;

      // Remove the dragged node from its current location
      const dataWithoutDragged = removeNode(data, draggedId);

      // Insert the dragged node at the new position
      const newData = insertNodeAtPosition(
        dataWithoutDragged,
        targetId,
        {
          ...draggedNode,
          parentId: position === "inside" ? targetId : undefined,
        },
        position
      );

      onNodeChange(newData);
    },
    [data, dropTarget, findNode, removeNode, insertNodeAtPosition, onNodeChange]
  );

  const handleDragOverChange = useCallback(
    (nodeId: string, position: "before" | "after" | "inside" | null) => {
      if (position) {
        setDropTarget({ nodeId, position });
      } else {
        setDropTarget(null);
      }
    },
    []
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) {
        setDropTarget(null);
        return;
      }

      const draggedId = active.id as string;
      const targetId = over.id as string;

      if (draggedId === targetId) {
        setDropTarget(null);
        return;
      }

      // Prevent dropping on itself or its children
      const draggedNode = findNode(data, draggedId);
      if (!draggedNode) {
        setDropTarget(null);
        return;
      }

      const isDescendant = (parentId: string, childId: string): boolean => {
        const parent = findNode(data, parentId);
        if (!parent) return false;
        for (const child of parent.children) {
          if (child.id === childId || isDescendant(child.id, childId))
            return true;
        }
        return false;
      };

      if (isDescendant(draggedId, targetId)) {
        setDropTarget(null);
        return;
      }

      // Keep the current drop target if it exists, otherwise default to inside
      if (!dropTarget || dropTarget.nodeId !== targetId) {
        setDropTarget({ nodeId: targetId, position: "inside" });
      }
    },
    [data, findNode, dropTarget]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="tree-view">
        {data.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            level={0}
            onToggle={handleToggle}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onEdit={handleEdit}
            isDragged={draggedNodeId === node.id}
            dragOverPosition={
              dropTarget && dropTarget.nodeId === node.id
                ? dropTarget.position
                : null
            }
            onDragOverChange={handleDragOverChange}
          />
        ))}
      </div>
    </DndContext>
  );
};
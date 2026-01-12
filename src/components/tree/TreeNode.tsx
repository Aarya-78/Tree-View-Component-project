import React, { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Plus, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import type { TreeNodeProps } from "../../types/tree";
import "./TreeNode.css";

export const TreeNodeComponent: React.FC<
  TreeNodeProps & {
    isDragged?: boolean;
    dragOverPosition?: "before" | "after" | "inside" | null;
    onDragOverChange?: (
      nodeId: string,
      position: "before" | "after" | "inside" | null
    ) => void;
  }
> = ({
  node,
  level,
  onToggle,
  onAdd,
  onRemove,
  onEdit,
  isDragged = false,
  dragOverPosition = null,
  onDragOverChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: node.id,
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: node.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(node.name);
  };

  const handleEditSubmit = () => {
    if (editValue.trim() && editValue.trim() !== node.name) {
      onEdit(node.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditValue(node.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  const hasChildren = node.children.length > 0;
  const isExpanded = node.isExpanded || false;
  const isLoading = node.isLoading || false;

  const handleMouseEnter = (position: "before" | "after" | "inside") => {
    if (onDragOverChange) {
      onDragOverChange(node.id, position);
    }
  };

  const handleMouseLeave = () => {
    if (onDragOverChange) {
      onDragOverChange(node.id, null);
    }
  };

  return (
    <div className={`tree-node ${isDragging ? "dragging" : ""}`}>
      {/* Drop zone before */}
      <div
        className={`tree-node-drop-zone tree-node-drop-before ${
          dragOverPosition === "before" ? "active" : ""
        }`}
        onMouseEnter={() => handleMouseEnter("before")}
      />

      <div
        ref={(node) => {
          setDragRef(node);
          setDropRef(node);
        }}
        className={`tree-node-content ${
          isOver || dragOverPosition === "inside" ? "drop-target" : ""
        }`}
        style={{
          paddingLeft: `${level * 20}px`,
          ...style,
        }}
        onMouseEnter={() => handleMouseEnter("inside")}
        onMouseLeave={handleMouseLeave}
        {...listeners}
        {...attributes}
      >
        {/* Expand/Collapse Icon */}
        <div className="tree-node-icon" onClick={() => onToggle(node.id)}>
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )
          ) : (
            <span className="spacer"> </span>
          )}
        </div>

        {/* Node Content */}
        <div className="tree-node-text" onDoubleClick={handleDoubleClick}>
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={handleKeyDown}
              autoFocus
              className="tree-node-edit-input"
            />
          ) : (
            <span>{node.name}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="tree-node-actions">
          <button
            className="tree-node-action-btn"
            onClick={() => onAdd(node.id)}
            title="Add child"
          >
            <Plus size={14} />
          </button>
          <button
            className="tree-node-action-btn delete"
            onClick={() => onRemove(node.id)}
            title="Delete node"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Loading Indicator */}
        {isLoading && <div className="tree-node-loading">Loading...</div>}
      </div>

      {/* Drop zone after */}
      <div
        className={`tree-node-drop-zone tree-node-drop-after ${
          dragOverPosition === "after" ? "active" : ""
        }`}
        onMouseEnter={() => handleMouseEnter("after")}
        onMouseLeave={handleMouseLeave}
      />

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="tree-node-children">
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onAdd={onAdd}
              onRemove={onRemove}
              onEdit={onEdit}
              isDragged={isDragged}
              dragOverPosition={null}
              onDragOverChange={onDragOverChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
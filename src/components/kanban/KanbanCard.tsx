import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import type { KanbanCard as KanbanCardType } from "../../types/kanban";
import "./KanbanCard.css";

interface KanbanCardProps {
  card: KanbanCardType;
  onDelete: (cardId: string) => void;
  onEdit: (cardId: string, newTitle: string) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(card.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(card.title);
  };

  const handleEditSubmit = () => {
    if (editValue.trim() && editValue.trim() !== card.title) {
      onEdit(card.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditValue(card.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this card?")) {
      onDelete(card.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-card ${isDragging ? "dragging" : ""}`}
      {...attributes}
      {...listeners}
    >
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="kanban-card-edit-input"
        />
      ) : (
        <div className="kanban-card-content" onDoubleClick={handleDoubleClick}>
          <span>{card.title}</span>
          <button
            className="kanban-card-delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
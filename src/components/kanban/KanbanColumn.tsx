import React from "react";
import { useDroppable } from "@dnd-kit/core";
import type { KanbanColumn as KanbanColumnType } from "../../types/kanban";
import { KanbanCard as KanbanCardComponent } from "./KanbanCard";
import "./KanbanColumn.css";

interface KanbanColumnProps {
  column: KanbanColumnType;
  onCardAdd: (columnId: string) => void;
  onCardDelete: (cardId: string) => void;
  onCardEdit: (cardId: string, newTitle: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onCardAdd,
  onCardDelete,
  onCardEdit,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const handleAddCard = () => {
    onCardAdd(column.id);
  };

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${isOver ? "drop-target" : ""}`}
    >
      <div className="kanban-column-header">
        <h3 className="kanban-column-title">{column.title}</h3>
        <span className="kanban-column-count">({column.cards.length})</span>
      </div>

      <div className="kanban-column-cards">
        {column.cards.map((card) => (
          <KanbanCardComponent
            key={card.id}
            card={card}
            onDelete={onCardDelete}
            onEdit={onCardEdit}
          />
        ))}
      </div>

      <button className="kanban-add-card-btn" onClick={handleAddCard}>
        + Add Card
      </button>
    </div>
  );
};
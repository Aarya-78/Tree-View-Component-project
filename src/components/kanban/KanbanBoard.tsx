import React, { useCallback } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type {
  KanbanBoardProps,
  KanbanColumn,
  KanbanCard,
} from "../../types/kanban";
import { KanbanColumn as KanbanColumnComponent } from "./KanbanColumn";
import "./KanbanBoard.css";

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onCardAdd,
  onCardDelete,
  onCardEdit,
  onCardMove,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((_event: DragStartEvent) => {
   
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return;

      const cardId = active.id as string;
      const overId = over.id as string;

    
      let sourceColumn: KanbanColumn | undefined;
      let card: KanbanCard | undefined;

      for (const column of columns) {
        const foundCard = column.cards.find((c) => c.id === cardId);
        if (foundCard) {
          sourceColumn = column;
          card = foundCard;
          break;
        }
      }

      if (!sourceColumn || !card) return;

      // Check if dropped on a column (empty area)
      const targetColumn = columns.find((col) => col.id === overId);
      if (targetColumn) {
        // Dropped on a column - move to end of that column
        if (targetColumn.id !== sourceColumn.id) {
          const maxOrder = Math.max(
            ...targetColumn.cards.map((c) => c.order),
            0
          );
          onCardMove(cardId, sourceColumn.id, targetColumn.id, maxOrder + 1);
        }
        return;
      }

      // Check if dropped on another card
      let targetColumnForCard: KanbanColumn | undefined;
      let targetCard: KanbanCard | undefined;

      for (const column of columns) {
        const foundCard = column.cards.find((c) => c.id === overId);
        if (foundCard) {
          targetColumnForCard = column;
          targetCard = foundCard;
          break;
        }
      }

      if (targetColumnForCard && targetCard) {
        if (targetColumnForCard.id === sourceColumn.id) {
          // Same column - reorder
          const sourceCards = sourceColumn.cards.filter((c) => c.id !== cardId);
          const targetIndex = sourceCards.findIndex(
            (c) => c.id === targetCard.id
          );
          sourceCards.splice(targetIndex, 0, card);

          // Update orders
          sourceCards.forEach((c, index) => {
            if (c.id !== cardId) {
              onCardMove(c.id, sourceColumn!.id, sourceColumn!.id, index + 1);
            }
          });
          onCardMove(cardId, sourceColumn.id, sourceColumn.id, targetIndex + 1);
        } else {
          // Different column - move card
          const targetCards = targetColumnForCard.cards.filter(
            (c) => c.id !== cardId
          );
          const targetIndex = targetCards.findIndex(
            (c) => c.id === targetCard.id
          );
          targetCards.splice(targetIndex, 0, card);

          // Update orders in target column
          targetCards.forEach((c, index) => {
            onCardMove(
              c.id,
              targetColumnForCard!.id,
              targetColumnForCard!.id,
              index + 1
            );
          });
          onCardMove(
            cardId,
            sourceColumn.id,
            targetColumnForCard.id,
            targetIndex + 1
          );
        }
      }
    },
    [columns, onCardMove]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {columns.map((column) => (
          <SortableContext
            key={column.id}
            items={column.cards.map((card) => card.id)}
            strategy={verticalListSortingStrategy}
          >
            <KanbanColumnComponent
              column={column}
              onCardAdd={onCardAdd}
              onCardDelete={onCardDelete}
              onCardEdit={onCardEdit}
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
};
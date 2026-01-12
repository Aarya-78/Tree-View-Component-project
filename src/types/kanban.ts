export interface KanbanCard {
  id: string;
  title: string;
  columnId: string;
  order: number;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  onCardAdd: (columnId: string) => void;
  onCardDelete: (cardId: string) => void;
  onCardEdit: (cardId: string, newTitle: string) => void;
  onCardMove: (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    newOrder: number
  ) => void;
}

import { useState } from "react";
import { TreeView } from "./components/tree";
import { KanbanBoard } from "./components/kanban";
import type { TreeNode } from "./types/tree";
import type { KanbanColumn, KanbanCard } from "./types/kanban";
import "./App.css";

// Mock data for Tree View
const initialTreeData: TreeNode[] = [
  {
    id: "root-1",
    name: "Root Node 1",
    children: [],
  },
  {
    id: "root-2",
    name: "Root Node 2",
    children: [],
  },
];

// Mock data for Kanban Board
const initialKanbanData: KanbanColumn[] = [
  {
    id: "todo",
    title: "Todo",
    cards: [
      {
        id: "card-1",
        title: "Design homepage mockup",
        columnId: "todo",
        order: 1,
      },
      {
        id: "card-2",
        title: "Set up project repository",
        columnId: "todo",
        order: 2,
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    cards: [
      {
        id: "card-3",
        title: "Implement user authentication",
        columnId: "in-progress",
        order: 1,
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [
      {
        id: "card-4",
        title: "Create project structure",
        columnId: "done",
        order: 1,
      },
      {
        id: "card-5",
        title: "Set up development environment",
        columnId: "done",
        order: 2,
      },
    ],
  },
];

function App() {
  const [treeData, setTreeData] = useState<TreeNode[]>(initialTreeData);
  const [kanbanData, setKanbanData] =
    useState<KanbanColumn[]>(initialKanbanData);

  // Tree handlers
  const handleTreeNodeChange = (newData: TreeNode[]) => {
    setTreeData(newData);
  };

  // Kanban handlers
  const handleCardAdd = (columnId: string) => {
    const cardTitle = prompt("Enter card title:");
    if (!cardTitle?.trim()) return;

    setKanbanData((prevData) =>
      prevData.map((column) => {
        if (column.id === columnId) {
          const maxOrder = Math.max(...column.cards.map((c) => c.order), 0);
          const newCard: KanbanCard = {
            id: `card-${Date.now()}`,
            title: cardTitle.trim(),
            columnId,
            order: maxOrder + 1,
          };
          return {
            ...column,
            cards: [...column.cards, newCard],
          };
        }
        return column;
      })
    );
  };

  const handleCardDelete = (cardId: string) => {
    setKanbanData((prevData) =>
      prevData.map((column) => ({
        ...column,
        cards: column.cards.filter((card) => card.id !== cardId),
      }))
    );
  };

  const handleCardEdit = (cardId: string, newTitle: string) => {
    setKanbanData((prevData) =>
      prevData.map((column) => ({
        ...column,
        cards: column.cards.map((card) =>
          card.id === cardId ? { ...card, title: newTitle } : card
        ),
      }))
    );
  };

  const handleCardMove = (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    newOrder: number
  ) => {
    setKanbanData((prevData) => {
      const newData = [...prevData];

      // Find and remove card from source column
      const sourceColumn = newData.find((col) => col.id === sourceColumnId);
      const targetColumn = newData.find((col) => col.id === targetColumnId);

      if (!sourceColumn || !targetColumn) return prevData;

      const cardIndex = sourceColumn.cards.findIndex(
        (card) => card.id === cardId
      );
      if (cardIndex === -1) return prevData;

      const [movedCard] = sourceColumn.cards.splice(cardIndex, 1);

      // Add card to target column at new position
      movedCard.columnId = targetColumnId;
      movedCard.order = newOrder;

      // Insert at correct position
      const insertIndex = targetColumn.cards.findIndex(
        (card) => card.order >= newOrder
      );
      if (insertIndex === -1) {
        targetColumn.cards.push(movedCard);
      } else {
        targetColumn.cards.splice(insertIndex, 0, movedCard);
      }

      // Reorder cards in target column
      targetColumn.cards.forEach((card, index) => {
        card.order = index + 1;
      });

      return newData;
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tree View & Kanban Board Demo</h1>
        <p>Front-End Developer Test Implementation</p>
      </header>

      <main className="app-main">
        <section className="demo-section">
          <h2>Tree View Component</h2>
          
          <TreeView data={treeData} onNodeChange={handleTreeNodeChange} />
        </section>

        <section className="demo-section">
          <h2>Kanban Board Component</h2>
          
          <KanbanBoard
            columns={kanbanData}
            onCardAdd={handleCardAdd}
            onCardDelete={handleCardDelete}
            onCardEdit={handleCardEdit}
            onCardMove={handleCardMove}
          />
        </section>
      </main>
    </div>
  );
}

export default App;

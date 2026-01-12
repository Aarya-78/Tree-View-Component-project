# Tree View & Kanban Board Demo

A comprehensive React + TypeScript implementation of two interactive components: a Tree View and a Kanban Board, built as part of a front-end developer test.

## Features

### Tree View Component

- ✅ Expand/collapse nodes with chevron icons
- ✅ Add new child nodes with plus icon and input prompts
- ✅ Remove nodes with trash icon and confirmation dialogs
- ✅ Full drag & drop support (move nodes anywhere in the tree)
- ✅ Visual drop indicators (before/after/inside positions)
- ✅ Lazy loading with simulated API calls
- ✅ Inline editing on double-click
- ✅ Hierarchical tree structure with clean UI

### Kanban Board Component

- ✅ Three default columns: Todo, In Progress, Done
- ✅ Add new cards to any column
- ✅ Delete cards with X icon and confirmation
- ✅ Drag & drop cards between columns
- ✅ Inline editing of card titles
- ✅ Responsive layout (stacks vertically on mobile)
- ✅ Clean, modern UI with hover effects

## Technical Implementation

- **React 19** with TypeScript
- **@dnd-kit** for drag & drop functionality
- Component-based architecture with clean separation of concerns
- Mock API simulation for lazy loading
- Responsive CSS with mobile-first design
- TypeScript interfaces for type safety

## Project Structure

```
src/
├── components/
│   ├── tree/
│   │   ├── index.ts                     # Tree component exports
│   │   ├── TreeView.tsx & TreeView.css  # Tree view container
│   │   └── TreeNode.tsx & TreeNode.css  # Individual tree nodes
│   └── kanban/
│       ├── index.ts                     # Kanban component exports
│       ├── KanbanBoard.tsx & KanbanBoard.css # Kanban board container
│       ├── KanbanColumn.tsx & KanbanColumn.css # Kanban columns
│       └── KanbanCard.tsx & KanbanCard.css # Kanban cards
├── types/
│   ├── tree.ts                          # Tree component types
│   └── kanban.ts                        # Kanban component types
├── utils/
│   └── mockApi.ts                       # Mock API for lazy loading
├── App.tsx & App.css                    # Main app with demo data
└── main.tsx                            # App entry point
```

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (current version may work but shows warnings)
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Icons

This project uses [Lucide React](https://lucide.dev/) for icons. Install it separately:

```bash
npm install lucide-react
# or
yarn add lucide-react
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Usage

The app demonstrates both components with mock data:

- **Tree View**: Click the expand icons to load children lazily, double-click to edit, use the + and × buttons to add/remove nodes, drag and drop nodes to reorganize the tree structure
- **Kanban Board**: Drag cards between columns, double-click to edit titles, use "Add Card" buttons to create new cards

## Component APIs

### TreeView Props

```typescript
interface TreeViewProps {
  data: TreeNode[];
  onNodeChange: (nodes: TreeNode[]) => void;
}
```

### KanbanBoard Props

```typescript
interface KanbanBoardProps {
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
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **@dnd-kit/core & @dnd-kit/sortable** - Drag & drop functionality
- **lucide-react** - Icon library
- **CSS** - Component styling

## Browser Support

- Modern browsers with ES6+ support
- Mobile responsive design

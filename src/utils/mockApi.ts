// Mock API for simulating lazy loading of tree nodes
export const mockApi = {
  loadChildren: async (parentId: string): Promise<any[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate mock children based on parent ID
    const childrenCount = Math.floor(Math.random() * 4) + 1; // 1-4 children
    const children = [];

    for (let i = 0; i < childrenCount; i++) {
      children.push({
        id: `${parentId}-child-${i}`,
        name: `Child ${i + 1} of ${parentId.split("-").pop()}`,
        children: [], // Will be loaded lazily
        parentId,
      });
    }

    return children;
  },
};

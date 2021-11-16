export interface PriorityList<T> {
  size: number;
  items: T[];
}

export const $PriorityList = {
  create: <T>(items: T[], size: number): PriorityList<T> => ({
    items,
    size,
  }),

  prioritize: <T>(list: PriorityList<T>, item: T): PriorityList<T> => {
    const itemsWithoutItem = list.items.filter((other) => other !== item);
    const itemsWithItemFirst = [item, ...itemsWithoutItem];
    const itemsWithClampedSize = itemsWithItemFirst.slice(0, list.size);
    return {
      size: list.size,
      items: itemsWithClampedSize,
    };
  },

  remove: <T>(list: PriorityList<T>, item: T): PriorityList<T> => {
    const itemsWithoutItem = list.items.filter((other) => other !== item);
    return {
      size: list.size,
      items: itemsWithoutItem,
    };
  },
};

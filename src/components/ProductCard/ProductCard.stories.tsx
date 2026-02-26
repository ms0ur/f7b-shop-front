import preview from '~/.storybook/preview';

import { ProductCard } from '.';

const meta = preview.meta({
  component: ProductCard,
});

export const Primary = meta.story({
  args: {
    product: {
      id: "1",
      name: "Тестовый товар",
      description: "Описание товара",
      actualPrice: 1500,
      previousPrice: 2000,
    }
  },
});
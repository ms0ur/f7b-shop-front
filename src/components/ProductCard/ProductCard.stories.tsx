import preview from '~/.storybook/preview';

import { ProductCard } from '.';

const meta = preview.meta({
  component: ProductCard,
});

export const Primary = meta.story({
  args: {
    primary: true,
    label: 'ProductCard',
  },
});
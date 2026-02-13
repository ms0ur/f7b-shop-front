import preview from '~/.storybook/preview';

import { PriceTag } from '.';

const meta = preview.meta({
  component: PriceTag,
});

export const Primary = meta.story({
  args: {
    primary: true,
    label: "PriceTag",
    isSale: false,
    actualPrice: 200
  },
});

export const PriceTagSale = meta.story({
  args: {
    primary: true,
    label: "PriceTag - sale",
    isSale: true,
    actualPrice: 150,
    oldPrice: 200
  }
});
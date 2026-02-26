import preview from '~/.storybook/preview';
import { Navbar } from './Navbar';


const meta = preview.meta({
    component: Navbar,
});

export const Primary = meta.story({
    args: {
        primary: true,
        label: 'ProductCard',
    }
})
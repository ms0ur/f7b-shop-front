import preview from '~/.storybook/preview';
import { SearchInput } from './SearchInput';

const meta = preview.meta({
    component: SearchInput,
});

export const Default = meta.story({
    args: {
        value: '',
        placeholder: 'Поиск...',
    },
});

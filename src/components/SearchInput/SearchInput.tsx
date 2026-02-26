import { Search } from 'lucide-react'
import styles from './SearchInput.module.scss'

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const SearchInput = ({ value, onChange, placeholder = 'Поиск...' }: SearchInputProps) => {
    return (
        <div className={styles.searchContainer}>
            <Search className={styles.icon} size={20} />
            <input
                type="text"
                className={styles.input}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    )
}

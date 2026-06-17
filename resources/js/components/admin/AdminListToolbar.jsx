import { Search } from 'lucide-react';

export default function AdminListToolbar({
    children,
    count,
    countLabel = 'items',
    onSearchChange,
    placeholder = 'Search archive...',
    searchValue,
}) {
    return (
        <div className="admin-list-toolbar">
            <label className="admin-search-field">
                <Search size={18} aria-hidden="true" />
                <input
                    type="search"
                    value={searchValue}
                    onChange={(event) => onSearchChange?.(event.target.value)}
                    placeholder={placeholder}
                />
            </label>
            <div className="admin-list-toolbar-meta">
                <span>
                    {count} {countLabel}
                </span>
                {children}
            </div>
        </div>
    );
}

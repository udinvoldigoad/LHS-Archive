import { ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminOrderField({ label = 'Sort Order', name = 'sort_order', onChange, value }) {
    const numericValue = Number(value || 0);

    function updateOrder(nextValue) {
        onChange?.({
            target: {
                name,
                value: String(Math.max(0, nextValue)),
            },
        });
    }

    return (
        <div className="admin-order-field">
            <label>
                {label}
                <input
                    name={name}
                    type="number"
                    min="0"
                    value={value}
                    onChange={onChange}
                />
            </label>
            <div className="admin-order-buttons" aria-label={`${label} controls`}>
                <button type="button" title="Move earlier" onClick={() => updateOrder(numericValue - 1)}>
                    <ChevronUp size={17} aria-hidden="true" />
                </button>
                <button type="button" title="Move later" onClick={() => updateOrder(numericValue + 1)}>
                    <ChevronDown size={17} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

export default function EmptyArchiveState({ children, title }) {
    return (
        <div className="empty-archive-state">
            <h3>{title}</h3>
            <p>{children}</p>
        </div>
    );
}

export default function SectionHeader({ eyebrow, title, children }) {
    return (
        <div className="section-header">
            {eyebrow ? <p className="archive-kicker">{eyebrow}</p> : null}
            <h2>{title}</h2>
            {children ? <p>{children}</p> : null}
        </div>
    );
}

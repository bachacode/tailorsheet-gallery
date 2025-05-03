export default function HeadingBig({ title, description }: { title: string; description?: string }) {
    return (
        <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>
    );
}

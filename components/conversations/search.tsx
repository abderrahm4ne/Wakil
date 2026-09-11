import { Search } from 'lucide-react'

type ConversationSearchProps = {
    value: string
    onChange: (value: string) => void
    placeholder: string
}

export function ConversationSearch({
    value,
    onChange,
    placeholder,
}: ConversationSearchProps) {
    return (
        <div className="p-3 border-b border-border/60">
            <div className="relative">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={15}
                />

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-border bg-background/50 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary/50 transition"
                />
            </div>
        </div>
    )
}
export interface TabControl {
    Goto: (key:TabKey) => void
}

export type TabKey = "import" | "config" | "actors" | "scripts" | "export" | "channel";
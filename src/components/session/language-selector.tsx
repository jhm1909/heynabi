import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '#/components/ui/select'

const sourceLanguages = [
    { value: 'vi', label: '🇻🇳 Tiếng Việt' },
    { value: 'ko', label: '🇰🇷 한국어' },
    { value: 'en', label: '🇺🇸 English' },
    { value: 'zh', label: '🇨🇳 中文' },
    { value: 'ja', label: '🇯🇵 日本語' },
]

const targetLanguages = [
    { value: 'vi', label: '🇻🇳 Tiếng Việt' },
    { value: 'en', label: '🇺🇸 English' },
    { value: 'ko', label: '🇰🇷 한국어' },
    { value: 'zh', label: '🇨🇳 中文' },
    { value: 'ja', label: '🇯🇵 日本語' },
]

interface LanguageSelectorProps {
    sourceValue: string
    targetValue: string
    onSourceChange: (value: string) => void
    onTargetChange: (value: string) => void
    disabled?: boolean
}

export function LanguageSelector({
    sourceValue,
    targetValue,
    onSourceChange,
    onTargetChange,
    disabled,
}: LanguageSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            <Select
                value={sourceValue}
                onValueChange={onSourceChange}
                disabled={disabled}
            >
                <SelectTrigger className="w-36">
                    <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                    {sourceLanguages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <span className="text-muted-foreground">→</span>

            <Select
                value={targetValue}
                onValueChange={onTargetChange}
                disabled={disabled}
            >
                <SelectTrigger className="w-36">
                    <SelectValue placeholder="Target" />
                </SelectTrigger>
                <SelectContent>
                    {targetLanguages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

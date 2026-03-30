export interface Profile {
    id: string
    display_name: string | null
    default_source_lang: string
    default_target_lang: string
    created_at: string
    updated_at: string
}

export interface Session {
    id: string
    user_id: string
    title: string | null
    source_lang: string
    target_lang: string
    audio_source: 'mic' | 'file'
    status: 'active' | 'completed'
    created_at: string
    ended_at: string | null
}

export interface Utterance {
    id: string
    session_id: string
    sequence_num: number
    original_text: string
    translated_text: string | null
    is_final: boolean
    timestamp_ms: number | null
    created_at: string
}

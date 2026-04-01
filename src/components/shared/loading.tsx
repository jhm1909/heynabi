import type { CSSProperties } from 'react'

const RING_COUNT = 12

type LoaderSize = 'sm' | 'md' | 'lg'

export function Loading({
    text = 'Loading...',
    size = 'md',
}: {
    text?: string
    size?: LoaderSize
}) {
    return (
        <div className="loader-3d-wrap">
            <div className={`loader-3d-container ${size === 'md' ? '' : size}`}>
                {Array.from({ length: RING_COUNT }, (_, i) => (
                    <div
                        key={i}
                        className="aro"
                        style={{ '--s': i } as CSSProperties}
                    />
                ))}
            </div>
            {text && <span className="loader-3d-label">{text}</span>}
        </div>
    )
}

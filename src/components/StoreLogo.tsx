import { getStore } from '../data/stores'

export function StoreLogo({ storeId, size = 40 }: { storeId: string; size?: number }) {
  const store = getStore(storeId)
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 4,
        background: store.color,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size * 0.36,
        flexShrink: 0,
      }}
      aria-label={store.name}
      title={store.name}
    >
      {store.initials}
    </div>
  )
}

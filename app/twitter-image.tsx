import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'If Only I Sent This'
export const contentType = 'image/png'
export const size = {
  width: 1200,
  height: 630,
}
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 64,
          fontWeight: 'bold',
          textAlign: 'center',
          padding: 40,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 20 }}>💌</div>
        <div>If Only I Sent This</div>
        <div style={{ fontSize: 32, marginTop: 20, opacity: 0.8 }}>
          A space for unsent memories
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 
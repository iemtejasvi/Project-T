import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'If Only I Sent This'
export const contentType = 'image/png'
export const size = {
  width: 1200,
  height: 630,
}
 
export default async function Image() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            background: '#667eea',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 48,
            fontWeight: 'bold',
            textAlign: 'center',
            padding: 40,
          }}
        >
          <div>If Only I Sent This</div>
          <div style={{ fontSize: 24, marginTop: 20, opacity: 0.8 }}>
            A space for unsent memories
          </div>
        </div>
      ),
      {
        ...size,
      }
    )
  } catch (error) {
    console.error('Error generating Open Graph image:', error)
    return new Response('Error generating image', { status: 500 })
  }
} 
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ontools - 당신의 스마트한 일상 도구'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0f1a',
          position: 'relative',
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 40%, rgba(102,126,234,0.15) 0%, transparent 60%)',
            display: 'flex',
          }}
        />
        {/* Mascot */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://ontools.co.kr/mascot.png"
          width={130}
          height={130}
          style={{ borderRadius: '50%', marginBottom: 20 }}
          alt=""
        />
        {/* Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          ontools
        </div>
        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 16,
          }}
        >
          당신의 스마트한 일상 도구
        </div>
        {/* Bottom tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 18,
            color: 'rgba(255,255,255,0.3)',
            display: 'flex',
          }}
        >
          ontools.co.kr
        </div>
      </div>
    ),
    { ...size }
  )
}

import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const alt = 'ontools - 당신의 스마트한 일상 도구'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const background = (await readFile(join(process.cwd(), 'public/tools-bg.png'))).toString('base64')
  const mascot = (await readFile(join(process.cwd(), 'public/mascot.png'))).toString('base64')
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
          backgroundColor: '#FBF3EC',
          position: 'relative',
        }}
      >
        {/* 풀블리드 히어로 배경 (고급 에디토리얼) */}
        <img
          src={`data:image/png;base64,${background}`}
          width={1200}
          height={630}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          alt=""
        />
        {/* 가독성 확보용 밝은 오버레이 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(180deg, rgba(255,250,245,0.35) 0%, rgba(255,250,245,0.82) 100%)',
            display: 'flex',
          }}
        />
        {/* Mascot */}
        <img
          src={`data:image/png;base64,${mascot}`}
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
            color: '#241a33',
            letterSpacing: 0,
            lineHeight: 1,
          }}
        >
          ontools
        </div>
        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: '#6b6276',
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
            color: '#a09aac',
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

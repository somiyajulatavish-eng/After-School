import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'After School: streetwear, football merch and 3D printed toys';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: '#F3F4EE',
          color: '#131C5E',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, fontWeight: 600 }}>Clothing / Football merch / 3D printed</div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 168, fontWeight: 900, lineHeight: 0.9, letterSpacing: -6, textTransform: 'uppercase' }}>
          <span>After</span>
          <span style={{ borderBottom: '14px solid #E2412E', alignSelf: 'flex-start' }}>School</span>
        </div>
        <div style={{ display: 'flex', fontSize: 30 }}>For the hours after the bell.</div>
      </div>
    ),
    size,
  );
}

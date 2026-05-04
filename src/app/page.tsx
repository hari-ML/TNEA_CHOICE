'use client';

export default function Home() {
  return (
    <div style={{ 
      backgroundColor: '#0B1120', 
      color: 'white', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1>EDU CHOICE - System Test</h1>
      <p>If you see this, the build is finally working!</p>
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #1e293b', borderRadius: '8px' }}>
        Status: Build Successful ✅
      </div>
    </div>
  );
}

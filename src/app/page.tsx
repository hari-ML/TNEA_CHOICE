'use client';

import { useState, useEffect, useCallback } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

type College = {
  id: number;
  name: string;
  district: string;
  branch: string;
  category: string;
  cutoff: number;
  nirf_ranking: number;
  cutoff_change: number;
  placements: {
    average: number;
    median: number;
    highest: number;
  };
  website: string;
};

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState<College[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [cutoff, setCutoff] = useState('');
  const [year, setYear] = useState('2025');
  const [category, setCategory] = useState('All');
  const [district, setDistrict] = useState('All');
  const [branch, setBranch] = useState('All');

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        cutoff: cutoff || '200',
        category,
        district: district || 'All',
        branch: branch || 'All',
      });
      const res = await fetch(`/api/colleges?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setColleges(data);
      }
    } catch (error) {
      console.error('Failed to fetch colleges:', error);
    } finally {
      setLoading(false);
    }
  }, [search, cutoff, category, district, branch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchColleges();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchColleges]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toggleCompare = (college: College) => {
    setCompareList(prev => {
      const exists = prev.find(c => c.id === college.id);
      if (exists) return prev.filter(c => c.id !== college.id);
      if (prev.length >= 2) return prev; // max 2
      return [...prev, college];
    });
  };

  const isSelected = (id: number) => compareList.some(c => c.id === id);

  const categories = ['All', 'OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST'];
  const districtsList = [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode',
    'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
    'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet',
    'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
    'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
  ];

  const branchesList = [
    'Aeronautical Engineering', 'Agriculture Engineering', 'Artificial Intelligence and Data Science',
    'Artificial Intelligence and Machine Learning', 'Automobile Engineering', 'Bio Medical Engineering',
    'Bio Technology', 'Chemical Engineering', 'Civil Engineering', 'Computer Science and Business Systems',
    'Computer Science and Engineering', 'Electrical and Electronics Engineering',
    'Electronics and Communication Engineering', 'Electronics and Instrumentation Engineering',
    'Fashion Technology', 'Food Technology', 'Information Technology', 'Mechanical Engineering',
    'Mechatronics Engineering', 'Petrochemical Engineering', 'Textile Technology'
  ];

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-title">EDUCHOICE</span>
              <span className="logo-subtitle">TNEA 2026 COMING SOON</span>
            </div>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="form-group">
            <label className="form-label">Your Cutoff Mark</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 195.5"
              step="0.5"
              min="0"
              max="200"
              value={cutoff}
              onChange={(e) => setCutoff(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Year</label>
              <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map(cat => <option key={`sel-${cat}`} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="pill-grid">
            {categories.map(cat => (
              <button
                key={cat}
                className={`pill-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label">District</label>
            <input
              className="form-input"
              list="district-list"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              onFocus={(e) => { if (e.target.value === 'All') setDistrict(''); }}
              onBlur={(e) => { if (!e.target.value) setDistrict('All'); }}
              placeholder="Search district..."
            />
            <datalist id="district-list">
              <option value="All">All Districts</option>
              {districtsList.map(dist => <option key={dist} value={dist}>{dist}</option>)}
            </datalist>
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              className="form-input"
              list="branch-list"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              onFocus={(e) => { if (e.target.value === 'All') setBranch(''); }}
              onBlur={(e) => { if (!e.target.value) setBranch('All'); }}
              placeholder="Search branch..."
            />
            <datalist id="branch-list">
              <option value="All">All Departments</option>
              {branchesList.map(b => <option key={b} value={b}>{b}</option>)}
            </datalist>
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper">
        <header className="topbar">
          <div className="search-container">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search colleges by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="header-actions">
            <a href="/contact" className="btn-feedback">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Contact us !
            </a>
            <ThemeToggle />
          </div>
        </header>

        <main className="page-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div className="results-badge" style={{ margin: 0 }}>
              {loading ? '...' : colleges.length} results
            </div>
            {compareList.length > 0 && (
              <button
                onClick={() => setShowCompare(true)}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '0.4rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  animation: 'pulse-glow 2s infinite',
                }}
              >
                ⚖️ Compare ({compareList.length}/2)
                {compareList.length === 2 && ' — Ready!'}
              </button>
            )}
            {compareList.length > 0 && (
              <button
                onClick={() => setCompareList([])}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                ✕ Clear
              </button>
            )}
            {compareList.length < 2 && (
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                ☑ Select up to 2 colleges to compare
              </span>
            )}
          </div>

          {!loading && colleges.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <div className="empty-title">No colleges found</div>
              <div>Try adjusting your filters or search query.</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>College Details</th>
                    <th>Cutoff</th>
                    <th>NIRF Rank</th>
                    <th>Placements</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} style={{ padding: '1.5rem' }}>
                          <div style={{ height: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', width: '100%', animation: 'pulse 1.5s infinite' }}></div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    colleges.map((college) => {
                      const selected = isSelected(college.id);
                      const disabled = !selected && compareList.length >= 2;
                      return (
                        <tr key={college.id} style={{ background: selected ? 'rgba(99,102,241,0.08)' : undefined, transition: 'background 0.2s' }}>
                          <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                            <input
                              type="checkbox"
                              checked={selected}
                              disabled={disabled}
                              onChange={() => toggleCompare(college)}
                              title={disabled ? 'Max 2 colleges for comparison' : selected ? 'Remove from compare' : 'Add to compare'}
                              style={{
                                width: '18px',
                                height: '18px',
                                cursor: disabled ? 'not-allowed' : 'pointer',
                                accentColor: '#6366f1',
                                opacity: disabled ? 0.3 : 1,
                              }}
                            />
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: '1rem', color: selected ? '#a5b4fc' : 'var(--foreground)', marginBottom: '0.25rem' }}>{college.name}</div>
                            <div style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                              <span>📍 {college.district}</span>
                              <span>•</span>
                              <span>{college.branch}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '1.1rem' }}>{college.cutoff}</div>
                              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{college.category}</div>
                              <div>
                                {college.cutoff_change > 0 ? (
                                  <span className="badge badge-danger">↑ {college.cutoff_change}</span>
                                ) : college.cutoff_change < 0 ? (
                                  <span className="badge badge-success">↓ {Math.abs(college.cutoff_change)}</span>
                                ) : (
                                  <span className="badge" style={{ background: 'rgba(255,255,255,0.05)' }}>No Change</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--foreground)' }}>
                              #{college.nirf_ranking}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              <div><span style={{ color: '#64748b' }}>Avg:</span> {formatCurrency(college.placements.average)}</div>
                              <div><span style={{ color: '#64748b' }}>Med:</span> {formatCurrency(college.placements.median)}</div>
                              <div style={{ fontWeight: 600, color: 'var(--success)' }}><span style={{ color: '#64748b', fontWeight: 400 }}>High:</span> {formatCurrency(college.placements.highest)}</div>
                            </div>
                          </td>
                          <td>
                            <a href={college.website} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                              Visit
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '0.25rem' }}>
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Compare Modal */}
      {showCompare && compareList.length === 2 && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          backdropFilter: 'blur(4px)',
        }}
          onClick={() => setShowCompare(false)}
        >
          <div style={{
            background: '#0f172a', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px',
            padding: '2rem', maxWidth: '860px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 700 }}>⚖️ College Comparison</h2>
              <button onClick={() => setShowCompare(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ background: '#1e293b', padding: '1rem', fontWeight: 600, color: '#64748b' }}></div>
              {compareList.map((c, i) => (
                <div key={i} style={{ background: '#1e293b', padding: '1rem', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontWeight: 700, color: '#a5b4fc', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{c.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.branch}</div>
                </div>
              ))}

              {/* Rows */}
              {[
                { label: '📍 District', fn: (c: College) => c.district },
                { label: '🎯 Cutoff', fn: (c: College) => <strong style={{ color: '#6366f1' }}>{c.cutoff}</strong> },
                { label: '📈 Trend', fn: (c: College) => c.cutoff_change > 0 ? <span style={{ color: '#f87171' }}>↑ +{c.cutoff_change}</span> : c.cutoff_change < 0 ? <span style={{ color: '#4ade80' }}>↓ {c.cutoff_change}</span> : <span style={{ color: '#94a3b8' }}>No Change</span> },
                { label: '🏆 NIRF Rank', fn: (c: College) => <strong>#{c.nirf_ranking}</strong> },
                { label: '💰 Avg Package', fn: (c: College) => formatCurrency(c.placements.average) },
                { label: '💰 Median Pkg', fn: (c: College) => formatCurrency(c.placements.median) },
                { label: '🚀 Highest Pkg', fn: (c: College) => <strong style={{ color: '#4ade80' }}>{formatCurrency(c.placements.highest)}</strong> },
                { label: '🏷️ Category', fn: (c: College) => c.category },
              ].map((row, ri) => (
                <>
                  <div key={`lbl-${ri}`} style={{ background: ri % 2 === 0 ? '#0f172a' : '#111827', padding: '0.85rem 1rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>{row.label}</div>
                  {compareList.map((c, ci) => (
                    <div key={`val-${ri}-${ci}`} style={{ background: ri % 2 === 0 ? '#0f172a' : '#111827', padding: '0.85rem 1rem', color: 'white', fontSize: '0.9rem', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                      {row.fn(c) as React.ReactNode}
                    </div>
                  ))}
                </>
              ))}
            </div>

            {/* Visit buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
              {compareList.map((c, i) => (
                <a key={i} href={c.website} target="_blank" rel="noopener noreferrer"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', textDecoration: 'none', padding: '0.75rem', borderRadius: '10px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
                  Visit {c.name.split(' ').slice(0, 3).join(' ')}... →
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
        }
      `}</style>
    </div>
  );
}

import { NextResponse } from 'next/server';
import colleges from '@/data/colleges.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const search = searchParams.get('search')?.toLowerCase() || '';
  const cutoff = parseFloat(searchParams.get('cutoff') || '200');
  const category = searchParams.get('category') || 'All';
  const district = searchParams.get('district') || 'All';
  const branch = searchParams.get('branch') || 'All';

  let filteredColleges = colleges;

  if (search) {
    filteredColleges = filteredColleges.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.district.toLowerCase().includes(search) ||
        c.branch.toLowerCase().includes(search)
    );
  }

  if (district !== 'All') {
    filteredColleges = filteredColleges.filter((c) => c.district === district);
  }

  if (branch !== 'All') {
    filteredColleges = filteredColleges.filter((c) => c.branch === branch);
  }

  if (category !== 'All') {
    filteredColleges = filteredColleges.filter((c) => c.category === category);
  }

  // Filter based on cutoff: the college cutoff should be less than or equal to the student's cutoff
  filteredColleges = filteredColleges.filter((c) => (c.cutoff ?? 0) <= cutoff);


  // Sort by highest cutoff match, then by NIRF ranking
  filteredColleges.sort((a, b) => {
    // Difference between student cutoff and college cutoff (smaller is better match)
    const diffA = cutoff - a.cutoff;
    const diffB = cutoff - b.cutoff;

    if (diffA !== diffB) {
      return diffA - diffB;
    }

    // Secondary sort by NIRF ranking (lower is better)
    return a.nirf_ranking - b.nirf_ranking;
  });

  return NextResponse.json(filteredColleges, {
    headers: {
      // 1 hour cache max-age, stale-while-revalidate for fast responses
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

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

  filteredColleges = filteredColleges.filter((c) => (c.cutoff ?? 0) <= cutoff);

  filteredColleges.sort((a, b) => {
    const diffA = cutoff - (a.cutoff ?? 0);
    const diffB = cutoff - (b.cutoff ?? 0);
    if (diffA !== diffB) return diffA - diffB;
    return (a.nirf_ranking ?? 999) - (b.nirf_ranking ?? 999);
  });

  return NextResponse.json(filteredColleges, {
    headers: {
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

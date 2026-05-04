import { NextRequest, NextResponse } from 'next/server';
import collegesData from '@/data/colleges.json';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const search = searchParams.get('search')?.toLowerCase() || '';
  const cutoff = parseFloat(searchParams.get('cutoff') || '200');
  const category = searchParams.get('category') || 'All';
  const district = searchParams.get('district') || 'All';
  const branch = searchParams.get('branch') || 'All';

  let filteredColleges = [...collegesData];

  // Search filter
  if (search) {
    filteredColleges = filteredColleges.filter(
      (c) => 
        c.name.toLowerCase().includes(search) || 
        c.district.toLowerCase().includes(search) ||
        c.branch.toLowerCase().includes(search)
    );
  }

  // Category filter
  if (category !== 'All') {
    filteredColleges = filteredColleges.filter((c) => c.category === category);
  }

  // District filter
  if (district !== 'All') {
    filteredColleges = filteredColleges.filter((c) => c.district === district);
  }

  // Branch filter
  if (branch !== 'All') {
    filteredColleges = filteredColleges.filter((c) => c.branch === branch);
  }

  // Filter based on cutoff: the college cutoff should be less than or equal to the student's cutoff
  // FIX: Added the ?? 0 safety check to line 37
  filteredColleges = filteredColleges.filter((c) => (c.cutoff ?? 0) <= cutoff);

  // Sort by highest cutoff match, then by NIRF ranking
  filteredColleges.sort((a, b) => {
    if (b.cutoff !== a.cutoff) {
      return (b.cutoff ?? 0) - (a.cutoff ?? 0);
    }
    return (a.nirf_ranking ?? 999) - (b.nirf_ranking ?? 999);
  });

  return NextResponse.json(filteredColleges.slice(0, 50));
}

export async function GET() {
  const prompts = [
    { id: 'SM', label: 'Social Media-Group Discovery', category: 'SM' },
    { id: 'MG', label: 'Marketing', category: 'MG' },
    { id: 'Web', label: 'Website-SEO', category: 'Web' },
    { id: 'Gov', label: 'Calif SOS Info', category: 'Gov' },
    { id: 'ME', label: 'Mentee Template', category: 'ME' },
    { id: 'SAM', label: 'SAM.gov', category: 'SAM' },
    { id: 'GE', label: 'GBP', category: 'GE' },
    { id: 'GSC', label: 'GSC', category: 'GE' },
    { id: 'MT', label: 'Marketing-Comprehensive', category: 'MT' },
    { id: 'Web2', label: 'Website-Design', category: 'Web' },
    { id: 'Web3', label: 'Website-eCommerce', category: 'Web' },
  ];

  return Response.json(prompts);
}
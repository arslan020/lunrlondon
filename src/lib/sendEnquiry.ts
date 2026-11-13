export async function sendEnquiry(body: Record<string, string>) {
  const response = await fetch('/api/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error('Could not send the enquiry')
  }
}

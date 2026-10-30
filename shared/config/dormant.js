// This project is parked. Re-enabling admin operations requires a separate review.
export const LOCAL_HOST = '127.0.0.1';

export async function parkedTokenVerification() {
  return { valid: false, error: 'AUTHENTICATION_PARKED' };
}

export function refuseParkedIdentity() {
  throw new Error('AUTHENTICATION_PARKED');
}

export function denyDormantAdmin(req, res) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      .replace(/\/+/g, '/')
      .toLowerCase();
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'INVALID_REQUEST_PATH' }));
    return true;
  }

  if (pathname !== '/api/scoutbrief/admin' && !pathname.startsWith('/api/scoutbrief/admin/')) {
    return false;
  }

  res.writeHead(503, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify({ error: 'DORMANT_ADMIN_DISABLED' }));
  return true;
}

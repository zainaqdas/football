import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'en';
  const redirectTo = url.searchParams.get('redirect') || '/';

  // Set language cookie, expires in 1 year
  cookies.set('lang', lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false,
    sameSite: 'lax',
  });

  return redirect(redirectTo, 302);
};

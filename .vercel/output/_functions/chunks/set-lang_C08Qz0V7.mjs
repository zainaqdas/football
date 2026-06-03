const GET = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") || "en";
  const redirectTo = url.searchParams.get("redirect") || "/";
  cookies.set("lang", lang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false,
    sameSite: "lax"
  });
  return redirect(redirectTo, 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

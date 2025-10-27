import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from '@vercel/kv';

const { rewrite: rewriteLLM } = rewritePath('/docs/*path', '/llms.mdx/*path');




const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '24 h'),
  analytics: true,
  prefix: '@upstash/ratelimit',
});

export async function middleware(request: NextRequest) {

  // Handle rate limiting for the code migration API
  if (request.nextUrl.pathname.startsWith('/api/code-migration')) {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';

    const { success, limit, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
        },
      });
    }
  }

  
  if (isMarkdownPreferred(request)) {
    const result = rewriteLLM(request.nextUrl.pathname);

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }

  return NextResponse.next();
}
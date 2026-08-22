import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy request handler for forwarding API calls or microservices if needed.
 */
export async function proxy(req: NextRequest, targetUrl: string) {
  const headers = new Headers(req.headers);
  headers.delete("host");

  const response = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: req.body,
    // @ts-expect-error duplex is required for streaming request bodies in node fetch
    duplex: "half",
  });

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

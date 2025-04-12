import { NextRequest } from "next/server";

// Generic API test utilities
export function createApiRequest(
  path: string,
  params?: Record<string, string>
): NextRequest {
  const baseUrl = `http://localhost${path}`;
  const url = new URL(baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  return new NextRequest(url);
}

export async function expectErrorResponse(
  response: Response,
  status: number,
  errorMessage: string
) {
  expect(response.status).toBe(status);
  const data = await response.json();
  expect(data).toEqual({ error: errorMessage });
}

export async function expectSuccessResponse(
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expectedData: any
) {
  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data).toEqual(expectedData);
}

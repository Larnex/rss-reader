import fetchMock from "jest-fetch-mock";

// Generic fetch mocking utilities
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mockJsonResponse(data: any, status = 200) {
  return fetchMock.mockResponseOnce(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export function mockTextResponse(
  text: string,
  contentType: string,
  status = 200
) {
  return fetchMock.mockResponseOnce(text, {
    status,
    headers: { "content-type": contentType },
  });
}

export function mockHttpError(status = 404, statusText = "Not Found") {
  return fetchMock.mockResponseOnce(statusText, {
    status,
    statusText,
  });
}

export function mockNetworkError(message = "Network error") {
  return fetchMock.mockRejectOnce(new Error(message));
}

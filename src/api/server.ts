export default async function server(
  url: string,
  method: string,
  payload?: any
) {
  // Initializing headers.
  const headers = {
    "Content-Type": "application/json",
  };

  // console.log(url)
  // console.log(method)
  // console.log(payload)

  try {
    const response = await fetch(`${url}`, {
      method: method,
      headers: headers,
      body: payload ? JSON.stringify(payload) : null,
    });

    return [await response.json(), response];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

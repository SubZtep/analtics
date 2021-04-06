export default (url: string, token: string) => async (
  query: string,
  variables?: { [name: string]: string }
) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    if (!res.ok) {
      return { error: res.statusText }
    }

    const { data, errors } = await res.json()
    if (errors) {
      return { data, error: errors[0] }
    }

    return data
  } catch (error) {
    return { error }
  }
}

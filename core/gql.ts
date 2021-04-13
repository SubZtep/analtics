export function gql(url: string, token: string) {
  return async (
    query: string,
    variables?: { [name: string]: string },
  ) => {
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
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const { data, errors } = await res.json();
    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    return data;
  };
}

export const q = gql(
  Deno.env.get("GRAPHQL_URL")!,
  Deno.env.get("GRAPHQL_SECRET")!,
);

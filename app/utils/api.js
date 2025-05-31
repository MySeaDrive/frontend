import useLoadingStore from "../store/loadingStore";

export async function fetchWithAuth(url, options = {}) {
  const setIsLoading = useLoadingStore.getState().setIsLoading;
  setIsLoading(true);

  try {
    // Check if user is authenticated with Replit
    const userResponse = await fetch("/__replauthuser");

    if (!userResponse.ok) {
      throw new Error("No active session");
    }

    const user = await userResponse.json();

    if (!user || !user.id) {
      throw new Error("No active session");
    }

    const headers = {
      "X-Replit-User-Id": user.id,
      "X-Replit-User-Name": user.name,
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (response.status == 404) {
      throw new Error("404");
    }

    if (!response.ok) {
      throw new Error("API request failed");
    }

    return response.json();
  } finally {
    setIsLoading(false);
  }
}

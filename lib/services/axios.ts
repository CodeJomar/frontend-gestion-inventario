import axios, { AxiosInstance } from "axios";
import { getAccessToken, sleep } from "@/lib/utils";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { logoutFromApp } from "@/lib/services/auth";
import { toast } from "sonner";

const supabase = createSupabaseClient();

export async function createApiClient(): Promise<AxiosInstance> {
  const token = await getAccessToken();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json",
    },
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        const config = error.config as any;

        // Initialize retry count if not present
        config.__retryCount = config.__retryCount ?? 0;

        if (config.__retryCount < 2) {
          config.__retryCount += 1;

          // Try refreshing session
          const { data: { session }, error: refreshError } = await supabase.auth.getSession();

          if (!refreshError && session) {
            // Update token and retry
            const headers = config.headers ?? new axios.AxiosHeaders();
            headers.set("Authorization", `Bearer ${session.access_token}`);
            config.headers = headers;

            return api.request(config);
          }
        }

        // If retry limit reached or refresh failed, logout
        await logoutFromApp();
        toast.error("Session expired: Logging out...");
        await sleep(1000);
        if (typeof window !== "undefined") window.location.href = "/login";

        return Promise.reject(new Error("Unauthorized — logged out"));
      } else if (axios.isAxiosError(error)) {
        // toast.warning(error.message)
      }

      return Promise.reject(error);
    }
  );

  return api;
}


/**
 * Example helper to make requests directly without re-creating the client:
 */
export async function apiGet<T = any>(url: string): Promise<T> {
  const api = await createApiClient();
  const { data } = await api.get<T>(url);
  return data;
}

export async function apiPost<T = any>(url: string, body: any): Promise<T> {
  const api = await createApiClient();
  const { data } = await api.post<T>(url, body);
  return data;
}

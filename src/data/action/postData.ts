import { BASE_URL } from "@/config/baseURL";

const postData = async ({ data }: { data: Record<string, unknown> }) => {
  console.log(data);
  const response = await fetch(`${BASE_URL}/api/menu-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add menu item.");
  }

  return result;
};

export default postData;

import { BASE_URL } from "@/config/baseURL";

type MenuItemApiResult = {
  ok: true;
  message: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function sendMenuItemRequest(
  path: string,
  init: RequestInit,
): Promise<MenuItemApiResult> {
  const response = await fetch(`${BASE_URL}${path}`, init);
  const result: unknown = await response.json();

  if (!isRecord(result) || typeof result.message !== "string") {
    throw new Error("The menu service returned an invalid response.");
  }

  if (!response.ok || result.ok !== true) {
    throw new Error(result.message);
  }

  return {
    ok: true,
    message: result.message,
  };
}

export function updateMenuItem(
  ownerId: string,
  item: {
    id: string;
    itemName: string;
    category: string;
    price: number;
  },
) {
  const query = `ownerId=${encodeURIComponent(ownerId)}`;

  return sendMenuItemRequest(
    `/api/menu-items/${encodeURIComponent(item.id)}?${query}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    },
  );
}

export function setMenuItemAvailability(
  ownerId: string,
  id: string,
  isAvailable: boolean,
) {
  const query = `ownerId=${encodeURIComponent(ownerId)}`;

  return sendMenuItemRequest(
    `/api/menu-items/${encodeURIComponent(id)}/availability?${query}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable }),
    },
  );
}

export function deleteMenuItem(ownerId: string, id: string) {
  const query = `ownerId=${encodeURIComponent(ownerId)}`;

  return sendMenuItemRequest(
    `/api/menu-items/${encodeURIComponent(id)}?${query}`,
    { method: "DELETE" },
  );
}

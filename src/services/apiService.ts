const api_base_url = "http://localhost:5000/api";

export async function createRoom() {
  const response = await fetch(`${api_base_url}/rooms/create`, {})

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

export interface JoinRequest {
  roomId: string;
  name: string;
}

export async function joinRoom(joinRequest: JoinRequest) {
  const response = await fetch(`${api_base_url}/rooms/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(joinRequest),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || response.statusText);
  }

  return data;
}

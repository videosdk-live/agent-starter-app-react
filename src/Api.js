const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;
const AGENT_ID = import.meta.env.VITE_AGENT_ID;
const ENV_MEETING_ID = import.meta.env.VITE_MEETING_ID ?? "";

if (!AUTH_TOKEN) console.error("AUTH_TOKEN is missing");
if (!AGENT_ID) console.error("AGENT_ID is missing");

// Create Meeting
export const createMeeting = async () => {
  try {
    if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN is missing");

    const res = await fetch("https://api.videosdk.live/v2/rooms", {
      method: "POST",
      headers: {
        authorization: AUTH_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("API failed:", res);
      return null;
    }

    const { roomId } = await res.json();
    return roomId;
  } catch (error) {
    console.error("API failed:", error);
    return null;
  }
};

// Verify Meeting
export const verifyMeeting = async (meetingId) => {
  try {
    if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN is missing");

    const response = await fetch(
      `https://api.videosdk.live/v2/rooms/validate/${meetingId}`,
      {
        method: "GET",
        headers: {
          Authorization: AUTH_TOKEN,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error("API failed:", response.status, response.statusText);
      return false;
    }

    const data = await response.json();
    return data?.roomId === meetingId;
  } catch (error) {
    console.error("API failed:", error);
    return false;
  }
};

// Dispatch Agent
export const dispatchAgent = async ({ meetingId }) => {
  return true;
  try {
    if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN is missing");
    if (!AGENT_ID) throw new Error("AGENT_ID is missing");

    const response = await fetch(
      `https://api.videosdk.live/ai/v1/agents/${AGENT_ID}/versions`,
      {
        method: "GET",
        headers: {
          Authorization: AUTH_TOKEN,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error("API failed:", response.status);
      return false;
    }

    const versionsData = await response.json();

    const versionId = versionsData?.versions?.[0]?.versionId;

    const body = {
      meetingId,
      agentId: AGENT_ID,
      ...(versionId && {
        versionId,
        versionTag: versionId,
      }),
    };

    // Dispatch agent
    const res = await fetch("https://api.videosdk.live/v2/agent/dispatch", {
      method: "POST",
      headers: {
        Authorization: AUTH_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("API failed:", res.status);
      return false;
    }

    const data = await res.json();
    return data?.data?.success ?? false;
  } catch (error) {
    console.error("API failed:", error);
    return false;
  }
};

export { ENV_MEETING_ID };

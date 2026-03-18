import axios from "axios";

const HA_HOST = process.env.HA_HOST;
const TOKEN = process.env.HA_TOKEN;

export async function prenderSwitch(entityId: string) {
  try {
    await axios.post(
      `http://${HA_HOST}/api/services/switch/turn_on`,
      { entity_id: entityId },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true };

  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function apagarSwitch(entityId: string) {
  try {
    await axios.post(
      `http://${HA_HOST}/api/services/switch/turn_off`,
      { entity_id: entityId },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true };

  } catch (error: any) {
    throw new Error(error.message);
  }
}

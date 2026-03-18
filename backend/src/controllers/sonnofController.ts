import { Request, Response } from "express";
import { prenderSwitch, apagarSwitch } from "../services/homeAssistantService";

export const encenderLuz = async (req: Request, res: Response) => {
  const { entityId } = req.body;

  try {
    const result = await prenderSwitch(entityId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const apagarLuz = async (req: Request, res: Response) => {
  const { entityId } = req.body;

  try {
    const result = await apagarSwitch(entityId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

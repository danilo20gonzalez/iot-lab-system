import { Request, Response } from "express";
import { prenderSwitch, apagarSwitch, obtenerSensores, obtenerSwitches } from "../services/homeAssistantService";

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

export const getSensores = async (req: Request, res: Response) => {
  try {
    const sensores = await obtenerSensores();
    res.json(sensores);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSwitches = async (req: Request, res: Response) => {
  try {
    const switches = await obtenerSwitches();
    res.json(switches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
import { CONSTANTS } from "@/common/constants";
import { format } from "date-fns";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";


const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/drug_monitor_list/`;
    const response = await axios.get(apiUrl);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    res.status(500).json({ error: CONSTANTS.errorMessage.unexpectedError });
  }
};



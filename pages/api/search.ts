import { CONSTANTS } from "@/common/constants";
import { format } from "date-fns";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const queryParam = req.query["values[search]"];
    const startDateString = req.query["filters[start_date]"];
    const endDateString = req.query["filters[end_date]"];
    const page = req.query.PageNumber;

    let apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/pubmed_search/?query=${queryParam}&retmax=10&offset=${page}`;

    if (
      typeof startDateString === "string" &&
      typeof endDateString === "string"
    ) {
      const startDateObject = new Date(startDateString);
      const formattedStartDate = format(startDateObject, "yyyy-MM-dd");
      const endDateObject = new Date(endDateString);
      const formattedEndDate = format(endDateObject, "yyyy-MM-dd");

      apiUrl += `&start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
    }

    const response = await axios.get(apiUrl);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    res.status(500).json({ error: CONSTANTS.errorMessage.unexpectedError });
  }
};

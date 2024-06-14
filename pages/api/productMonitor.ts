import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const formDataInstance = new FormData();
    const monitorName = req.query.monitorname as string;
    const description = req.query.description as string;
    const startDateString = req.query.startDate as string;
    const endDateString = req.query.endDate as string;

    let apiUrl = `${process.env.API_URL}/drug_monitor/?monitorname=${monitorName}&description=${encodeURIComponent(
      description
    )}`;

    // if (
    //   typeof startDateString === "string" &&
    //   typeof endDateString === "string"
    // ) {
    //   const startDateObject = new Date(startDateString);
    //   const formattedStartDate = format(startDateObject, "yyyy-MM-dd");
    //   const endDateObject = new Date(endDateString);
    //   const formattedEndDate = format(endDateObject, "yyyy-MM-dd");

    //   apiUrl += `&start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
    // }

    // if (req.query.selectedResearchUpdate) {
    //   apiUrl += `&schedule_duration=${encodeURIComponent(
    //     req.query.selectedResearchUpdate as string
    //   )}`;
    // }
  
    // if (req.query.selectedReviewTeam) {
    //   apiUrl += `&abstract_team_name=${encodeURIComponent(
    //     req.query.selectedReviewTeam as string
    //   )}`;
    // }
  
    // if (req.query.selectedQCTeam) {
    //   apiUrl += `&qc_team_name=${encodeURIComponent(req.query.selectedQCTeam as string)}`;
    // }

    // Object.entries(req.query.sourceCheckboxes as any).forEach(([key, value]) => {
    //   if (typeof value === "boolean" && value) {
    //     apiUrl += `&${encodeURIComponent(key)}=${encodeURIComponent(
    //       String(value)
    //     )}`;
    //   }
    // });

    if (req.query.serach_data) {
      apiUrl += `&serach_data=${encodeURIComponent(
       req.query.serach_data as string
      )}`;
    }


    const formData = new FormData();
    formData.append("file_name", req.body);
    const config = {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };
    // const response = await axios.request(config);
    console.clear();
    const response = await axios
    .post(apiUrl, formData, config
    )
    res.status(200).json(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", JSON.stringify(error));
      console.error("Stack trace:", error.stack);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

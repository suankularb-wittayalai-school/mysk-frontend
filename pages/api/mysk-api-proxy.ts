import fetchMySKAPI from "@/utils/backend/mysk/fetchMySKAPI";
import { NextApiHandler } from "next";
import qs from "qs";

/**
 * A proxy handler for the MySK API. This is done so to protect the API key from
 * being exposed to the client.
 */
const handler: NextApiHandler = async (req, res) => {
  const { path, query, headers } = req.query;
  const response = await fetchMySKAPI(
    path as string,
    req?.cookies["access_token"],
    {
      query: qs.parse(query as string),
      headers: JSON.parse(headers as string) as HeadersInit,
    },
  );
  res.status(response.status).json(response);
};

export default handler;

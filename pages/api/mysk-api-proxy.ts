import fetchMySKAPI from "@/utils/backend/mysk/fetchMySKAPI";
import { NextApiHandler } from "next";

/**
 * A proxy handler for the MySK API. This is done so to protect the API key from
 * being exposed to the client.
 */
const handler: NextApiHandler = async (req, res) => {
  const { path, options } = req.body;
  const response = await fetchMySKAPI(
    path,
    req?.cookies["access_token"],
    options,
  );
  res.status(response.status).send(response);
};

export default handler;

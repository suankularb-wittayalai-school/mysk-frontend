import fetchMySKAPI from "@/utils/backend/mysk/fetchMySKAPI";
import { NextApiHandler } from "next";
import getRawBody from "raw-body";
import { Readable } from "stream";

/**
 * A proxy handler for the MySK API. This is done so to protect the API key from
 * being exposed to the client.
 */
const handler: NextApiHandler = async (req, res) => {
  const { path = "/" } = req.query;
  const contentType = req.headers["content-type"];
  const rawBody = await getRawBody(req, {
    encoding: contentType === "application/json" ? true : undefined,
  });

  const response = await fetchMySKAPI(
    path as string,
    req?.cookies["access_token"],
    contentType === "application/octet-stream"
      ? // We force the proxy to send a POST request if we detect that the data
        // is in binary
        {
          body: Readable.from(rawBody),
          headers: { "Content-Type": "application/octet-stream" },
          method: "POST",
        }
      : // Else, we just parse the JSON and get the `options` field
        JSON.parse(rawBody.toString()).options,
  );
  res.status(response.status).send(response);
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};

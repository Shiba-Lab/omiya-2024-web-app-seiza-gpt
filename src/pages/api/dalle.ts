import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const prompt = req.query.prompt as string;

  console.log("prompt", prompt);

  if (!prompt) {
    return res.status(400).json({ error: "Missing Body" });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      //  古い絵本に載っているような、「${prompt}」のイラストを生成してください。
      prompt: `白い線、黒い背景、抽象化された「${prompt}」の簡素な星座、シンプル、背景なし、抽象化、1本線、棒人間`,
      n: 1,
      size: "1024x1024", // 1024x1024、1792x1024、1024x1792
    });

    const imageUrl = imageResponse.data[0].url;

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("ERROR OCURED", error);
    return res
      .status(500)
      .json({ error: "An error occurred while proxying the request" });
  }
};

export default handler;

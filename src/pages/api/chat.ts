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
    apiKey: process.env.NEXT_OPENAI_API_KEY,
  });

  console.log(process.env.NEXT_OPENAI_API_KEY);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // 画像生成モデル
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content:
            "必ず日本語で返答してください。あなたは吟遊詩人です。ユーザーが入力した単語から、短い詩を作成してください。",
        },
        { role: "user", content: prompt },
      ],
    });

    const response = completion.choices[0].message.content;

    return res.status(200).json({ response });
  } catch (error) {
    console.error("ERROR OCURED", error);
    return res
      .status(500)
      .json({ error: "An error occurred while proxying the request" });
  }
};

export default handler;

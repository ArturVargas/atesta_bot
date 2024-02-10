import OpenAI from "openai";

const openai = new OpenAI();

export async function getInfoImage(filelink: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "whats in the image,give information about it" },
          {
            type: "image_url",
            image_url: {
              "url": filelink,
            },
          },
        ],
      },
    ],
    max_tokens: 1024,
  });
  return response.choices[0].message.content;
}




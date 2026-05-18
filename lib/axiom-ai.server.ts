import "server-only";

const openAiResponsesUrl = "https://api.openai.com/v1/responses";

type AxiomAiJsonRequest = {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
};

type OpenAiResponseOutputText = {
  type?: string;
  text?: string;
};

type OpenAiResponseOutputContent = OpenAiResponseOutputText | Record<string, unknown>;

type OpenAiResponseOutputItem = {
  type?: string;
  content?: OpenAiResponseOutputContent[];
};

type OpenAiResponseJson = {
  output_text?: string;
  output?: OpenAiResponseOutputItem[];
};

function getOpenAiApiKey() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable.");
  }

  return apiKey;
}

function extractResponseText(responseJson: OpenAiResponseJson) {
  if (typeof responseJson.output_text === "string" && responseJson.output_text.trim()) {
    return responseJson.output_text;
  }

  const text = responseJson.output
    ?.flatMap((item) => item.content || [])
    .map((content) => (typeof content.text === "string" ? content.text : ""))
    .filter(Boolean)
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("OpenAI response did not include output text.");
  }

  return text;
}

function parseJsonFromModel(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    const fencedJson = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1];

    if (fencedJson) {
      return JSON.parse(fencedJson) as unknown;
    }

    throw new Error("OpenAI response was not valid JSON.");
  }
}

export async function generateAxiomJsonWithOpenAi({
  system,
  user,
  model = "gpt-5.1-mini",
  temperature = 0.2,
}: AxiomAiJsonRequest) {
  const response = await fetch(openAiResponsesUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getOpenAiApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: user,
        },
      ],
      temperature,
      text: {
        format: {
          type: "json_object",
        },
      },
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status} ${responseText}`);
  }

  const responseJson = JSON.parse(responseText) as OpenAiResponseJson;
  return parseJsonFromModel(extractResponseText(responseJson));
}

/* eslint-disable */

export default function extractTextFromJson(json: any): string {
  if (!json || typeof json !== "object") return "";

  let result = "";

  if (Array.isArray(json.content)) {
    for (const node of json.content) {
      result += extractTextFromJson(node);
    }
  }

  if (json.type === "text" && typeof json.text === "string") {
    result += json.text;
  }

  return result;
}

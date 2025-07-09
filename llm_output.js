require("dotenv").config();
const Groq = require("groq-sdk");

async function testGroq(command) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  console.log(command);
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getFullYear()}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "qwen/qwen3-32b",
      messages: [
        {
          role: "user",
          content: `You are given the current date and time: ${formattedDate}  (in 24-hour format).

Extract the fields intent, description, and date from the input text.

- The date must be in "dd/mm/yyyy" format.
- The intent must be one of: quiz, assignment, meeting, hackathon, other.
- If intent cannot be identified, use "other".
- The description should summarize the event briefly.
- Output only valid JSON with keys: "intent", "description", and "date".
- Do not add any extra text or characters outside the JSON.

Input: "${command}"
`,
        },
      ],
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: true,
      stop: null,
    });

    let fullResponse = "";

    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || "";
      process.stdout.write(content);
      fullResponse += content;
    }

    const jsonMatch = fullResponse.match(/{[\s\S]*?}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      } catch (err) {
        console.error("\n❌ Failed to parse JSON:", err.message);
        return null;
      }
    } else {
      console.error("\n❌ No JSON found in the response.");
      return null;
    }
  } catch (error) {
    console.error("❌ Groq API call failed:", error.message);
    return null;
  }
}

module.exports = testGroq;

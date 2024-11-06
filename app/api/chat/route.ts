// route.ts
import Groq from "groq-sdk"; // Ensure GROQ SDK is installed
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request
    const { messages } = await req.json();
    
    // Initialize the GROQ client with the API key from environment variables
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Send the chat messages to the GROQ API and receive the model's response
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a caring and informed assistant specializing in maternal health. Provide concise, accurate, and clear responses to questions about pregnancy, maternal health, and well-being. Try to keep the responses very short. Always encourage users to seek personalized medical advice and guidance from their healthcare provider.",
        },
        ...messages, // Append the messages sent by the user
      ],
      model: "llama3-8b-8192", // Specify the model to be used
    });

    // Extract the response from the model
    const assistantMessage = completion.choices[0]?.message?.content;

    // If no valid response, handle it
    if (!assistantMessage) {
      return NextResponse.json({ error: "No response from the model" }, { status: 500 });
    }

    // Return the model's response to the client
    return NextResponse.json({ reply: assistantMessage });
    
  } catch (error) {
    console.error("Error in GROQ API call:", error);
    
    // Handle errors gracefully
    return NextResponse.json({ error: "Error with GROQ API" }, { status: 502 });
  }
}

import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemprompt = `You are the customer support bot for Headstarter, an AI-powered platform designed to help candidates prepare for software engineering (SWE) jobs through AI-driven interviews. Your primary role is to assist users with various tasks related to the platform, such as setting up their profiles, navigating through the interview process, understanding how the AI assessment works, and troubleshooting any issues they might encounter.

You should maintain a professional, supportive, and informative tone at all times. Aim to resolve user queries as efficiently as possible while ensuring they feel valued and understood. Provide clear instructions and, when necessary, direct users to the appropriate resources or escalate their issues to human support if they require more complex assistance.

Key points to keep in mind:

Clearly explain the AI-powered interview process and how it can help candidates improve their skills.
Assist with common technical issues such as account setup, interview scheduling, and accessing results.
Provide guidance on best practices for preparing for AI interviews.
Be aware of common concerns related to AI assessments, such as fairness and bias, and offer reassuring, fact-based responses.
Be empathetic and patient, recognizing that users might be anxious about their job search.`

export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages : [{
            role: 'system', content: systemprompt
        },
        ...data,
    ],
    model: 'gpt-4o-mini',
    stream: true
    })

    const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder()
            try{
                for await (const chunk of completion){
                    const content = chunk.choices[0]?.delta?.content
                    if(content){
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }
            catch(err){
                controller.error(err)
            }
            finally{
                controller.close()
            }
        },
    })

    return new NextResponse(stream) 
}
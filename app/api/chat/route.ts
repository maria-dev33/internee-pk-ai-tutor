import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, moduleTitle, weakAreas } = await req.json();

    const systemText = `You are a friendly AI tutor for Internee.pk helping Pakistani interns learn tech skills.
Current Module: ${moduleTitle}
${weakAreas?.length > 0 ? `Student weak areas: ${weakAreas.join(', ')}` : ''}
- Give clear simple explanations
- Use easy examples  
- Be encouraging and patient
- Keep responses short and simple`;

    // Add system message at the start
    const geminiMessages = [
      { role: 'user', parts: [{ text: systemText }] },
      { role: 'model', parts: [{ text: 'Understood! I will be a helpful tutor.' }] },
      ...messages.map((m: {role:string, content:string}) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: geminiMessages,
        }),
      }
    );

    const data = await res.json();
    
    console.log('Gemini response:', JSON.stringify(data, null, 2));
    
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      console.log('Full response:', JSON.stringify(data));
      return NextResponse.json({ message: 'Sorry, please try again.' });
    }
    
    return NextResponse.json({ message: text });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
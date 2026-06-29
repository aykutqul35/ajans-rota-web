import Groq from 'groq-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Sadece POST desteklenir' });
  }

  try {
    const { topic } = req.body;
    
    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey.trim() === '') {
      return res.status(200).json({ 
        success: true, 
        content: "Yapay zeka API anahtarı ayarlanmamış. Lütfen Vercel üzerinden GROQ_API_KEY'inizi tanımlayın." 
      });
    }

    const groq = new Groq({ apiKey: apiKey });

    const systemInstruction = `
Sen 'Ajans Rota' isimli İzmir merkezli lider dijital pazarlama ajansının kıdemli strateji ve veri analizi danışmanısın.
Adın: Rota AI.
Görevin: Müşterinin Google Ads ve Meta Ads bütçe değişikliklerine göre hangi platformun daha karlı olduğunu kıyaslayarak yönlendirici, çok kısa ve sayılarla konuşan (1 paragraf) bir strateji veya karar tavsiyesi vermek. Profesyonel, iddialı ama destekleyici bir dil kullan.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: topic || "Bütçemi nasıl yönetmeliyim?" }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 250,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "Üzgünüm, yanıt veremedim.";

    return res.status(200).json({ success: true, content: responseText });

  } catch (error) {
    console.error('AI Strategy Error:', error);
    return res.status(500).json({ success: false, message: 'Yapay zeka yanıt veremedi', error: error.toString() });
  }
}

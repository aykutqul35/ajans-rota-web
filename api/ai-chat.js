import Groq from 'groq-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Sadece POST desteklenir' });
  }

  try {
    const { messages } = req.body;
    
    // Çevre değişkenini artık GROQ_API_KEY olarak okuyacağız (Geriye dönük uyumluluk için GEMINI_API_KEY de destekleyelim ki Vercel'i değiştirmeye gerek kalmasın)
    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey.trim() === '') {
      return res.status(200).json({ 
        success: true, 
        reply: "Merhaba! Şu an yapay zeka beynim (API Key) yapılandırılmadığı için size standart yanıt veriyorum. Lütfen Vercel panelinden GROQ_API_KEY'inizi tanımlayın." 
      });
    }

    const groq = new Groq({ apiKey: apiKey });

    // Türkiye saati (UTC+3)
    const currentHour = (new Date().getUTCHours() + 3) % 24;
    const isNight = currentHour >= 19 || currentHour < 8;
    
    const systemInstruction = `
Sen 'Ajans Rota' isimli İzmir merkezli lider bir dijital pazarlama ajansının süper zeki Yapay Zeka Satış Asistanısın.
Adın: Rota Asistan.
Hizmetlerimiz: E-ticaret büyüme simülasyonu, SEO Optimizasyonu, Google Ads, Meta Reklam Yönetimi, Sosyal Medya ve Web Tasarım.
Amacın: Siteye gelen ziyaretçilerin sorunlarını anlamak, onlara profesyonel bir ajans olduğumuzu hissettirmek ve mutlaka İLETİŞİM NUMARALARINI (Telefon veya E-posta) alarak bir lead (kayıt) oluşturmaktır.
Kurallar:
1. Asla net bir fiyat verme. "Bütçenize ve hedeflerinize göre özel teklif çalışıyoruz" de.
2. Sadece Türkçe ve çok doğal, kısa (maksimum 2-3 paragraf), akıcı mesajlar yaz. Uzun destanlar yazma. Emojileri dozunda kullan.
3. Saat bilgisini dikkate al: Şu an saat ${currentHour}:00. ${isNight ? 'Şu an gece olduğu için ekibimizin dinlendiğini, ancak sabah ilk iş uzmanlarımızın arayacağını belirterek numara iste.' : 'Şu an mesai saatleri içindeyiz, uzmanlarımız en kısa sürede ulaşacak diyerek numara iste.'}
4. Eğer kullanıcı telefon numarasını veya e-postasını paylaşırsa, ona teşekkür et ve harika bir başlangıç olacağını söyle.
5. Kullanıcı farklı, alakasız bir konu sorarsa nazikçe dijital pazarlama ajansı asistanı olduğunu hatırlatıp konuyu geri çek.
`;

    // Groq (OpenAI formatı) için History hazırlığı
    const apiMessages = [
      { role: "system", content: systemInstruction }
    ];
    
    // Gelen messages: [{ role: 'assistant'/'user', content: '...' }]
    // Sadece ilk otomatik selamlamayı atlayabiliriz veya dahil edebiliriz. Groq için sorun yok, ama dahil etmek bağlamı korur.
    if (messages && messages.length > 0) {
      for (let i = 0; i < messages.length; i++) {
        apiMessages.push({
          role: messages[i].role === 'assistant' ? 'assistant' : 'user',
          content: messages[i].content
        });
      }
    }
    
    const chatCompletion = await groq.chat.completions.create({
      messages: apiMessages,
      model: "llama-3.3-70b-versatile", // En yeni ve aktif model
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "Üzgünüm, yanıt veremedim.";

    return res.status(200).json({ success: true, reply: responseText });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({ success: false, message: 'Yapay zeka yanıt veremedi', error: error.toString() });
  }
}

import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Sadece POST desteklenir' });
  }

  try {
    const { messages } = req.body;
    
    // API Key'i çevre değişkeninden alıyoruz. 
    // Vercel paneline GEMINI_API_KEY eklenmeli.
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(200).json({ 
        success: true, 
        reply: "Merhaba! Şu an yapay zeka beynim (API Key) yapılandırılmadığı için size standart yanıt veriyorum. Detaylı bilgi için iletişim formunu doldurabilirsiniz." 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    // Sistem promptunu inject edebilmek için sohbet geçmişinin en başına bağlam (context) ekleyelim
    // Gemini chat API formatını hazırlıyoruz.
    const history = [];
    
    // Gemini her zaman user -> model -> user -> model şeklinde ardışık (alternating) gitmek zorundadır.
    // İlk mesaj (frontend'den gelen selamlama) model mesajı olduğu için, onu siliyoruz (zaten promptta var).
    if (messages && messages.length > 1) {
      for (let i = 0; i < messages.length - 1; i++) {
        // İlk mesaj otomatik asistan selamlamasıysa bunu history'e ekleme. (Ardışık model hatasını engeller)
        if (i === 0 && messages[i].role === 'assistant') continue;
        
        history.push({
          role: messages[i].role === 'assistant' ? 'model' : 'user',
          parts: [{ text: messages[i].content }]
        });
      }
    }
    
    // Olası ardışık aynı rol hatalarını önlemek için ufak bir filtreleme yapalım
    const safeHistory = [];
    let lastRole = null;
    
    for (const msg of history) {
      if (msg.role !== lastRole) {
        safeHistory.push(msg);
        lastRole = msg.role;
      } else {
        // Eğer aynı rol peşpeşe geldiyse son mesajın metnine ekleyelim
        safeHistory[safeHistory.length - 1].parts[0].text += "\\n" + msg.parts[0].text;
      }
    }

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemInstruction }] },
        { role: 'model', parts: [{ text: "Anladım. Ajans Rota'nın Yapay Zeka Asistanı olarak görevime hazırım. Gelen ziyaretçileri sıcak karşılayıp telefon numaralarını almaya odaklanacağım." }] },
        ...safeHistory
      ]
    });

    const lastUserMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastUserMessage);
    const responseText = result.response.text();

    return res.status(200).json({ success: true, reply: responseText });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({ success: false, message: 'Yapay zeka yanıt veremedi', error: error.toString() });
  }
}

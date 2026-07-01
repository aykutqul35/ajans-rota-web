import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ message: 'Pong! The server is running.' });
});

app.get('/api/client/me', async (req, res) => {
  try {
    const clerkId = req.headers['x-clerk-id'] as string;
    if (!clerkId) {
      return res.status(401).json({ error: 'Unauthorized: Missing x-clerk-id header' });
    }

    let client = await prisma.client.findUnique({
      where: { clerkId },
      include: { reports: true }
    });

    if (!client) {
      // Create a demo client automatically for testing
      client = await prisma.client.create({
        data: {
          clerkId,
          brandName: 'Rota Demo Müşterisi',
          email: 'demo@ajansrota.com',
          reports: {
            create: [
              {
                platform: 'google',
                spend: 12500.5,
                revenue: 45000.0,
                clicks: 1250,
                conversions: 45,
                impressionShare: 65.5,
                month: 'Haziran 2026'
              },
              {
                platform: 'meta',
                spend: 8500.0,
                revenue: 22000.0,
                clicks: 3400,
                conversions: 120,
                impressionShare: 80.0,
                month: 'Haziran 2026'
              }
            ]
          }
        },
        include: { reports: true }
      });
    }

    res.json({ success: true, data: client });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin API: Get all clients
app.get('/api/admin/clients', async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: { reports: true }
    });
    res.json({ success: true, data: clients });
  } catch (error) {
    console.error('Error fetching all clients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin Login Route (Mock Auth)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '12345') {
    res.json({
      success: true,
      token: 'admin-mock-token-12345',
      user: { username: 'admin' }
    });
  } else {
    res.status(401).json({ success: false, message: 'Hatalı kullanıcı adı veya şifre' });
  }
});

// Admin API: Create a new client
app.post('/api/admin/clients', async (req, res) => {
  try {
    const { clerkId, brandName, email, reportData } = req.body;
    const client = await prisma.client.create({
      data: {
        clerkId,
        brandName,
        email,
        reportData
      }
    });
    res.json({ success: true, data: client });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin API: Update a client
app.put('/api/admin/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { brandName, email, reportData } = req.body;
    const client = await prisma.client.update({
      where: { id },
      data: { brandName, email, reportData }
    });
    res.json({ success: true, data: client });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin API: Delete a client
app.delete('/api/admin/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // First delete associated reports
    await prisma.report.deleteMany({
      where: { clientId: id }
    });
    // Then delete the client
    const client = await prisma.client.delete({
      where: { id }
    });
    res.json({ success: true, data: client });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mock AI simulation endpoint
app.post('/api/ai-strategy', (req, res) => {
  const { simSpend, expectedRevenue } = req.body;
  
  let insight = '';
  
  if (simSpend && expectedRevenue) {
    const googleSpend = simSpend.google || 0;
    const metaSpend = simSpend.meta || 0;
    const googleRev = Math.round(expectedRevenue.google || 0);
    const metaRev = Math.round(expectedRevenue.meta || 0);
    
    // Formatting numbers with commas
    const fmt = (num: number) => num.toLocaleString('tr-TR');

    if (googleSpend > metaSpend * 1.5) {
      insight = `💡 **Yapay Zeka Stratejisi:** Bütçe simülasyonunuz analiz edildi. Google Ads bütçenizi ${fmt(googleSpend)} TL seviyesine çıkarmanız agresif bir şekilde ${fmt(googleRev)} TL ciro potansiyeli sunuyor. Ancak Meta Ads (${fmt(metaSpend)} TL) tarafında bütçenin geride kalması, görsel iletişim huninizi zayıflatabilir. Google PMax kampanyalarından en iyi verimi almak için, Meta'daki soğuk kitle yatırımlarını biraz daha dengelemeniz önerilir.`;
    } else if (metaSpend > googleSpend * 1.5) {
      insight = `💡 **Yapay Zeka Stratejisi:** Simülasyona göre Meta Ads'e (${fmt(metaSpend)} TL) ağırlık veriyorsunuz ve bu ${fmt(metaRev)} TL'lik dev bir getiri sinyali veriyor. Görsel iletişim ile kitleyi yakalama oranınız çok yüksek. Ancak marka bilinirliği oluştuktan sonra kullanıcıların Google'da markanızı arayacağını unutmayın. Arama Ağı bütçesini (${fmt(googleSpend)} TL) rakiplere tıklama kaptırmayacak şekilde optimize etmeniz, toplam ROAS'ı %22 artıracaktır.`;
    } else {
      insight = `💡 **Yapay Zeka Stratejisi:** Çok dengeli ve kârlı bir bütçe dağılımı (Google: ${fmt(googleSpend)} TL, Meta: ${fmt(metaSpend)} TL) kurguladınız! Bu "Omnichannel" (Çok kanallı) yapı sayesinde, Meta üzerinden yeni müşteriler bulup, Google üzerinden satışı kapatacaksınız. Toplamda öngörülen ${fmt(googleRev + metaRev)} TL ciro hedefine ulaşmak için mevcut kreatif testlerinize ağırlık vermenizi tavsiye ediyoruz.`;
    }
  } else {
    // Fallback if data is somehow missing
    insight = `💡 **Yapay Zeka Stratejisi:** Bütçe dağılımınız analiz edildiğinde, her iki platformun da kârlı olduğu görülüyor. Rota Growth OS verilerine göre yatırımlarınızı dengeli olarak artırmak en risksiz büyüme modelidir.`;
  }

  setTimeout(() => {
    res.json({ success: true, content: insight });
  }, 1200);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

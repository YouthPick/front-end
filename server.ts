import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import express from 'express';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 4000;

// Initialize Gemini client safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn(
    'GEMINI_API_KEY environment variable is not defined. Chatbot will run in fallback mock mode.',
  );
}

app.use(express.json());

// API route for chatbot helper
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (!ai) {
      // Return a simulated high-quality response if Gemini is not initialized
      return res.json({
        text: `[알림] API 키가 설정되지 않아 데모 모드로 응답합니다.\n\n질문하신 "${message}"에 대한 맞춤 답변입니다:\n청년정책 서비스 **YouthPick**에서는 일자리, 주거, 교육, 복지 등의 카테고리별로 정책을 맞춤 설계하고 있습니다. 대표적으로 서울시 '청년 월세 한시 특별지원'(월 최대 20만원 지원) 및 '청년 디지털 일자리 지원 사업'을 통해 일과 주거 안정을 도모하실 수 있습니다. 상세 상담을 위해 API 키를 Secrets에 입력해 주세요!`,
      });
    }

    // System instruction detailing the brand and specific mock policies
    const systemInstruction = `
You are the expert Youth Policy AI Assistant named "정책 탐색 도우미" for the website "YouthPick" (청년정책 맞춤형 서비스).
Your goal is to help Korean youth (ages 19-34) find policies that suit their needs.

Here is the knowledge base of policies on YouthPick:
1. 일자리 (Job):
   - 청년 디지털 일자리 지원 사업: IT 분야 실무 경험과 교육을 제공하고 취업 연계를 지원하는 사업. 대상: 만 19세 ~ 34세 미취업 청년.
   - 청년내일채움공제: 중소기업 취업 청년의 자산 형성을 지원하는 제도. 2년간 300만원을 적립하면 정부와 기업이 공동 적립하여 1,200만원으로 환급.
   - 국민취업지원제도: 구직자에게 취업지원서비스를 종합적으로 제공하고 저소득 구직자에게는 생계안정을 위한 구직촉진수당(월 50만원씩 6개월) 지급.

2. 주거 (Housing):
   - 청년 월세 한시 특별지원: 청년들의 주거비 부담 경감을 위해 월세를 실지급액 기준 최대 20만원까지 최대 12개월 동안 지원하는 사업. 대상: 만 19세~34세 무주택 청년 (부모와 별도 거주).
   - 청년 주거급여 분리지급: 주거급여 수급가구 내 20대 미혼 자녀가 학업이나 구직 등을 이유로 부모와 다른 시·군에서 거주하는 경우 별도로 주거급여를 지급하는 제도.
   - 청년 버팀목 전세자금대출: 청년들을 위한 저금리(연 1.5%~2.1%) 전세자금 대출 지원 사업.

3. 교육 (Education):
   - K-디지털 트레이닝 (국비지원): 디지털, 신기술 분야 실무 중심 교육을 통해 취업 역량을 높여주는 과정. 교육비 전액 정부 지원.
   - 국민내일배움카드: 스스로 역량 개발을 할 수 있도록 훈련비를 지원하는 카드 (1인당 300만~500만원 지원).
   - 서울시 청년수당: 서울에 거주하는 미취업 청년(만 19~34세)에게 월 50만원씩 최대 6개월간 활동 지원금을 지급하는 사업.

4. 복지·문화 (Welfare & Culture):
   - 청년내일저축계좌: 일하는 저소득층 청년의 자산형성을 지원하는 계좌. 본인 저축액(10만원) 대비 정부지원금을 10만~30만원 매칭 적립.
   - 청년문화예술패스: 성년이 되는 청년(만 19세)에게 문화예술 관람비(연 최대 15만원) 지원.

5. 참여·권리 (Participation & Rights):
   - 청년보좌역 및 청년인턴: 정부 부처의 정책 결정 과정에 청년의 목소리를 반영하기 위한 참여 기회 제공.

Guidelines:
- Answer in Korean in a polite, friendly, and enthusiastic tone ("~해요", "~드립니다").
- If the user asks for specific policies, explain them clearly based on the knowledge base above.
- Recommend corresponding policies based on their status or region (primarily Seoul/서울특별시).
- Organize the output with clear bullet points, bold text, and neat sections.
- Keep responses relatively concise but informative. Do not use markdown features not supported.
`;

    // Format chat history for Gemini API
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || '죄송합니다. 답변을 생성하지 못했습니다.';
    res.json({ text: replyText });
  } catch (error: unknown) {
    console.error('Error communicating with Gemini API:', error);
    res.status(500).json({ error: '서버 오류가 발생하여 챗봇 응답에 실패했습니다.' });
  }
});

// Configure Vite or serve static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[YouthPick] Server running on port ${PORT}`);
  });
}

startServer();

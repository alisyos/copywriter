import { NextApiRequest, NextApiResponse } from 'next';
import { generateCopyWithAI } from '../../lib/openai';
import { MediaType, FormData } from '../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { mediaType, formData }: { mediaType: MediaType; formData: FormData } = req.body;

    if (!mediaType || !formData) {
      return res.status(400).json({ message: '필수 데이터가 누락되었습니다.' });
    }

    // 필수 필드 검증
    const requiredFields = ['purpose', 'industry', 'brandName', 'targetAudience', 'tone'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `필수 필드가 누락되었습니다: ${missingFields.join(', ')}` 
      });
    }

    const result = await generateCopyWithAI(mediaType, formData);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('API 오류:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' 
    });
  }
} 
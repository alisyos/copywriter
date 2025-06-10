import { NextApiRequest, NextApiResponse } from 'next';
import { loadPrompts, savePrompts, updatePrompt, PromptsConfig, PromptData } from '../../../lib/prompts';
import { MediaType } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        // 모든 프롬프트 조회
        const prompts = await loadPrompts();
        res.status(200).json(prompts);
        break;

      case 'POST':
        // 모든 프롬프트 저장
        const { prompts: newPrompts } = req.body as { prompts: PromptsConfig };
        if (!newPrompts) {
          return res.status(400).json({ error: '프롬프트 데이터가 필요합니다.' });
        }
        
        await savePrompts(newPrompts);
        res.status(200).json({ message: '프롬프트가 성공적으로 저장되었습니다.' });
        break;

      case 'PUT':
        // 특정 미디어 타입의 프롬프트 업데이트
        const { mediaType, promptData } = req.body as { 
          mediaType: MediaType, 
          promptData: PromptData 
        };
        
        if (!mediaType || !promptData) {
          return res.status(400).json({ error: '미디어 타입과 프롬프트 데이터가 필요합니다.' });
        }
        
        await updatePrompt(mediaType, promptData);
        res.status(200).json({ message: '프롬프트가 성공적으로 업데이트되었습니다.' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('프롬프트 API 오류:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' 
    });
  }
} 
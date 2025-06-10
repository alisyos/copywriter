import OpenAI from 'openai';
import { FormData, MediaType, GeneratedCopy, CopyResult } from '../types';
import { generatePrompt, getPrompt } from './prompts';
import { validateCopy } from './guidelines';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCopyWithAI(mediaType: MediaType, formData: FormData): Promise<CopyResult> {
  try {
    // 동적 시스템 프롬프트 로드
    const systemPrompt = await getPrompt(mediaType);
    const userPrompt = generatePrompt(mediaType, formData);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('OpenAI 응답을 받을 수 없습니다.');
    }

    const copies = parseCopyResponse(response, mediaType);
    const validatedCopies = validateCopies(copies, mediaType);

    return {
      copies: validatedCopies.copies,
      mediaType,
      isValid: validatedCopies.isValid,
      validationErrors: validatedCopies.errors
    };
  } catch (error) {
    console.error('OpenAI API 호출 오류:', error);
    throw new Error('광고 문구 생성 중 오류가 발생했습니다.');
  }
}

function parseCopyResponse(response: string, mediaType: MediaType): GeneratedCopy[] {
  try {
    // JSON 형식의 응답을 파싱
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[1];
      const parsed = JSON.parse(jsonStr);
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    
    // JSON 형식이 아닌 경우 기존 방식으로 파싱
    const copies: GeneratedCopy[] = [];
    const lines = response.split('\n').filter(line => line.trim());

    switch (mediaType) {
      case 'naver':
        for (const line of lines) {
          if (line.match(/^\d+\./)) {
            const match = line.match(/제목:\s*(.+?)\s*\/\s*설명:\s*(.+)/);
            if (match) {
              copies.push({
                title: match[1].trim(),
                description: match[2].trim()
              });
            }
          }
        }
        break;

      case 'kakao':
        for (const line of lines) {
          if (line.match(/^\d+\./)) {
            const match = line.match(/메인:\s*(.+?)\s*\/\s*서브:\s*(.+)/);
            if (match) {
              copies.push({
                mainText: match[1].trim(),
                subText: match[2].trim()
              });
            }
          }
        }
        break;

      case 'social':
      case 'landing':
        for (const line of lines) {
          if (line.match(/^\d+\./)) {
            const text = line.replace(/^\d+\.\s*/, '').trim();
            if (text) {
              copies.push({
                fullText: text
              });
            }
          }
        }
        break;
    }

    return copies.length > 0 ? copies : [{ fullText: response }];
  } catch (error) {
    console.error('응답 파싱 오류:', error);
    return [{ fullText: response }];
  }
}

function validateCopies(copies: GeneratedCopy[], mediaType: MediaType): { copies: GeneratedCopy[], isValid: boolean, errors: string[] } {
  const validatedCopies: GeneratedCopy[] = [];
  const allErrors: string[] = [];

  for (const copy of copies) {
    const copyErrors: string[] = [];

    if (mediaType === 'naver') {
      if (copy.title) {
        const titleValidation = validateCopy(copy.title, mediaType, 'title');
        if (!titleValidation.isValid) {
          copyErrors.push(...titleValidation.errors);
        }
      }
      if (copy.description) {
        const descValidation = validateCopy(copy.description, mediaType, 'description');
        if (!descValidation.isValid) {
          copyErrors.push(...descValidation.errors);
        }
      }
    } else if (mediaType === 'kakao') {
      if (copy.mainText) {
        const mainValidation = validateCopy(copy.mainText, mediaType, 'main');
        if (!mainValidation.isValid) {
          copyErrors.push(...mainValidation.errors);
        }
      }
      if (copy.subText) {
        const subValidation = validateCopy(copy.subText, mediaType, 'sub');
        if (!subValidation.isValid) {
          copyErrors.push(...subValidation.errors);
        }
      }
    } else if (copy.fullText) {
      const fullValidation = validateCopy(copy.fullText, mediaType, 'full');
      if (!fullValidation.isValid) {
        copyErrors.push(...fullValidation.errors);
      }
    }

    // 모든 문구를 포함하되, 각각의 검증 결과를 함께 저장
    const validatedCopy = {
      ...copy,
      validationErrors: copyErrors,
      isValid: copyErrors.length === 0
    };
    
    validatedCopies.push(validatedCopy);
    
    // 전체 오류 목록에도 추가 (전체 통계용)
    if (copyErrors.length > 0) {
      allErrors.push(...copyErrors);
    }
  }

  return {
    copies: validatedCopies,
    isValid: allErrors.length === 0,
    errors: allErrors
  };
} 
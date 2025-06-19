import { MediaGuideline, MediaType } from '../types';

// 프롬프트에서 조건을 동적으로 파싱하는 함수
export function parseGuidelinesFromPrompt(prompt: string): MediaGuideline {
  const guideline: MediaGuideline = {
    prohibitedWords: [],
    requiredElements: [],
    specialRules: []
  };

  // ###조건 섹션 추출
  const conditionMatch = prompt.match(/###조건\s*([\s\S]*?)(?=###|$)/);
  if (!conditionMatch) {
    return guideline;
  }

  const conditionText = conditionMatch[1];
  const lines = conditionText.split('\n').filter(line => line.trim());

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 제목 글자수 조건 파싱
    if (trimmedLine.includes('제목') && trimmedLine.includes('자')) {
      const titleMatch = trimmedLine.match(/(\d+)[-–~](\d+)자/);
      if (titleMatch) {
        guideline.titleMinLength = parseInt(titleMatch[1]);
        guideline.titleMaxLength = parseInt(titleMatch[2]);
      } else {
        const singleMatch = trimmedLine.match(/(\d+)자/);
        if (singleMatch) {
          guideline.titleMaxLength = parseInt(singleMatch[1]);
        }
      }
    }
    
    // 설명 글자수 조건 파싱
    if (trimmedLine.includes('설명') && trimmedLine.includes('자')) {
      const descMatch = trimmedLine.match(/(\d+)[-–~](\d+)자/);
      if (descMatch) {
        guideline.descriptionMinLength = parseInt(descMatch[1]);
        guideline.descriptionMaxLength = parseInt(descMatch[2]);
      } else {
        const singleMatch = trimmedLine.match(/(\d+)자/);
        if (singleMatch) {
          guideline.descriptionMaxLength = parseInt(singleMatch[1]);
        }
      }
    }
    
    // 메인텍스트 글자수 조건 파싱
    if (trimmedLine.includes('메인') && trimmedLine.includes('자')) {
      const mainMatch = trimmedLine.match(/(\d+)[-–~](\d+)자/);
      if (mainMatch) {
        guideline.mainMaxLength = parseInt(mainMatch[2]);
      } else {
        const singleMatch = trimmedLine.match(/(\d+)자/);
        if (singleMatch) {
          guideline.mainMaxLength = parseInt(singleMatch[1]);
        }
      }
    }
    
    // 서브텍스트 글자수 조건 파싱
    if (trimmedLine.includes('서브') && trimmedLine.includes('자')) {
      const subMatch = trimmedLine.match(/(\d+)[-–~](\d+)자/);
      if (subMatch) {
        guideline.subMaxLength = parseInt(subMatch[2]);
      } else {
        const singleMatch = trimmedLine.match(/(\d+)자/);
        if (singleMatch) {
          guideline.subMaxLength = parseInt(singleMatch[1]);
        }
      }
    }
    
    // fullText 글자수 조건 파싱 (소셜미디어, 랜딩페이지)
    if (trimmedLine.includes('fullText') && trimmedLine.includes('자')) {
      const fullMatch = trimmedLine.match(/(\d+)[-–~](\d+)자/);
      if (fullMatch) {
        guideline.fullTextMinLength = parseInt(fullMatch[1]);
        guideline.fullTextMaxLength = parseInt(fullMatch[2]);
      }
    }
    
    // 금지어 파싱
    if (trimmedLine.includes('금지어') || trimmedLine.includes('금지')) {
      // 따옴표나 쉼표로 구분된 금지어들 추출
      const prohibitedMatch = trimmedLine.match(/['"]([^'"]+)['"]|([^,\s]+)/g);
      if (prohibitedMatch) {
        const words = prohibitedMatch
          .map(word => word.replace(/['"]/g, '').trim())
          .filter(word => word && !word.includes('금지') && !word.includes('등') && !word.includes('표현'));
        guideline.prohibitedWords.push(...words);
      }
    }
    
    // 특수 규칙 추가
    if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
      const rule = trimmedLine.replace(/^[-•]\s*/, '');
      if (rule && !rule.includes('자') && !rule.includes('금지어')) {
        guideline.specialRules.push(rule);
      }
    }
  }

  return guideline;
}

// 기존 하드코딩된 가이드라인 (fallback용)
export const MEDIA_GUIDELINES: Record<MediaType, MediaGuideline> = {
  naver: {
    titleMinLength: 1,
    titleMaxLength: 15,
    descriptionMinLength: 20,
    descriptionMaxLength: 45,
    prohibitedWords: [
      '1등', '최고', '최대', '최상', '절대', '완벽', '100%', '무료', '공짜',
      '혁신적', '혁명적', '세계 최초', '대박', '핫한', '인기폭발'
    ],
    requiredElements: ['업체명/브랜드명', '구체적 혜택'],
    specialRules: [
      '허위·과장 표현 금지',
      '구체적 수치 포함 권장',
      '키워드 자연스럽게 삽입',
      '임팩트 있는 단어 사용'
    ]
  },
  kakao: {
    mainMaxLength: 13,
    subMaxLength: 17,
    prohibitedWords: [
      '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=',
      '{', '}', '[', ']', '|', '\\', ':', ';', '"', "'", '<', '>', ',', '.', '?', '/',
      '최고', '1등', '대박', '혁신'
    ],
    requiredElements: ['브랜드 표기'],
    specialRules: [
      '특수문자 사용 금지',
      '메인과 서브 내용 달라야 함',
      '이미지와 텍스트 겹침 주의',
      '간결하고 명확하게'
    ]
  },
  social: {
    fullTextMinLength: 70,
    fullTextMaxLength: 90,
    prohibitedWords: [
      '클릭베이트성 과장 표현'
    ],
    requiredElements: ['공감 요소', '행동 유도', '주목성'],
    specialRules: [
      '첫 문장이 가장 중요',
      '구체적 수치나 감정 자극',
      '명확한 CTA 포함',
      '타겟의 관심사 반영'
    ]
  },
  landing: {
    fullTextMinLength: 60,
    fullTextMaxLength: 100,
    prohibitedWords: [],
    requiredElements: ['후킹 요소'],
    specialRules: [
      '강력한 첫인상',
      '문제 해결 중심',
      '감정적 어필',
      '구체적 혜택 제시'
    ]
  }
};

export function validateCopy(text: string, mediaType: MediaType, type: 'title' | 'description' | 'main' | 'sub' | 'full' = 'full', customGuideline?: MediaGuideline): { isValid: boolean; errors: string[] } {
  const guidelines = customGuideline || MEDIA_GUIDELINES[mediaType];
  const errors: string[] = [];

  // 글자수 검증
  if (type === 'title' && guidelines.titleMaxLength) {
    if (text.length > guidelines.titleMaxLength) {
      errors.push(`제목이 ${guidelines.titleMaxLength}자를 초과했습니다. (현재: ${text.length}자)`);
    }
    if (guidelines.titleMinLength && text.length < guidelines.titleMinLength) {
      errors.push(`제목이 ${guidelines.titleMinLength}자 미만입니다. (현재: ${text.length}자)`);
    }
  }

  if (type === 'description' && guidelines.descriptionMaxLength) {
    if (text.length > guidelines.descriptionMaxLength) {
      errors.push(`설명이 ${guidelines.descriptionMaxLength}자를 초과했습니다. (현재: ${text.length}자)`);
    }
    if (guidelines.descriptionMinLength && text.length < guidelines.descriptionMinLength) {
      errors.push(`설명이 ${guidelines.descriptionMinLength}자 미만입니다. (현재: ${text.length}자)`);
    }
  }

  if (type === 'main' && guidelines.mainMaxLength) {
    if (text.length > guidelines.mainMaxLength) {
      errors.push(`메인 텍스트가 ${guidelines.mainMaxLength}자를 초과했습니다. (현재: ${text.length}자)`);
    }
  }

  if (type === 'sub' && guidelines.subMaxLength) {
    if (text.length > guidelines.subMaxLength) {
      errors.push(`서브 텍스트가 ${guidelines.subMaxLength}자를 초과했습니다. (현재: ${text.length}자)`);
    }
  }

  if (type === 'full') {
    if (guidelines.fullTextMaxLength && text.length > guidelines.fullTextMaxLength) {
      errors.push(`텍스트가 ${guidelines.fullTextMaxLength}자를 초과했습니다. (현재: ${text.length}자)`);
    }
    if (guidelines.fullTextMinLength && text.length < guidelines.fullTextMinLength) {
      errors.push(`텍스트가 ${guidelines.fullTextMinLength}자 미만입니다. (현재: ${text.length}자)`);
    }
  }

  // 금지 단어 검증
  for (const prohibitedWord of guidelines.prohibitedWords) {
    if (text.includes(prohibitedWord)) {
      errors.push(`금지된 단어가 포함되어 있습니다: "${prohibitedWord}"`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
} 
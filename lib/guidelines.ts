import { MediaGuideline, MediaType } from '../types';

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

export function validateCopy(text: string, mediaType: MediaType, type: 'title' | 'description' | 'main' | 'sub' | 'full' = 'full'): { isValid: boolean; errors: string[] } {
  const guidelines = MEDIA_GUIDELINES[mediaType];
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
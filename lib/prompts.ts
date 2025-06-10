import { FormData, MediaType, NaverFormData, KakaoFormData, SocialFormData, LandingFormData } from '../types';
import fs from 'fs/promises';
import path from 'path';

export function generatePrompt(mediaType: MediaType, formData: FormData): string {
  const baseContext = `
당신은 전문 광고 카피라이터입니다.
브랜드: ${formData.brandName}
업종: ${formData.industry}
광고 목적: ${formData.purpose}
타겟 고객: ${formData.targetAudience}
문구 스타일: ${formData.tone}
${formData.mainBenefit ? `주요 혜택: ${formData.mainBenefit}` : ''}
${formData.prohibitedWords ? `금지 단어: ${formData.prohibitedWords}` : ''}
`;

  switch (mediaType) {
    case 'naver':
      return generateNaverPrompt(baseContext, formData as NaverFormData);
    case 'kakao':
      return generateKakaoPrompt(baseContext, formData as KakaoFormData);
    case 'social':
      return generateSocialPrompt(baseContext, formData as SocialFormData);
    case 'landing':
      return generateLandingPrompt(baseContext, formData as LandingFormData);
    default:
      throw new Error(`Unsupported media type: ${mediaType}`);
  }
}

function generateNaverPrompt(baseContext: string, formData: NaverFormData): string {
  return `${baseContext}

네이버 검색광고 배너 문구를 생성해주세요.

조건:
- 제목: 1~15자 (임팩트 있고 간결하게)
- 설명: 20~45자 (구체적 혜택과 정보 포함)
- 업체명/브랜드명 필수 포함
- 허위·과장 표현 절대 금지
- 구체적 수치나 혜택 포함 권장
${formData.titleKeywords ? `- 제목 키워드: ${formData.titleKeywords}` : ''}
${formData.descriptionFocus ? `- 설명 강조점: ${formData.descriptionFocus}` : ''}

금지 단어: 1등, 최고, 최대, 최상, 절대, 완벽, 100%, 무료, 공짜, 혁신적, 혁명적, 세계 최초, 대박, 핫한, 인기폭발

다음 형식으로 3개의 문구를 제안해주세요:
1. 제목: [제목] / 설명: [설명]
2. 제목: [제목] / 설명: [설명]
3. 제목: [제목] / 설명: [설명]`;
}

function generateKakaoPrompt(baseContext: string, formData: KakaoFormData): string {
  return `${baseContext}

카카오톡 비즈보드 광고 문구를 생성해주세요.

조건:
- 메인 텍스트: 13자 이내 (핵심 메시지)
- 서브 텍스트: 17자 이내 (부가 정보)
- 브랜드 표기 필수
- 특수문자 사용 금지
- 메인과 서브는 서로 다른 내용
- 간결하고 명확하게
${formData.mainMessage ? `- 메인 키 메시지: ${formData.mainMessage}` : ''}
${formData.subInfo ? `- 서브 정보: ${formData.subInfo}` : ''}

금지 요소: 모든 특수문자(!@#$%^&*()_+={}[]|\\:;"'<>,.?/), 과장 표현

다음 형식으로 3개의 문구를 제안해주세요:
1. 메인: [메인 텍스트] / 서브: [서브 텍스트]
2. 메인: [메인 텍스트] / 서브: [서브 텍스트]
3. 메인: [메인 텍스트] / 서브: [서브 텍스트]`;
}

function generateSocialPrompt(baseContext: string, formData: SocialFormData): string {
  return `${baseContext}

인스타그램/페이스북 리드 광고 문구를 생성해주세요.

조건:
- 공감할 수 있는 첫 문장으로 시작
- 구체적 수치나 감정을 자극하는 내용
- 명확한 행동 유도(CTA) 포함
- 타겟의 관심사와 니즈 반영
- 전체 100자 내외 권장
${formData.empathyElement ? `- 공감 유도 요소: ${formData.empathyElement}` : ''}
${formData.ctaStrength ? `- CTA 강도: ${formData.ctaStrength}` : ''}

작성 팁:
- 첫 문장이 가장 중요 (스크롤을 멈추게 하는 힘)
- "이런 고민 있으신가요?" 같은 공감 유도
- "지금 신청하면" 같은 긴급성 부여
- 구체적 숫자나 %로 신뢰도 높이기

다음 형식으로 3개의 문구를 제안해주세요:
1. [전체 문구]
2. [전체 문구]
3. [전체 문구]`;
}

function generateLandingPrompt(baseContext: string, formData: LandingFormData): string {
  return `${baseContext}

상세페이지 후킹 멘트를 생성해주세요.

조건:
- 강력한 첫인상과 주목성
- 고객의 문제나 니즈 직접적 언급
- 감정적 어필과 논리적 근거 조합
- 구체적 혜택과 해결책 제시
- 페이지 이탈 방지 효과
${formData.hookType ? `- 후킹 유형: ${formData.hookType}` : ''}

후킹 전략:
- 문제 해결형: "이런 문제로 고민이세요?"
- 혜택 강조형: "이제 이런 혜택을 누리세요"
- 감정 자극형: "당신도 이런 기분을 느껴보세요"
- 호기심 유발형: "왜 많은 사람들이 선택할까요?"

다음 형식으로 3개의 문구를 제안해주세요:
1. [후킹 멘트]
2. [후킹 멘트]
3. [후킹 멘트]`;
}

export interface PromptData {
  name: string;
  prompt: string;
}

export interface PromptsConfig {
  [key: string]: PromptData;
}

const PROMPTS_FILE_PATH = path.join(process.cwd(), 'data', 'prompts.json');

// 프롬프트 데이터 로드
export async function loadPrompts(): Promise<PromptsConfig> {
  try {
    const data = await fs.readFile(PROMPTS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading prompts:', error);
    throw new Error('프롬프트 데이터를 불러올 수 없습니다.');
  }
}

// 특정 미디어 타입의 프롬프트 조회
export async function getPrompt(mediaType: MediaType): Promise<string> {
  const prompts = await loadPrompts();
  const promptData = prompts[mediaType];
  
  if (!promptData) {
    throw new Error(`${mediaType}에 대한 프롬프트를 찾을 수 없습니다.`);
  }
  
  return promptData.prompt;
}

// 프롬프트 데이터 저장
export async function savePrompts(prompts: PromptsConfig): Promise<void> {
  try {
    // data 디렉토리가 없으면 생성
    const dataDir = path.dirname(PROMPTS_FILE_PATH);
    await fs.mkdir(dataDir, { recursive: true });
    
    const data = JSON.stringify(prompts, null, 2);
    await fs.writeFile(PROMPTS_FILE_PATH, data, 'utf-8');
  } catch (error) {
    console.error('Error saving prompts:', error);
    throw new Error('프롬프트 데이터를 저장할 수 없습니다.');
  }
}

// 특정 미디어 타입의 프롬프트 업데이트
export async function updatePrompt(mediaType: MediaType, promptData: PromptData): Promise<void> {
  const prompts = await loadPrompts();
  prompts[mediaType] = promptData;
  await savePrompts(prompts);
} 
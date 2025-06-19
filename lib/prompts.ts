import { FormData, MediaType, NaverFormData, KakaoFormData, SocialFormData, LandingFormData } from '../types';
import fs from 'fs/promises';
import path from 'path';

// 매체별 프롬프트 템플릿
const MEDIA_PROMPTS = {
  naver: `###지시사항
입력된 **브랜드·제품 정보**를 기반으로  
1) 타겟 고객의 니즈를 충족하고  
2) 브랜드/제품의 핵심 가치를 전달하며  
3) 클릭을 유도하는 **배너 광고 문구(제목·설명)**를 작성하십시오.  

###작성절차
1. **키 메시지 추출**  
   - 입력 정보에서 핵심 가치·문제 해결 포인트 추출.
2. **타겟 공감 포인트 선정**  
   - 타겟의 Pain Point/Benefit 매핑.
3. **카피라이팅(제목)**  
   - 1~15자, 강력한 동사·공감형 표현 사용.
4. **카피라이팅(설명)**  
   - 20~45자, 클릭 유도 문장 + 가치 제안 결합.
5. **검증 & 금칙어 필터링**  
   - 금지어('무료'·'최고' 등 과장 표현) 및 허위·법적 리스크 검사. 불가 시 수정.
6. **출력 JSON 생성**  
   - 아래 스키마 준수. 제목·설명 길이 조건 위배 시 오류 반환.

###조건
- **제목**: 1–15자(공백 포함)  
- **설명**: 20–45자(공백 포함)  
- 금지어: '무료', '공짜', '100%', '최고', '최대', '완전', '절대' 등 과장 표현  
- 허위·과장, 법적 제재 가능 문구 사용 금지

###광고목적
{{광고목적프롬프트}}

###출력형식
\`\`\`json
[
  {
    "title": "제목1",
    "description": "설명1"
  },
  {
    "title": "제목2", 
    "description": "설명2"
  },
  {
    "title": "제목3",
    "description": "설명3"
  }
]
\`\`\``,

  kakao: `###지시사항
입력된 **브랜드·제품 정보**를 기반으로 
1) 타겟 고객의 니즈를 충족하고 
2) 브랜드/제품의 핵심 가치를 전달하며 
3) 클릭을 유도하는 **배너 광고 문구(메인텍스트·서브텍스트)**를 작성하십시오. 

###작성절차
1. **키 메시지 추출** 
- 입력 정보에서 핵심 가치·문제 해결 포인트 추출.
2. **타겟 공감 포인트 선정** 
- 타겟의 Pain Point/Benefit 매핑.
3. **카피라이팅(메인텍스트)** 
- 1~13자, 강력한 동사·공감형 표현 사용.
4. **카피라이팅(서브텍스트)** 
- 5~17자, 클릭 유도 문장 + 가치 제안 결합.
5. **검증 & 금칙어 필터링** 
- 금지어('무료'·'최고' 등 과장 표현) 및 허위·법적 리스크 검사. 불가 시 수정.
6. **출력 JSON 생성** 
- 아래 스키마 준수. 제목·설명 길이 조건 위배 시 오류 반환.

###조건
- **메인텍스트**: 1–13자(공백 포함) 
- **서브텍스트**: 5–17자(공백 포함) 
- 금지어: '무료', '공짜', '100%', '최고', '최대', '완전', '절대' 등 과장 표현과 특수문자
- 허위·과장, 법적 제재 가능 문구 사용 금지
- 모바일 환경에 최적화된 문구 사용

###광고목적
{{광고목적프롬프트}}

###출력형식
\`\`\`json
[
{
"mainText": "<메인1>",
"subText": "<서브1>"
},
{
"mainText": "<메인2>", 
"subText": "<서브2>"
},
{
"mainText": "<메인3>",
"subText": "<서브3>"
}
]
\`\`\``,

  social: `###지시사항
입력된 **브랜드·제품 정보**를 기반으로 
1) 타겟 고객의 니즈를 자극하고 
2) 브랜드/제품의 핵심 가치를 전달하며 
3) 관심을 유도해 행동으로 이어지도록 설계한 **소셜미디어 리드 광고 문구**를 작성하십시오. 

###작성절차
1. **키 메시지 추출** 
- 입력 정보에서 핵심 가치·문제 해결 포인트 추출.
2. **타겟 공감 포인트 선정** 
- 타겟의 Pain Point ↔ Benefit 매핑.
3. **카피라이팅(fullText)** 
- **70 – 90자**(공백 포함), 모바일에서 읽기 쉬운 자연스러운 톤. 
- 관심 유도·행동 촉구(문의·구매 직접 언급 대신 *알아보기·참여해보기* 등). 
- 필요 시 해시태그 활용(#브랜드명 #키워드).
4. **검증 & 금칙어 필터링** 
- 금지어('무료'·'최고'·'100%'·'완전' 등) 및 특수문자 제외. 
- 허위·과장·법적 리스크 문구 제거.
5. **출력 JSON 생성** 
- 아래 스키마 준수. **70자 미만·90자 초과 시 오류 반환.**

###조건
- **fullText**: 공백 포함 **70 – 90자** 
- 금지어: '무료', '공짜', '100%', '최고', '최대', '완전', '절대' 등 과장 표현과 특수문자 
- 클릭 유도이지만 *문의·구매* 직접 호소보다는 **호기심·행동 유도(agenda-setting)** 표현 사용 
- 감정적 어필 + 합리적 근거의 균형 유지 
- 모바일 환경(첫 줄 가독성, 이모지 남용 금지)에 최적화

###광고목적
{{광고목적프롬프트}}

###출력형식
\`\`\`json
[
{ "fullText": "<문구1>" },
{ "fullText": "<문구2>" },
{ "fullText": "<문구3>" }
]
\`\`\``,

  landing: `###지시사항
입력된 **브랜드·제품 정보**를 기반으로 
1) 방문자의 즉각적인 관심을 사로잡고 
2) 브랜드/제품의 핵심 가치를 명확히 전달하며 
3) 행동을 유도(스크롤·버튼 클릭 등)하는 **랜딩페이지 훅 문구**를 작성하십시오.

###작성절차
1. **키 메시지 추출** 
- 입력 정보에서 핵심 가치·주요 문제 해결 포인트 추출.
2. **타겟 공감 포인트 선정** 
- 타겟의 Pain Point ↔ Benefit 매핑.
3. **카피라이팅(fullText)** 
- **60 – 100자**(공백 포함), 모바일·PC 모두 가독성이 높은 자연스러운 톤. 
- 첫 1-2구(또는 줄)가 강력한 인상·가치 제안. 
- 직접 '구매·문의' 대신 **"지금 확인", "더 알아보기"** 등 관심·행동 유도. 
- 해시태그·이모지는 필요 시 1-2개 이내 사용. 
4. **소구점별 변주** 
- **question** : 의문·호기심 유발(예: "하루 중 가장 건조한 시간은?"). 
- **pain** : 불편·고충 공감(예: "엑셀 반복 작업, 아직도 수작업?"). 
- **stats** : 데이터·수치 제시(예: "습도 10%↓ 땐 바이러스 3배↑"). 
- **emotion** : 감성·스토리텔링(예: "야근 없는 팀을 위해 AI가 돕습니다"). 
5. **검증 & 금칙어 필터링** 
- 과장·허위·법적 리스크 및 금지어('무료', '최고', '100%', '완전', '절대' 등) 제거. 
6. **출력 JSON 생성** 
- 아래 스키마 준수. **60자 미만·100자 초과 시 오류 반환.**

###조건
- **fullText**: 공백 포함 **60 – 100자** 
- 금지어: '무료', '공짜', '100%', '최고', '최대', '완전', '절대' 등 과장 표현·특수문자 
- 직접 '구매·문의' 강요 대신 **관심·행동 유도(agenda-setting)** 표현 사용 
- 가치 제안·CTA·페인 해결 요소를 한 문장 안에 포함 
- 모바일/데스크톱 모두 가독성을 고려해 줄바꿈(\\n) 0-2회 이내 활용 가능

###광고목적
{{광고목적프롬프트}}

###출력형식
\`\`\`json
[
{ "type": "question", "fullText": "<문구1>" },
{ "type": "pain", "fullText": "<문구2>" },
{ "type": "stats", "fullText": "<문구3>" },
{ "type": "emotion", "fullText": "<문구4>" }
]
\`\`\``
};

// 광고목적별 프롬프트 템플릿
const PURPOSE_PROMPTS = {
  '리드 확보': `-광고목적: 리드 확보
-제목·설명은 '지금 문의'·'바로 구매' 보다는 관심 유도형 문구 사용(예: "궁금하다면?", "더 알아보기").
-사용자 행동 목표: 추가 정보 확인·뉴스레터 구독·가벼운 참여.
-문제 인식 → 해결 실마리 제시(agenda-setting) 순으로 서술.`,

  '브랜드 인지도': `-광고목적: 브랜드 인지도 상승
-브랜드명·핵심 슬로건을 반드시 1회 이상 포함.
-감성 키워드·스토리텔링으로 기억에 남는 인상 형성.
-클릭 유도는 '더 보기', '스토리 확인' 등 브랜드 경험 확장 형태로.`,

  '클릭 유도': `-광고목적: 클릭 유도
-제목·설명 모두 행동 동사로 시작(예: "지금 확인", "새롭게 만나기").
-궁금증·호기심을 자극하는 질문형·미완결형 문구 활용.
-CTA 는 "자세히 보기", "더 알아보기" 등.`,

  '전환 증대': `-광고목적: 전환 증대
-제품 사용 후 구체적 이점/결과 수치 제시(과장 금지).
-신뢰 요소(고객 사례·검증 포인트)를 한 문장에 삽입.
-CTA 는 "지금 시작", "사용해 보기" 등 즉시 행동 강조.`,

  '상품 판매': `-광고목적: 상품 판매
-주요 기능‧혜택 → 구매 이득 순으로 배치.
-'특별가', '한정' 등 가격·재고 표현은 금지어 없는 선에서 최소화.
-CTA 는 "장바구니 담기", "구매하러 가기" 등 명확한 구매 행위 유도.`,

  '회원 가입': `-광고목적: 회원 가입
-가입 혜택(포인트, 전용 콘텐츠 등) 1-2가지 구체적 제시.
-진입 장벽이 낮음을 강조("1분 만에 완료", "간편 시작").
-CTA 는 "회원 되기", "지금 가입".`
};

export function generatePrompt(mediaType: MediaType, formData: FormData): string {
  // 매체별 프롬프트 가져오기
  const mediaPrompt = MEDIA_PROMPTS[mediaType];
  if (!mediaPrompt) {
    throw new Error(`Unsupported media type: ${mediaType}`);
  }

  // 광고목적별 프롬프트 가져오기
  const purposePrompt = PURPOSE_PROMPTS[formData.purpose as keyof typeof PURPOSE_PROMPTS];
  if (!purposePrompt) {
    throw new Error(`Unsupported purpose: ${formData.purpose}`);
  }

  // 광고목적 프롬프트를 매체 프롬프트에 삽입
  let combinedPrompt = mediaPrompt.replace('{{광고목적프롬프트}}', purposePrompt);

  // 사용자 입력 데이터 삽입
  const replacements = {
    '{{업종/서비스}}': formData.industry || '',
    '{{브랜드명}}': formData.brandName || '',
    '{{제품명/서비스명}}': (formData as any).productService || '',
    '{{타겟고객}}': formData.targetAudience || '',
    '{{문구스타일}}': formData.tone || '',
    '{{주요혜택/USP}}': formData.mainBenefit || '',
    '{{금기문구}}': formData.prohibitedWords || '',
    '{{제목키워드}}': (formData as NaverFormData).titleKeywords || '',
    '{{설명강조점}}': (formData as NaverFormData).descriptionFocus || ''
  };

  // 모든 플레이스홀더 교체
  Object.entries(replacements).forEach(([placeholder, value]) => {
    combinedPrompt = combinedPrompt.replace(new RegExp(placeholder, 'g'), value);
  });

  // 매체별 추가 정보 삽입
  combinedPrompt += getMediaSpecificInfo(mediaType, formData);

  return combinedPrompt;
}

function getMediaSpecificInfo(mediaType: MediaType, formData: FormData): string {
  let additionalInfo = `

###업종/서비스
${formData.industry}
###브랜드명
${formData.brandName}
###제품명/서비스명
${(formData as any).productService || ''}
###타겟고객
${formData.targetAudience}
###문구스타일
${formData.tone}
###주요혜택/USP
${formData.mainBenefit || ''}
###금기문구
${formData.prohibitedWords || ''}`;

  switch (mediaType) {
    case 'naver':
      const naverData = formData as NaverFormData;
      additionalInfo += `
###제목키워드
${naverData.titleKeywords || ''}
###설명강조점
${naverData.descriptionFocus || ''}`;
      break;
    case 'kakao':
      const kakaoData = formData as KakaoFormData;
      additionalInfo += `
###메인키메시지
${kakaoData.mainMessage || ''}
###서브정보
${kakaoData.subInfo || ''}`;
      break;
    case 'social':
      const socialData = formData as SocialFormData;
      additionalInfo += `
###공감유도요소
${socialData.empathyElement || ''}
###CTA강도
${socialData.ctaStrength || ''}`;
      break;
    case 'landing':
      const landingData = formData as LandingFormData;
      additionalInfo += `
###후킹유형
${landingData.hookType || ''}`;
      break;
  }

  return additionalInfo;
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
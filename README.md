# AI 광고 문구 추천 시스템

OpenAI GPT-4.1 API를 연동하여 매체별 가이드라인에 맞는 효과적인 광고 문구를 자동으로 생성하는 시스템입니다.

## 🚀 주요 기능

### 지원 매체
- **네이버 배너**: 제목(1-15자) + 설명(20-45자)
- **카카오 비즈보드**: 메인(13자) + 서브(17자)
- **인스타/페북 리드문**: 공감형 장문 광고
- **상세페이지**: 후킹 멘트 생성

### 핵심 특징
- 매체별 가이드라인 자동 준수
- 실시간 유효성 검증
- 다양한 문구 스타일 지원
- 원클릭 복사 기능
- 반응형 웹 디자인

## 📋 사용법

### 1. 환경 설정
```bash
# 의존성 설치
npm install

# 환경변수 설정
cp env.example .env.local
# .env.local 파일에 OpenAI API 키 입력
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. 개발 서버 실행
```bash
npm run dev
# http://localhost:3000 에서 확인
```

### 3. 빌드 및 배포
```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

## 🛠 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4.1 API
- **배포**: Vercel (권장)

## 📊 매체별 가이드라인

### 네이버 배너
- 제목: 1-15자 (임팩트 있게)
- 설명: 20-45자 (구체적 혜택 포함)
- 업체명/브랜드명 필수
- 허위·과장 표현 금지

### 카카오 비즈보드
- 메인: 13자 이내
- 서브: 17자 이내
- 특수문자 사용 금지
- 브랜드 표기 필수

### 인스타/페북 리드문
- 공감 유도 첫 문장
- 구체적 수치/감정 자극
- 명확한 CTA 포함
- 100자 내외 권장

### 상세페이지 후킹
- 강력한 첫인상
- 문제/니즈 직접 언급
- 감정적 어필
- 구체적 해결책 제시

## 🔧 API 엔드포인트

### POST /api/generate-copy
광고 문구 생성 요청

**요청 본문:**
```json
{
  "mediaType": "naver|kakao|social|landing",
  "formData": {
    "purpose": "광고 목적",
    "industry": "업종",
    "brandName": "브랜드명",
    "targetAudience": "타겟 고객",
    "tone": "문구 스타일",
    "mainBenefit": "주요 혜택 (선택)",
    "prohibitedWords": "금기 문구 (선택)"
  }
}
```

**응답:**
```json
{
  "copies": [
    {
      "title": "제목",
      "description": "설명"
    }
  ],
  "mediaType": "naver",
  "isValid": true,
  "validationErrors": []
}
```

## 🚀 Vercel 배포

### 1. Vercel CLI 설치
```bash
npm i -g vercel
```

### 2. 배포
```bash
vercel
```

### 3. 환경변수 설정
Vercel 대시보드에서 환경변수 설정:
- `OPENAI_API_KEY`: OpenAI API 키

## 📝 사용 예시

1. **매체 선택**: 네이버 배너 선택
2. **기본 정보 입력**:
   - 광고 목적: 리드 확보
   - 업종: 뷰티
   - 브랜드명: 뷰티샵
   - 타겟: 20-30대 여성
   - 스타일: 친근
3. **추가 옵션**:
   - 제목 키워드: 스킨케어
   - 주요 혜택: 30% 할인
4. **생성 결과**:
   - 제목: "뷰티샵 스킨케어" (10자)
   - 설명: "20-30대 맞춤 스킨케어 30% 특가, 지금 바로 확인하세요" (35자)

## 🔍 검증 규칙

시스템은 다음 규칙을 자동으로 검증합니다:

- 글자수 제한 준수
- 금지 단어 사용 여부
- 매체별 특수 규칙 (특수문자 등)
- 필수 요소 포함 여부

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스하에 있습니다.

## 💡 팁

- OpenAI API 사용량을 모니터링하세요
- 생성된 문구는 추가 수정하여 사용하는 것을 권장합니다
- A/B 테스트를 통해 효과를 검증하세요
- 매체별 최신 가이드라인을 정기적으로 확인하세요 
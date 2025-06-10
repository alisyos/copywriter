import React, { useState } from 'react';
import { MediaType, FormData, NaverFormData, KakaoFormData, SocialFormData, LandingFormData } from '../types';

interface Props {
  onSubmit: (mediaType: MediaType, formData: FormData) => void;
  isLoading: boolean;
}

const MEDIA_OPTIONS = [
  { value: 'naver', label: '네이버 배너' },
  { value: 'kakao', label: '카카오 비즈보드' },
  { value: 'social', label: '인스타/페북 리드문' },
  { value: 'landing', label: '상세페이지 후킹' },
];

const PURPOSE_OPTIONS = [
  '리드 확보', '브랜드 인지도', '클릭 유도', '전환 증대', '상품 판매', '회원 가입'
];

const INDUSTRY_OPTIONS = [
  '뷰티', '교육', 'IT/SaaS', '헬스케어', '패션', '식품', '금융', '부동산', '여행', '기타'
];

const TONE_OPTIONS = [
  '포멀', '친근', '유머', '신뢰감', '임팩트', '감성적', '전문적', '캐주얼'
];

const inputClassName = "w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md";
const labelClassName = "block text-sm font-semibold text-slate-700 mb-3";

export default function CopyForm({ onSubmit, isLoading }: Props) {
  const [mediaType, setMediaType] = useState<MediaType>('naver');
  const [formData, setFormData] = useState<FormData>({
    purpose: '',
    industry: '',
    brandName: '',
    targetAudience: '',
    tone: '',
    mainBenefit: '',
    prohibitedWords: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(mediaType, formData);
  };

  const renderMediaSpecificFields = () => {
    switch (mediaType) {
      case 'naver':
        return (
          <>
            <div>
              <label className={labelClassName}>
                제목 키워드 (선택)
              </label>
              <input
                type="text"
                className={inputClassName}
                placeholder="제목에 포함할 키워드"
                value={(formData as NaverFormData).titleKeywords || ''}
                onChange={(e) => handleInputChange('titleKeywords', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClassName}>
                설명 강조점 (선택)
              </label>
              <input
                type="text"
                className={inputClassName}
                placeholder="설명에서 강조할 내용"
                value={(formData as NaverFormData).descriptionFocus || ''}
                onChange={(e) => handleInputChange('descriptionFocus', e.target.value)}
              />
            </div>
          </>
        );
      case 'kakao':
        return (
          <>
            <div>
              <label className={labelClassName}>
                메인 키 메시지 (선택)
              </label>
              <input
                type="text"
                className={inputClassName}
                placeholder="메인 텍스트의 핵심 메시지"
                value={(formData as KakaoFormData).mainMessage || ''}
                onChange={(e) => handleInputChange('mainMessage', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClassName}>
                서브 정보 (선택)
              </label>
              <input
                type="text"
                className={inputClassName}
                placeholder="서브 텍스트에 포함할 정보"
                value={(formData as KakaoFormData).subInfo || ''}
                onChange={(e) => handleInputChange('subInfo', e.target.value)}
              />
            </div>
          </>
        );
      case 'social':
        return (
          <>
            <div>
              <label className={labelClassName}>
                공감 유도 요소 (선택)
              </label>
              <input
                type="text"
                className={inputClassName}
                placeholder="타겟이 공감할만한 상황이나 감정"
                value={(formData as SocialFormData).empathyElement || ''}
                onChange={(e) => handleInputChange('empathyElement', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClassName}>
                CTA 강도 (선택)
              </label>
              <input
                type="text"
                className={inputClassName}
                placeholder="강함, 보통, 부드러움"
                value={(formData as SocialFormData).ctaStrength || ''}
                onChange={(e) => handleInputChange('ctaStrength', e.target.value)}
              />
            </div>
          </>
        );
      case 'landing':
        return (
          <div>
            <label className={labelClassName}>
              후킹 유형 (선택)
            </label>
            <select
              className={inputClassName}
              value={(formData as LandingFormData).hookType || ''}
              onChange={(e) => handleInputChange('hookType', e.target.value)}
            >
              <option value="">선택하세요</option>
              <option value="문제해결">문제 해결형</option>
              <option value="혜택강조">혜택 강조형</option>
              <option value="감정자극">감정 자극형</option>
              <option value="호기심유발">호기심 유발형</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/40">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">광고 문구 생성</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 매체 선택 */}
        <div>
          <label className={labelClassName}>
            매체 선택 *
          </label>
          <select
            className={inputClassName}
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value as MediaType)}
            required
          >
            {MEDIA_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 공통 필드들 */}
        <div>
          <label className={labelClassName}>
            광고 목적 *
          </label>
          <select
            className={inputClassName}
            value={formData.purpose}
            onChange={(e) => handleInputChange('purpose', e.target.value)}
            required
          >
            <option value="">선택하세요</option>
            {PURPOSE_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClassName}>
            업종/서비스 *
          </label>
          <select
            className={inputClassName}
            value={formData.industry}
            onChange={(e) => handleInputChange('industry', e.target.value)}
            required
          >
            <option value="">선택하세요</option>
            {INDUSTRY_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClassName}>
            브랜드명 *
          </label>
          <input
            type="text"
            className={inputClassName}
            placeholder="브랜드 또는 서비스명"
            value={formData.brandName}
            onChange={(e) => handleInputChange('brandName', e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClassName}>
            타겟 고객 *
          </label>
          <input
            type="text"
            className={inputClassName}
            placeholder="예: 20-30대 직장인 여성"
            value={formData.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClassName}>
            문구 스타일 *
          </label>
          <select
            className={inputClassName}
            value={formData.tone}
            onChange={(e) => handleInputChange('tone', e.target.value)}
            required
          >
            <option value="">선택하세요</option>
            {TONE_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClassName}>
            주요 혜택/USP (선택)
          </label>
          <input
            type="text"
            className={inputClassName}
            placeholder="예: 30% 할인, 무료 체험, 빠른 배송"
            value={formData.mainBenefit || ''}
            onChange={(e) => handleInputChange('mainBenefit', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClassName}>
            금기 문구 (선택)
          </label>
          <input
            type="text"
            className={inputClassName}
            placeholder="사용하지 않을 단어나 표현 (쉼표로 구분)"
            value={formData.prohibitedWords || ''}
            onChange={(e) => handleInputChange('prohibitedWords', e.target.value)}
          />
        </div>

        {/* 매체별 특화 필드 */}
        {renderMediaSpecificFields()}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>생성 중...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>광고 문구 생성</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
} 
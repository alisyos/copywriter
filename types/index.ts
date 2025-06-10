export type MediaType = 'naver' | 'kakao' | 'social' | 'landing';

export interface CommonFormData {
  purpose: string;
  industry: string;
  brandName: string;
  targetAudience: string;
  tone: string;
  mainBenefit?: string;
  prohibitedWords?: string;
}

export interface NaverFormData extends CommonFormData {
  titleKeywords?: string;
  descriptionFocus?: string;
}

export interface KakaoFormData extends CommonFormData {
  mainMessage?: string;
  subInfo?: string;
}

export interface SocialFormData extends CommonFormData {
  empathyElement?: string;
  ctaStrength?: string;
}

export interface LandingFormData extends CommonFormData {
  hookType?: string;
}

export type FormData = NaverFormData | KakaoFormData | SocialFormData | LandingFormData;

export interface GeneratedCopy {
  title?: string;
  description?: string;
  mainText?: string;
  subText?: string;
  fullText?: string;
  validationErrors?: string[];
  isValid?: boolean;
}

export interface CopyResult {
  copies: GeneratedCopy[];
  mediaType: MediaType;
  isValid: boolean;
  validationErrors?: string[];
}

export interface MediaGuideline {
  titleMaxLength?: number;
  titleMinLength?: number;
  descriptionMaxLength?: number;
  descriptionMinLength?: number;
  mainMaxLength?: number;
  subMaxLength?: number;
  prohibitedWords: string[];
  requiredElements: string[];
  specialRules: string[];
} 
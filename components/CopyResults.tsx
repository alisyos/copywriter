import React from 'react';
import { CopyResult, MediaType } from '../types';

interface Props {
  result: CopyResult | null;
  error: string | null;
}

export default function CopyResults({ result, error }: Props) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">오류 발생</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const getMediaTypeLabel = (mediaType: MediaType): string => {
    const labels = {
      naver: '네이버 배너 광고',
      kakao: '카카오톡 비즈보드',
      social: '소셜미디어 리드광고',
      landing: '랜딩페이지 훅'
    };
    return labels[mediaType];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('클립보드에 복사되었습니다!');
    });
  };

  const copyAllToClipboard = () => {
    let allText = '';
    
    result.copies.forEach((copy, index) => {
      allText += `${index + 1}. `;
      
      if (result.mediaType === 'naver') {
        allText += `제목: ${copy.title}\n설명: ${copy.description}\n\n`;
      } else if (result.mediaType === 'kakao') {
        allText += `메인: ${copy.mainText}\n서브: ${copy.subText}\n\n`;
      } else {
        allText += `${copy.fullText}\n\n`;
      }
    });
    
    navigator.clipboard.writeText(allText.trim()).then(() => {
      alert('모든 광고 문구가 클립보드에 복사되었습니다!');
    });
  };

  const renderCopyItem = (copy: any, index: number) => {
    const mediaType = result.mediaType;
    
    if (mediaType === 'naver') {
      return (
        <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <h4 className="text-lg font-bold text-slate-800">네이버 배너 광고 문구</h4>
            </div>
            <button
              onClick={() => copyToClipboard(`제목: ${copy.title}\n설명: ${copy.description}`)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 text-sm font-medium flex items-center space-x-2 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>복사</span>
            </button>
          </div>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-blue-700">제목</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                  {copy.title?.length || 0}자
                </span>
              </div>
              <p className="text-slate-800 font-semibold text-lg">{copy.title}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-purple-700">설명</span>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
                  {copy.description?.length || 0}자
                </span>
              </div>
              <p className="text-slate-800 font-medium">{copy.description}</p>
            </div>
            
            {/* 개별 문구 검증 오류 표시 */}
            {copy.validationErrors && copy.validationErrors.length > 0 && (
              <div className="bg-gradient-to-r from-red-50/80 to-pink-50/80 backdrop-blur-sm border border-red-200/60 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-red-700">가이드라인 위반</span>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {copy.validationErrors.map((error: string, errorIndex: number) => (
                    <li key={errorIndex} className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    } else if (mediaType === 'kakao') {
      return (
        <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <h4 className="text-lg font-bold text-slate-800">카카오톡 비즈보드 문구</h4>
            </div>
            <button
              onClick={() => copyToClipboard(`메인: ${copy.mainText}\n서브: ${copy.subText}`)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 text-sm font-medium flex items-center space-x-2 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>복사</span>
            </button>
          </div>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-yellow-50/80 to-orange-50/80 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-yellow-700">메인</span>
                <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full font-medium">
                  {copy.mainText?.length || 0}자
                </span>
              </div>
              <p className="text-slate-800 font-semibold text-lg">{copy.mainText}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-50/80 to-red-50/80 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-orange-700">서브</span>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
                  {copy.subText?.length || 0}자
                </span>
              </div>
              <p className="text-slate-800 font-medium">{copy.subText}</p>
            </div>
            
            {/* 개별 문구 검증 오류 표시 */}
            {copy.validationErrors && copy.validationErrors.length > 0 && (
              <div className="bg-gradient-to-r from-red-50/80 to-pink-50/80 backdrop-blur-sm border border-red-200/60 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-red-700">가이드라인 위반</span>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {copy.validationErrors.map((error: string, errorIndex: number) => (
                    <li key={errorIndex} className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <h4 className="text-lg font-bold text-slate-800">
                {mediaType === 'social' ? '소셜미디어 리드광고 문구' : '랜딩페이지 훅 문구'}
              </h4>
            </div>
            <button
              onClick={() => copyToClipboard(copy.fullText || '')}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200 text-sm font-medium flex items-center space-x-2 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>복사</span>
            </button>
          </div>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50/80 to-teal-50/80 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-green-700">
                  {mediaType === 'social' ? '소셜미디어 리드광고 문구' : '랜딩페이지 훅 문구'}
                </span>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                  {copy.fullText?.length || 0}자
                </span>
              </div>
              <p className="text-slate-800 font-medium leading-relaxed text-lg">{copy.fullText}</p>
            </div>
            
            {/* 개별 문구 검증 오류 표시 */}
            {copy.validationErrors && copy.validationErrors.length > 0 && (
              <div className="bg-gradient-to-r from-red-50/80 to-pink-50/80 backdrop-blur-sm border border-red-200/60 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-red-700">가이드라인 위반</span>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {copy.validationErrors.map((error: string, errorIndex: number) => (
                    <li key={errorIndex} className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더와 생성된 문구들 */}
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              {getMediaTypeLabel(result.mediaType)} 광고 문구
            </h2>
          </div>
          
          {/* 전체 복사 버튼 */}
          <button
            onClick={copyAllToClipboard}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 text-sm font-medium flex items-center space-x-2 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            <span>전체 복사</span>
          </button>
        </div>
        {result.copies.length > 0 ? (
          result.copies.map((copy, index) => renderCopyItem(copy, index))
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-600">생성된 문구가 없습니다. 다른 조건으로 다시 시도해보세요.</p>
          </div>
        )}
      </div>

      {/* 추가 팁 */}
      <div className="bg-gradient-to-r from-slate-50/80 to-gray-50/80 backdrop-blur-sm border border-white/40 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800">활용 팁</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700 font-medium">생성된 문구를 기반으로 추가 수정하여 사용하세요</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700 font-medium">A/B 테스트를 통해 가장 효과적인 문구를 찾아보세요</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700 font-medium">타겟 고객의 반응을 확인하고 지속적으로 개선하세요</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700 font-medium">매체별 가이드라인을 반드시 확인하고 준수하세요</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
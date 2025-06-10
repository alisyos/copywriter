import React, { useState } from 'react';
import Head from 'next/head';
import CopyForm from '../components/CopyForm';
import CopyResults from '../components/CopyResults';
import { MediaType, FormData, CopyResult } from '../types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CopyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (mediaType: MediaType, formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaType, formData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '요청 처리 중 오류가 발생했습니다.');
      }

      const data: CopyResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI 광고 문구 추천 시스템</title>
        <meta name="description" content="OpenAI 기반 매체별 광고 문구 자동 생성 서비스" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* 헤더 */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI 광고 문구 추천 시스템
                  </h1>
                  <p className="text-lg text-slate-600 mt-1">
                    OpenAI 기반으로 매체별 가이드라인에 맞는 효과적인 광고 문구를 생성합니다
                  </p>
                </div>
              </div>
              
              {/* 통계 배지 */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-white/40">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-700">AI 모델 활성화</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-white/40">
                    <span className="text-sm font-medium text-slate-700">4개 매체 지원</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-white/40">
                    <span className="text-sm font-medium text-slate-700">실시간 가이드라인 검증</span>
                  </div>
                </div>
                
                {/* 관리자 링크 */}
                <a
                  href="/admin"
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 text-sm font-medium flex items-center space-x-2 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>프롬프트 관리</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* 폼 영역 */}
            <div className="lg:col-span-2 lg:sticky lg:top-8 lg:h-fit">
              <CopyForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* 결과 영역 */}
            <div className="lg:col-span-3">
              {isLoading && (
                <div className="bg-white/70 backdrop-blur-sm p-12 rounded-2xl shadow-xl border border-white/40 text-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                    <div className="absolute inset-0 rounded-full h-16 w-16 mx-auto bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">AI가 광고 문구를 생성하고 있습니다</h3>
                  <p className="text-slate-600">매체별 가이드라인을 분석하여 최적의 문구를 제안합니다</p>
                  <div className="mt-6 flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              )}
              
              {!isLoading && (result || error) && (
                <CopyResults result={result} error={error} />
              )}
              
              {!isLoading && !result && !error && (
                <div className="bg-white/70 backdrop-blur-sm p-12 rounded-2xl shadow-xl border border-white/40 text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mx-auto flex items-center justify-center">
                      <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    AI 광고 문구 생성을 시작하세요
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    왼쪽 폼을 작성하고 생성 버튼을 클릭하면<br />
                    <span className="font-semibold text-blue-600">AI가 매체별 가이드라인에 맞는</span> 광고 문구를 제안해드립니다
                  </p>
                  <div className="flex justify-center space-x-6 text-sm text-slate-500">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>즉시 생성</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>3개 옵션 제공</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>원클릭 복사</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* 푸터 */}
        <footer className="bg-white/60 backdrop-blur-sm border-t border-white/30 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex justify-center items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-lg font-medium bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent">
                  매체별 광고 가이드라인을 준수하는 AI 광고 문구 생성 서비스
                </p>
              </div>
                             <div className="flex justify-center items-center space-x-2 text-sm text-slate-500">
                 <span>Powered by</span>
                 <span className="font-semibold text-blue-600">OpenAI GPT-4.1</span>
                 <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                 <span className="text-xs">© 2025</span>
               </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
} 
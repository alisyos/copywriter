import { useState, useEffect } from 'react';
import { MediaType } from '../types';

const MEDIA_TYPE_LABELS = {
  naver: '네이버 배너 광고',
  kakao: '카카오톡 비즈보드',
  social: '소셜미디어 리드광고',
  landing: '랜딩페이지 훅'
};

const PURPOSE_TYPE_LABELS = {
  '리드 확보': '리드 확보',
  '브랜드 인지도': '브랜드 인지도',
  '클릭 유도': '클릭 유도',
  '전환 증대': '전환 증대',
  '상품 판매': '상품 판매',
  '회원 가입': '회원 가입'
};

interface MediaPrompts {
  [key: string]: string;
}

interface PurposePrompts {
  [key: string]: string;
}

interface PromptsData {
  media: MediaPrompts;
  purpose: PurposePrompts;
}

export default function AdminPage() {
  const [prompts, setPrompts] = useState<PromptsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'media' | 'purpose'>('media');
  const [activeTab, setActiveTab] = useState<string>('naver');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 프롬프트 데이터 로드
  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const response = await fetch('/api/admin/prompts');
      if (response.ok) {
        const data = await response.json();
        setPrompts(data);
      } else {
        throw new Error('프롬프트 데이터를 불러올 수 없습니다.');
      }
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : '데이터 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  const savePrompts = async () => {
    if (!prompts) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompts }),
      });

      if (response.ok) {
        showMessage('success', '프롬프트가 성공적으로 저장되었습니다.');
      } else {
        throw new Error('저장에 실패했습니다.');
      }
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : '저장 실패');
    } finally {
      setSaving(false);
    }
  };

  const updatePrompt = (section: 'media' | 'purpose', key: string, value: string) => {
    if (!prompts) return;

    setPrompts({
      ...prompts,
      [section]: {
        ...prompts[section],
        [key]: value
      }
    });
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const resetToDefaults = () => {
    if (confirm('모든 프롬프트를 기본값으로 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      // 기본 프롬프트로 리셋하는 API 호출
      fetch('/api/admin/prompts/reset', { method: 'POST' })
        .then(() => {
          showMessage('success', '프롬프트가 기본값으로 초기화되었습니다.');
          loadPrompts();
        })
        .catch(() => showMessage('error', '초기화에 실패했습니다.'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="text-lg font-medium text-slate-700">로딩 중...</span>
        </div>
      </div>
    );
  }

  const currentLabels = activeSection === 'media' ? MEDIA_TYPE_LABELS : PURPOSE_TYPE_LABELS;
  const currentPrompts = prompts?.[activeSection] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 헤더 */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/40 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  시스템 프롬프트 관리
                </h1>
                <p className="text-slate-600 mt-1">매체별 4개 + 광고목적별 6개 프롬프트를 관리하세요</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetToDefaults}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 text-sm font-medium flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>초기화</span>
              </button>
              <a
                href="/"
                className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-4 py-2 rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all duration-200 text-sm font-medium flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>메인으로</span>
              </a>
              <button
                onClick={savePrompts}
                disabled={saving}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 text-sm font-medium flex items-center space-x-2 shadow-lg disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>저장 중...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>저장</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메시지 알림 */}
      {message && (
        <div className={`fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
          message.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 섹션 선택 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/40 mb-8">
          <div className="flex space-x-1 bg-slate-100/80 rounded-xl p-1 max-w-md">
            <button
              onClick={() => {
                setActiveSection('media');
                setActiveTab('naver');
              }}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSection === 'media'
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-white/50'
              }`}
            >
              매체별 프롬프트 (4개)
            </button>
            <button
              onClick={() => {
                setActiveSection('purpose');
                setActiveTab('리드 확보');
              }}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSection === 'purpose'
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-white/50'
              }`}
            >
              광고목적별 프롬프트 (6개)
            </button>
          </div>
        </div>

        {/* 하위 탭 네비게이션 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/40 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 bg-slate-100/80 rounded-xl p-1">
            {Object.entries(currentLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === key
                    ? 'bg-white text-indigo-600 shadow-md'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-white/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 프롬프트 편집 영역 */}
        {prompts && currentPrompts[activeTab] !== undefined && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/40 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {(currentLabels as any)[activeTab]} 프롬프트
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    {activeSection === 'media' ? '매체별' : '광고목적별'} 프롬프트를 수정하세요
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* 프롬프트 내용 */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {activeSection === 'media' ? '매체별' : '광고목적별'} 프롬프트
                  </label>
                  <textarea
                    value={currentPrompts[activeTab] || ''}
                    onChange={(e) => updatePrompt(activeSection, activeTab, e.target.value)}
                    rows={25}
                    className="w-full px-4 py-3 bg-white/70 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-800 placeholder-slate-400 font-mono text-sm leading-relaxed"
                    placeholder="프롬프트를 입력하세요"
                  />
                </div>

                {/* 문자 수 표시 */}
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span>총 {(currentPrompts[activeTab] || '').length}자</span>
                  <div className="flex items-center space-x-4">
                    <span>라인 수: {(currentPrompts[activeTab] || '').split('\n').length}</span>
                    <span>단어 수: {(currentPrompts[activeTab] || '').split(/\s+/).filter(word => word.length > 0).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 사용 팁 */}
        <div className="mt-8 bg-gradient-to-r from-slate-50/80 to-gray-50/80 backdrop-blur-sm border border-white/40 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">프롬프트 작성 가이드</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-700">📝 매체별 프롬프트</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• 매체의 기술적 제약사항 포함 (글자 수 등)</li>
                <li>• JSON 출력 형식 명시</li>
                <li>• 매체별 특화된 작성 절차 설명</li>
                <li>• {`{{광고목적프롬프트}}`} 플레이스홀더 필수 포함</li>
                <li>• 사용자 입력 플레이스홀더 활용</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-slate-700">🎯 광고목적별 프롬프트</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• 목적에 맞는 구체적 전략 제시</li>
                <li>• CTA 스타일 가이드라인 포함</li>
                <li>• 타겟 행동 목표 명시</li>
                <li>• 문구 톤앤매너 방향성 제시</li>
                <li>• 성과 측정 관점 고려</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50/80 rounded-xl border border-blue-200/60">
            <h4 className="font-bold text-blue-800 mb-2">💡 프롬프트 조합 방식</h4>
                         <p className="text-sm text-blue-700">
               매체별 프롬프트에서 {`{{광고목적프롬프트}}`} 부분이 선택된 광고목적별 프롬프트로 자동 치환됩니다. 
               이를 통해 매체 특성과 광고 목적이 모두 반영된 맞춤형 프롬프트가 생성됩니다.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
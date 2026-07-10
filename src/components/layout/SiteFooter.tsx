/**
 * 앱 하단 저작권 푸터. 콘텐츠와 여백을 두고 페이지 최하단에 위치.
 * 모바일 하단 탭바에 가리지 않도록 하단 패딩을 넉넉히 둔다.
 */
export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-[var(--border)] px-4 py-6 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] sm:px-6 lg:px-8 lg:pb-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 text-center">
        <p className="text-[13px] text-[var(--text-subtle)]">
          © 2026 Paddock Korea. All rights reserved.
        </p>
        <p className="text-[12px] text-[var(--text-faint)]">
          비공식 팬 프로젝트입니다. FIA · Formula 1 및 각 팀·드라이버와 관련이 없습니다.
        </p>
      </div>
    </footer>
  );
}

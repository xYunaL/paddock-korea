/**
 * 커뮤니티 이용약관 및 가이드라인.
 * 문구를 수정할 경우 TERMS_VERSION을 올리면(예: "1.1") 재동의 기반을 만들 수 있다.
 */
export const TERMS_VERSION = "1.0";

export function TermsContent() {
  return (
    <div className="space-y-4 text-[13px] leading-relaxed text-[var(--text-muted)]">
      <p>
        패독 코리아(이하 &lsquo;커뮤니티&rsquo;)는 모든 F1 팬이 건전하고 즐겁게
        소통할 수 있는 공간을 지향합니다. 원활한 커뮤니티 운영을 위해 이용자께서는
        아래 규칙을 준수해 주시기 바라며, 본 서비스를 이용함으로써 아래 내용에
        동의한 것으로 간주합니다.
      </p>

      <section>
        <h4 className="text-sm font-semibold text-[var(--text)]">
          제1조 (커뮤니티 이용 규칙)
        </h4>
        <ol className="mt-2 space-y-2.5">
          <li>
            <span className="font-medium text-[var(--text)]">
              ① 상호 존중 및 비방 금지
            </span>
            <br />
            특정 이용자·팀·드라이버를 향한 모욕, 욕설, 인신공격성 발언을 엄격히
            금지합니다. 모터스포츠에 대한 정당한 비판을 넘어선 무분별한 비난이나
            비하 표현은 제재 대상이 됩니다.
          </li>
          <li>
            <span className="font-medium text-[var(--text)]">
              ② 도배 및 도배성 게시물 금지
            </span>
            <br />
            동일하거나 유사한 글·댓글의 반복 게시(도배), 의미 없는 문자열 나열 등
            게시판의 정상적인 이용을 방해하는 행위를 금지합니다.
          </li>
          <li>
            <span className="font-medium text-[var(--text)]">
              ③ F1 및 모터스포츠 주제 준수
            </span>
            <br />
            본 커뮤니티는 F1을 비롯한 모터스포츠 중심의 공간입니다. 주제와 무관한
            정치·종교·홍보·광고성 게시물 및 스팸 링크는 예고 없이 삭제될 수
            있습니다.
          </li>
        </ol>
      </section>

      <section>
        <h4 className="text-sm font-semibold text-[var(--text)]">
          제2조 (위반 시 조치)
        </h4>
        <p className="mt-2">
          위 규칙을 위반할 경우, 건전한 커뮤니티 환경 조성을 위하여 운영자의
          판단에 따라 게시물 삭제, 서비스 이용 제한, 계정 영구 정지 등의 조치가
          사전 경고 없이 취해질 수 있습니다.
        </p>
      </section>

      <section>
        <h4 className="text-sm font-semibold text-[var(--text)]">부칙</h4>
        <p className="mt-2">
          본 약관은 커뮤니티 가입 시점부터 적용됩니다. (버전 {TERMS_VERSION})
        </p>
      </section>
    </div>
  );
}

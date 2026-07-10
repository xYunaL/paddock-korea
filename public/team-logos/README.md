# 팀 커스텀 로고 (helmet icons)

여기에 직접 생성한 **오리지널 헬멧 로고 PNG**(투명 배경 권장)를 넣습니다.
파일명은 각 팀의 `id`와 정확히 일치해야 합니다 (`src/lib/teams.ts` 참고).

| 파일명 | 팀 |
|---|---|
| `mclaren.png` | McLaren |
| `mercedes.png` | Mercedes |
| `redbull.png` | Red Bull |
| `ferrari.png` | Ferrari |
| `williams.png` | Williams |
| `racingbulls.png` | Racing Bulls |
| `astonmartin.png` | Aston Martin |
| `haas.png` | Haas |
| `audi.png` | Audi |
| `alpine.png` | Alpine |
| `cadillac.png` | Cadillac |

## 활성화 방법
1. 위 11개 PNG를 이 폴더에 저장 (정사각 1:1, 512px+ 권장, 투명 배경).
2. `src/lib/teams.ts`의 `TEAM_LOGOS_ENABLED` 를 `true` 로 변경.
3. 끝. 사이드바 프로필·응원 패널/랭킹·게시판 팀 탭·밈 작성자·온보딩 팀 선택에
   자동 반영됩니다. 이미지 로드 실패 시 자동으로 이모지로 폴백합니다.

> 무늬는 반드시 창작한 오리지널이어야 합니다 (실제 드라이버 헬멧 도색을 옮기지 말 것).

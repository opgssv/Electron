# Video Downloader Project Handoff

## 1. 프로젝트 개요
브라우저 확장(Edge Extension)에서 동영상을 탐지하고, 이를 Electron 데스크톱 앱으로 전송하여 `yt-dlp` 엔진으로 다운로드 및 병합(HLS)하는 하이브리드 비디오 다운로더 시스템입니다.

## 2. 기술 스택
- **데스크톱 앱**: Electron + React + TypeScript + Webpack
- **동영상 엔진**: `yt-dlp` (분석/다운로드), `ffmpeg` (병합)
- **브라우저 확장**: Manifest V3 기반 Edge Extension
- **통신**: 로컬 HTTP 서버 (Port 8888) 및 IPC (Main-Renderer)

## 3. 구현 완료된 기능 (Work Done)
### 앱 (Electron)
- **분석 기능**: `yt-dlp` 연동, 도메인 정규화(missav, mingky 등), Referer/Origin 동적 동기화.
- **다운로드 기능**: 실시간 진행률(%), 속도, ETA 표시 및 HLS 전체 용량 실시간 파싱.
- **쿠키 우회**: 엣지 브라우저 실행 중에도 쿠키를 읽을 수 있도록 시스템 레벨 파일 복사 로직 적용.
- **UI/UX**: 다운로드 큐(Queue) 분리, 개별/전체 삭제 기능, 엔터 키 연동, 다운로드 경로 변경 및 저장 기능.
- **안정성**: `taskkill`을 이용한 확실한 다운로드 취소 및 프로세스 정리.
- **로컬 서버**: 확장에서 보낸 URL을 받기 위한 `http://127.0.0.1:8888/send-url` 서버 구축.
- **빌드**: `npm run make`를 통해 설치 파일(Setup.exe) 생성 완료 (`out/make` 폴더).

### 확장 (Edge Extension)
- **기본 구조**: `manifest.json`, `background.js`, `popup.html`, `popup.js` 구성.
- **통신 로직**: 현재 페이지 URL을 앱의 로컬 서버로 POST 요청하는 기능.
- **스니핑 강화**: `background.js`에서 `.m3u8`, `.mp4` 주소를 가로채어 탭별로 `chrome.storage.local`에 저장.
- **UI 고도화**: 팝업에서 탐지된 URL 목록을 시각적으로 보여주고, 선택하여 앱으로 전송하는 기능 추가.
- **연결 해결**: `webRequest` 권한 및 `localhost` 호스트 권한 추가를 통해 "App not running" 오류 해결.
- **배포**: `extension_dist.zip`으로 패키징 완료.

### 문서화
- **GUIDE.md**: 앱 실행, 확장 프로그램 설치 및 사용 방법에 대한 국문 가이드 작성 완료.

## 4. 현재 해결해야 할 이슈 (Pending Issues)
- **앱-확장 연동 테스트**: 실제 환경에서 확장에서 버튼 클릭 시 앱이 즉시 반응(Focus)하고 분석을 시작하는지 최종 검증 필요 (코드상으로는 구현 완료).

## 5. 최종 결과물 위치
- **사용자 가이드**: `GUIDE.md`
- **확장 프로그램 패키지**: `extension_dist.zip`
- **앱 설치 파일**: `out/make/squirrel.windows/x64/video-downloader-app-1.0.0 Setup.exe`

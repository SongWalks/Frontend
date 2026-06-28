# 🚑 수강구조대 Frontend

수강구조대 프론트엔드 레포지토리에 오신 것을 환영합니다! 
프로젝트를 로컬 환경에 세팅하고 실행하기 위한 가이드입니다.


## ⚙️ 시작하기 전에 (Prerequisites)

* **Node.js**가 설치되어 있어야 한다.
* 일관된 코드 스타일을 위해 아래 VS Code 확장 프로그램(Extensions)을 반드시 설치해 주세요.
  1. `ESLint`
  2. `Prettier - Code formatter`

*(설치 후 VS Code 설정(`Ctrl` + `,`)에서 `Editor: Format On Save`를 체크하고, `default formatter`를 `Prettier - Code formatter`로 설정해 주세요.)*

---

## 🚀 로컬 실행 가이드 (Getting Started)

**1. 레포지토리 클론 및 폴더 이동**


터미널을 열고 작업할 폴더에서 레포지토리를 클론한 뒤, 프론트엔드 폴더로 이동한다.
```bash
git clone [여기에 깃허브 레포지토리 링크 입력]
cd Frontend
```

**2. 패키지 설치 및 환경 세팅**
```bash
npm install
```
`package.json`에 명시된 모든 라이브러리가 설치되며, 코드 컨벤션을 강제하는 Husky (git pre-commit hook)도 자동으로 연결된다.

**3. 로컬 서버 실행**
```bash
npm run dev
```
명령어 실행 후 터미널에 나타나는 http://localhost:5173/ 링크를 `Ctrl` + `클릭`하여 브라우저에서 화면이 정상적으로 뜨는지 확인한다.

---

## 🌿 협업 규칙 및 브랜치 전략

- 메인 브랜치: `main`
- 작업 브랜치: `타입/#이슈번호-작업내용` 형식의 브랜치명으로 생성

  (ex: feature/#1-mypage, fix/#10-UIFix 등)
- 커밋 규칙: 깃허브에 Push한 뒤, `main` 브랜치로 PR 생성 (*Notion의 컨벤션 준수해 주세요.*)
- 보호 규칙: `main`에 직접 Merge 불가

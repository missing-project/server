## Missing_server

### 실행방법

- yarn install(npm install 하시면 안됩니다)
- .env 파일 생성 및 변수 선언<br/>
  PORT / MONGODB_URL
- yarn dev

### 폴더구조

- model / service / controller 3계층 구조<br/>
  [참고 사이트](https://velog.io/@hopsprings2/%EA%B2%AC%EA%B3%A0%ED%95%9C-node.js-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%95%84%ED%82%A4%ED%85%8D%EC%B3%90-%EC%84%A4%EA%B3%84%ED%95%98%EA%B8%B0#%ED%8F%B4%EB%8D%94-%EA%B5%AC%EC%A1%B0-)
- 최대한 기능별 모듈화를 중요하게 생각하여 나누었습니다.<br/>
- 불필요한 코드 반복을 지양합니다.

### stack

- typescript<br/>
  [컴파일 옵션별 설명 링크](https://geonlee.tistory.com/214)
- mongoose

### Git

- git rebase 필수: 히스토리 관리를 위해서
- commit message eng only
- 팀원의 PullRequest: approve(필수) 코드리뷰(선택)
- 커밋 세분화(1일 1커밋 권장)

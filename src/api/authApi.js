/**
 * Mock 인증 API
 * 실제 백엔드가 준비되면 이 파일의 함수 내부만 fetch 호출로 교체하면 됩니다.
 *
 *  POST /auth/login
 *  body: { email: string, password: string }
 *  200 OK      -> { accessToken, refreshToken, expiresIn }
 *  400 Bad Request -> 비밀번호 불일치 / 존재하지 않는 계정
 *  403 Forbidden   -> 정지된 계정
 */

// 테스트용 mock 계정
const MOCK_USERS = [
  {
    email: "vortexjml@sookmyung.ac.kr",
    password: "abc123!@",
    status: "active",
  },
  {
    email: "suspended@sookmyung.ac.kr",
    password: "abc123!@",
    status: "suspended", // 정지된 계정 테스트용
  },
];

const NETWORK_DELAY_MS = 700;

function generateMockToken(prefix) {
  const random = Math.random().toString(36).slice(2, 12);
  return `${prefix}.${random}.${Date.now()}`;
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * 이메일/비밀번호 로그인
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ accessToken: string, refreshToken: string, expiresIn: number }>}
 */
export function loginRequest({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find((u) => u.email === email);

      if (!user) {
        reject(new ApiError(400, "이메일 또는 비밀번호가 올바르지 않습니다."));
        return;
      }

      if (user.status === "suspended") {
        reject(new ApiError(403, "정지된 계정입니다. 고객센터로 문의해주세요."));
        return;
      }

      if (user.password !== password) {
        reject(new ApiError(400, "비밀번호가 일치하지 않습니다."));
        return;
      }

      resolve({
        accessToken: generateMockToken("access"),
        refreshToken: generateMockToken("refresh"),
        // 데모/테스트 편의를 위해 30초로 설정 (실서비스는 30분 등으로 조정)
        expiresIn: 30,
      });
    }, NETWORK_DELAY_MS);
  });
}

/**
 * Refresh Token으로 Access Token 재발급
 * @param {string} refreshToken
 */
export function refreshTokenRequest(refreshToken) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!refreshToken) {
        reject(new ApiError(401, "Refresh Token이 없습니다. 다시 로그인해주세요."));
        return;
      }
      resolve({
        accessToken: generateMockToken("access"),
        refreshToken,
        expiresIn: 30,
      });
    }, 400);
  });
}

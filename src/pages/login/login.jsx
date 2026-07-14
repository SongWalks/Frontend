import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
// import { loginRequest, refreshTokenRequest, ApiError } from '../../api/authApi';
// import { saveTokens, clearTokens } from '../../utils/tokenStorage';
import lockIcon from '../../assets/lock.svg';
import joinIcon from '../../assets/join.svg';
import checkIcon from '../../assets/check.svg';
import emailIcon from '../../assets/email.svg';
import logo from '../../assets/logo.png';
import eyeIcon from '../../assets/eye.svg';
import pwLockIcon from '../../assets/pwlock.svg';
import Button from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spinner } from '../../components/common/Spinner';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FRAME_WIDTH = 402;
const FRAME_HEIGHT = 874;

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [autoLogin, setAutoLogin] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [banner, setBanner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshTimerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      const scaleByHeight = window.innerHeight / FRAME_HEIGHT;
      const scaleByWidth = window.innerWidth / FRAME_WIDTH;
      setScale(Math.min(scaleByHeight, scaleByWidth));
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    return () => clearTimeout(refreshTimerRef.current);
  }, []);

  function validate() {
    const errors = { email: '', password: '' };
    if (!email.trim()) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = '올바른 이메일 형식이 아닙니다.';
    }
    if (!password) {
      errors.password = '비밀번호를 입력해주세요.';
    }
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  }

  function scheduleTokenRefresh(refreshToken, expiresIn) {
    clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(async () => {
      try {
        // const reissued = await refreshTokenRequest(refreshToken);
        // saveTokens(reissued, autoLogin);
        setBanner({
          type: 'success',
          message: '토큰이 만료되어 새 토큰으로 재발급되었습니다.',
        });
        // scheduleTokenRefresh(reissued.refreshToken, reissued.expiresIn);
      } catch {
        // clearTokens();
        setBanner({
          type: 'error',
          message: '세션이 만료되었습니다. 다시 로그인해주세요.',
        });
      }
    }, expiresIn * 1000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // const tokens = await loginRequest({ email: email.trim(), password });
      // saveTokens(tokens, autoLogin);
      setBanner({
        type: 'success',
        message: `로그인에 성공했습니다. ${autoLogin ? '자동 로그인이 설정됨' : ''}`,
      });
      // scheduleTokenRefresh(tokens.refreshToken, tokens.expiresIn);
    } catch (err) {
      setBanner({
        type: 'error',
        message: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.frame} style={{ transform: `scale(${scale})` }}>
        <div className={styles.card}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <img src={logo} alt="SOO" />
            </div>
            <p className={styles.tagline}>
              눈송이들의 수강신청을 구조해줄 간편하고
              <br />
              안전한 강의 교환 매칭 제안 서비스
            </p>
          </div>

          <div
            className={twMerge(
              styles.bannerSlot,
              banner?.type === 'error' && styles.bannerErrorText,
              banner?.type === 'success' && styles.bannerSuccessText,
            )}
          >
            {banner?.message || ''}
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* ── 이메일 ── */}
            <div className={`${styles.fieldGroup} ${styles.emailGroup}`}>
              <label
                className={`${styles.label} ${styles.emailLabel}`}
                htmlFor="email"
              >
                이메일
              </label>
              <div
                className={twMerge(
                  styles.inputWrapper,
                  fieldErrors.email && styles.inputError,
                )}
              >
                <span className={`${styles.inputIcon} ${styles.emailIcon}`}>
                  <img
                    src={emailIcon}
                    alt=""
                    style={{ width: '100%', height: '100%' }}
                  />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력해주세요"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value.trim())
                      setFieldErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  autoComplete="email"
                  className="flex-1 min-w-0 !border-none !bg-transparent !p-0 !rounded-none !shadow-none placeholder:text-[11px] placeholder:leading-[18.384px] placeholder:tracking-[0.368px] placeholder:text-[#657a88] placeholder:font-['Pretendard'] placeholder:font-normal"
                />
              </div>
              <p className={styles.errorText}>{fieldErrors.email}</p>
            </div>

            {/* ── 비밀번호 ── */}
            <div className={`${styles.fieldGroup} ${styles.pwGroup}`}>
              <label
                className={`${styles.label} ${styles.pwLabel}`}
                htmlFor="password"
              >
                비밀번호
              </label>
              <div
                className={twMerge(
                  styles.inputWrapper,
                  fieldErrors.password && styles.inputError,
                )}
              >
                <span className={`${styles.inputIcon} ${styles.pwLockIcon}`}>
                  <img
                    src={pwLockIcon}
                    alt=""
                    style={{ width: '100%', height: '100%' }}
                  />
                </span>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력해주세요"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value)
                      setFieldErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  autoComplete="current-password"
                  className="flex-1 min-w-0 !border-none !bg-transparent !p-0 !rounded-none !shadow-none [&::placeholder]:text-[11px] [&::placeholder]:leading-[18.384px] [&::placeholder]:tracking-[0.368px] placeholder:text-[#657a88] placeholder:font-['Pretendard'] placeholder:font-normal"
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                  }
                >
                  <img
                    src={eyeIcon}
                    alt=""
                    style={{ width: '100%', height: '100%' }}
                  />
                </button>
              </div>
              <p className={styles.errorText}>{fieldErrors.password}</p>
            </div>

            {/* ── 자동 로그인 ── */}
            <div
              className={styles.autoLoginRow}
              onClick={() => setAutoLogin((v) => !v)}
              role="checkbox"
              aria-checked={autoLogin}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setAutoLogin((v) => !v);
                }
              }}
            >
              <span
                className={twMerge(
                  styles.checkbox,
                  autoLogin && styles.checked,
                )}
              >
                {autoLogin && (
                  <img
                    src={checkIcon}
                    alt=""
                    style={{ width: '70%', height: '70%' }}
                  />
                )}
              </span>
              <span className={styles.autoLoginLabel}>자동 로그인</span>
            </div>

            {/* ── 로그인 버튼 ── */}
            <Button
              type="submit"
              disabled={isSubmitting}
              fullWidth={false}
              className={twMerge(styles.submitButton, '!w-[359px]')}
            >
              {isSubmitting && <Spinner size="sm" className="mr-1" />}
              {isSubmitting ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <div className={styles.links}>
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => navigate('/findPW')}
            >
              <img className={styles.lockIcon} src={lockIcon} alt="" />
              비밀번호 찾기
            </button>
            <span className={styles.divider}>|</span>
            <button
              type="button"
              className={`${styles.linkButton} ${styles.join}`}
              onClick={() => navigate('/signup')}
            >
              <img className={styles.joinIcon} src={joinIcon} alt="" />
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

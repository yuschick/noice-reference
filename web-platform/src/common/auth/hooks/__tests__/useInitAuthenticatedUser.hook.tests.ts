import { act, renderHook, waitFor } from '@testing-library/react';

import { useInitAuthenticatedUser } from '../useInitAuthenticatedUser.hook';

const MOCK_PATHNAME = '/mock-pathname';

const mockUseAuthentication = jest.fn();
const mockUseKeyContentLoadMetadata = jest.fn();
jest.mock('@noice-com/common-ui', () => ({
  ...jest.requireActual('@noice-com/common-ui'),
  useAuthentication: () => mockUseAuthentication(),
  useKeyContentLoadMetadata: jest.fn(() => mockUseKeyContentLoadMetadata),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn(() => ({
    pathname: MOCK_PATHNAME,
  })),
  useNavigate: jest.fn(),
}));

const mockCreateTemporaryAccount = jest.fn();
const mockVerifyCaptcha = jest.fn();
const mockTrackEvent = jest.fn();

const mockAnalyticsService = jest.fn();

jest.mock('@noice-com/common-react-core', () => ({
  ...jest.requireActual('@noice-com/common-react-core'),
  useClient: jest.fn(() => ({
    createTemporaryAccount: mockCreateTemporaryAccount,

    // eslint-disable-next-line @typescript-eslint/naming-convention
    AuthService: {
      verifyCaptcha: mockVerifyCaptcha,
    },

    // eslint-disable-next-line @typescript-eslint/naming-convention
    AnalyticsService: {
      trackEvent: mockTrackEvent,
    },
  })),
}));

const mockLog = jest.fn();
const mockLogError = jest.fn();
jest.mock('@noice-com/utils', () => ({
  ...jest.requireActual('@noice-com/utils'),
  makeLoggers: () => ({
    log: (args: unknown) => mockLog(args),
    logError: (args: unknown) => mockLogError(args),
  }),
}));

describe('useInitAuthenticatedUser hook', () => {
  beforeEach(() => {
    mockAnalyticsService.mockImplementation(() => ({
      trackEvent: mockTrackEvent,
    }));
  });

  it('should be returning loading when nothing is not done yet', () => {
    mockUseAuthentication.mockReturnValue({
      initialized: false,
    });

    const { result } = renderHook(() => useInitAuthenticatedUser());
    const { authIsLoading, hasAuthFailed, showImplicitAccountLogin } = result.current;

    expect(authIsLoading).toBe(true);
    expect(hasAuthFailed).toBe(false);
    expect(showImplicitAccountLogin).toBe(false);
  });

  it('should not be loading or failing when user is authenticated', () => {
    mockUseAuthentication.mockReturnValue({
      initialized: true,
      isAuthenticated: jest.fn(() => true),
    });

    const { result } = renderHook(() => useInitAuthenticatedUser());
    const { authIsLoading, hasAuthFailed, showImplicitAccountLogin } = result.current;

    expect(authIsLoading).toBe(false);
    expect(hasAuthFailed).toBe(false);
    expect(showImplicitAccountLogin).toBe(false);
  });

  it('should start creating implicit account when user is not authenticated', () => {
    mockUseAuthentication.mockReturnValue({
      initialized: true,
      isAuthenticated: jest.fn(() => false),
    });

    const { result } = renderHook(() => useInitAuthenticatedUser());
    const { authIsLoading, hasAuthFailed, showImplicitAccountLogin } = result.current;

    expect(authIsLoading).toBe(false);
    expect(hasAuthFailed).toBe(false);
    expect(showImplicitAccountLogin).toBe(true);
  });

  it('should create implicit account when captcha is verified', async () => {
    const mockCaptchaToken = 'captcha-token';
    const mockClientCaptchaToken = 'mock-client-captcha-token';

    mockUseAuthentication.mockReturnValue({
      initialized: true,
      isAuthenticated: jest.fn(() => false),
    });
    mockVerifyCaptcha.mockResolvedValue(mockClientCaptchaToken);

    const { result } = renderHook(() => useInitAuthenticatedUser());

    await waitFor(() => {
      expect(result.current.showImplicitAccountLogin).toBe(true);
      expect(result.current.authIsLoading).toBe(false);
    });

    await act(async () => {
      await result.current.onCaptchaVerify(mockCaptchaToken);
    });

    expect(mockVerifyCaptcha).toHaveBeenCalledWith(mockCaptchaToken);

    expect(mockCreateTemporaryAccount).toHaveBeenCalledWith({
      captchaToken: mockClientCaptchaToken,
      origin: MOCK_PATHNAME,
    });

    expect(result.current.hasAuthFailed).toBe(false);
    expect(result.current.showImplicitAccountLogin).toBe(false);
    expect(result.current.authIsLoading).toBe(false);
  });

  it('should set error when captcha verification fails', async () => {
    const mockCaptchaToken = 'captcha-token';

    mockUseAuthentication.mockReturnValue({
      initialized: true,
      isAuthenticated: jest.fn(() => false),
    });

    mockVerifyCaptcha.mockRejectedValue(new Error('Captcha error'));

    const { result } = renderHook(() => useInitAuthenticatedUser());

    await waitFor(() => {
      expect(result.current.showImplicitAccountLogin).toBe(true);
      expect(result.current.authIsLoading).toBe(false);
    });

    await act(async () => {
      await result.current.onCaptchaVerify(mockCaptchaToken);
    });

    expect(mockVerifyCaptcha).toHaveBeenCalledWith(mockCaptchaToken);

    expect(result.current.hasAuthFailed).toBe(true);
    expect(result.current.showImplicitAccountLogin).toBe(false);
    expect(result.current.authIsLoading).toBe(false);
  });

  it('should set error when account creation fails', async () => {
    const mockClientCaptchaToken = 'mock-client-captcha-token';
    const mockCaptchaToken = 'captcha-token';

    mockUseAuthentication.mockReturnValue({
      initialized: true,
      isAuthenticated: jest.fn(() => false),
    });

    mockVerifyCaptcha.mockResolvedValue(mockClientCaptchaToken);
    mockCreateTemporaryAccount.mockRejectedValue(new Error('Account creation error'));

    const { result } = renderHook(() => useInitAuthenticatedUser());

    await waitFor(() => {
      expect(result.current.showImplicitAccountLogin).toBe(true);
      expect(result.current.authIsLoading).toBe(false);
    });

    await act(async () => {
      await result.current.onCaptchaVerify(mockCaptchaToken);
    });

    expect(mockVerifyCaptcha).toHaveBeenCalledWith(mockCaptchaToken);

    expect(result.current.hasAuthFailed).toBe(true);
    expect(result.current.showImplicitAccountLogin).toBe(false);
    expect(result.current.authIsLoading).toBe(false);
  });

  it('should set error when captcha is calling onCaptchaError', async () => {
    const { result } = renderHook(() => useInitAuthenticatedUser());

    await waitFor(() => {
      expect(result.current.showImplicitAccountLogin).toBe(true);
      expect(result.current.authIsLoading).toBe(false);
    });

    act(() => {
      result.current.onCaptchaError();
    });

    expect(result.current.hasAuthFailed).toBe(true);
    expect(result.current.showImplicitAccountLogin).toBe(false);
    expect(result.current.authIsLoading).toBe(false);
  });

  it('should skip the captcha when user is a bot', () => {
    jest.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('GoogleBot');

    const { result } = renderHook(() => useInitAuthenticatedUser());

    expect(result.current.hasAuthFailed).toBe(true);
    expect(result.current.showImplicitAccountLogin).toBe(false);
    expect(result.current.authIsLoading).toBe(false);
  });
});

import { render, screen, waitFor } from '@testing-library/react';

import { AuthenticatedRoute } from '../AuthenticatedRoute';

import '@testing-library/jest-dom';

const MOCK_PATHNAME = '/mock-pathname';
const MOCK_SEARCH = '?mock-search';
const mockNavigate = jest.fn();
const mockTrackEvent = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(() => mockNavigate),
  useLocation: jest.fn(() => ({
    pathname: MOCK_PATHNAME,
    search: MOCK_SEARCH,
  })),
}));

const mockNavigateComponent = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: (props: unknown) => mockNavigateComponent(props),
}));

const mockUseAuthentication = jest.fn();
jest.mock('@noice-com/common-ui', () => ({
  ...jest.requireActual('@noice-com/common-ui'),
  useAuthentication: () => mockUseAuthentication(),
  FullscreenSpinner: () => <div data-testid="spinner" />,
}));

const mockCreateTemporaryAccount = jest.fn();
const mockVerifyCaptcha = jest.fn();
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

const mockCaptchaComponent = jest.fn();
jest.mock('@common/auth', () => ({
  HiddenCaptcha: (props: unknown) => mockCaptchaComponent(props),
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

describe('AuthenticatedRoute', () => {
  it('should render spinner if user is not initialized', () => {
    mockUseAuthentication.mockReturnValue({
      initialized: false,
    });

    render(
      <AuthenticatedRoute>
        <div data-testid="children">children</div>
      </AuthenticatedRoute>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render children if user is authenticated', () => {
    mockUseAuthentication.mockReturnValue({
      initialized: true,
      isAuthenticated: jest.fn(() => true),
      userId: 'mock-user-id',
    });

    render(
      <AuthenticatedRoute>
        <div data-testid="children">children</div>
      </AuthenticatedRoute>,
    );

    expect(screen.getByTestId('children')).toHaveTextContent('children');
  });

  it('creates guest account when no account', async () => {
    const mockCaptchaToken = 'captcha-token';
    const mockClientCaptchaToken = 'mock-client-captcha-token';
    mockUseAuthentication.mockReturnValue({
      initialized: true,
      isAuthenticated: jest.fn(() => false),
    });
    mockVerifyCaptcha.mockResolvedValue(mockClientCaptchaToken);

    mockCaptchaComponent.mockImplementation(
      ({ onVerify }: { onVerify: (token: string) => void }) => {
        onVerify(mockCaptchaToken);
        return <div data-testid="hidden-captcha" />;
      },
    );

    render(
      <AuthenticatedRoute>
        <div data-testid="children">children</div>
      </AuthenticatedRoute>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByTestId('hidden-captcha')).toBeInTheDocument();
    await waitFor(() => expect(mockVerifyCaptcha).toHaveBeenCalledWith(mockCaptchaToken));
    await waitFor(() =>
      expect(mockCreateTemporaryAccount).toHaveBeenCalledWith({
        captchaToken: mockClientCaptchaToken,
        origin: MOCK_PATHNAME,
      }),
    );
  });

  it('navigates user to sign up when captcha fails', async () => {
    mockUseAuthentication.mockReturnValue({
      initialized: true,
      isAuthenticated: jest.fn(() => false),
    });

    mockCaptchaComponent.mockImplementation(({ onError }: { onError: () => void }) => {
      setTimeout(() => onError(), 500);

      return <div data-testid="hidden-captcha" />;
    });

    render(
      <AuthenticatedRoute>
        <div data-testid="children">children</div>
      </AuthenticatedRoute>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByTestId('hidden-captcha')).toBeInTheDocument();

    await waitFor(() =>
      expect(mockNavigateComponent).toHaveBeenCalledWith({
        to: { pathname: '/signup', search: 'from=/mock-pathname%3Fmock-search' },
      }),
    );
    expect(mockLog).toHaveBeenCalledWith(
      'Player trying to go somewhere without authenticating. Redirecting to login',
    );
  });

  it('navigates user to sign up when account creation fails', async () => {
    const mockCaptchaToken = 'captcha-token';

    mockUseAuthentication.mockReturnValue({
      initialized: true,
      isAuthenticated: jest.fn(() => false),
    });
    mockVerifyCaptcha.mockRejectedValue(new Error('Failed to verify captcha'));

    mockCaptchaComponent.mockImplementation(
      ({ onVerify }: { onVerify: (token: string) => void }) => {
        onVerify(mockCaptchaToken);
        return <div data-testid="hidden-captcha" />;
      },
    );

    render(
      <AuthenticatedRoute>
        <div data-testid="children">children</div>
      </AuthenticatedRoute>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByTestId('hidden-captcha')).toBeInTheDocument();

    await waitFor(() => expect(mockVerifyCaptcha).toHaveBeenCalledWith(mockCaptchaToken));
    expect(mockNavigateComponent).toHaveBeenCalledWith({
      to: { pathname: '/signup', search: 'from=/mock-pathname%3Fmock-search' },
    });
    expect(mockLogError).toHaveBeenCalled();
    expect(mockTrackEvent).toHaveBeenCalledWith({
      clientImplicitAccountLoginFailed: {
        error: 'Failed to verify captcha',
      },
    });
  });
});

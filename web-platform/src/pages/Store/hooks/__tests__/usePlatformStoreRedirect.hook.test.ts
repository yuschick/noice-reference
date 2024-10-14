import { renderHook } from '@testing-library/react';

import { usePlatformStoreRedirect } from '../usePlatformStoreRedirect.hook';

const MOCK_SEARCH_PARAM_GAME_ID = 'mock-search-param-game-id';
const MOCK_SEARCH_PARAM_CATEGORY = `${MOCK_SEARCH_PARAM_GAME_ID}-creators`;

const MOCK_USER_ID = 'mock-user-id';
jest.mock('@noice-com/common-ui', () => ({
  ...jest.requireActual('@noice-com/common-ui'),
  useAuthentication: jest.fn(() => ({ userId: MOCK_USER_ID })),
}));

const mockUsePlatformStoreRedirectProfileQuery = jest.fn();
jest.mock('@gen', () => ({
  ...jest.requireActual('@gen'),
  usePlatformStoreRedirectProfileQuery: (args: unknown) =>
    mockUsePlatformStoreRedirectProfileQuery(args),
}));

const MOCK_HASH = '#mock-hash';
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(() => mockNavigate),
  useLocation: jest.fn(() => ({ hash: MOCK_HASH })),
}));

const mockGetSearchParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn(() => [{ get: mockGetSearchParams }]),
}));

const MOCK_SELECTED_GAME_ID = 'mock-selected-game-id';
const mockSetSelectedGame = jest.fn();
jest.mock('@context', () => ({
  useSelectedUIState: jest.fn(() => ({
    selectedGameId: MOCK_SELECTED_GAME_ID,
    setSelectedGame: mockSetSelectedGame,
  })),
}));

describe('useStoreRedirect hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does nothing when loading data', () => {
    mockUsePlatformStoreRedirectProfileQuery.mockReturnValue({ loading: true });

    const { result } = renderHook(() => usePlatformStoreRedirect());

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current).toBeNull();
  });

  it('does nothing when no played games', () => {
    mockUsePlatformStoreRedirectProfileQuery.mockReturnValue({
      data: { profile: { userId: MOCK_USER_ID, playedGames: [] } },
    });

    const { result } = renderHook(() => usePlatformStoreRedirect());

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current).toBeNull();
  });

  it('sets store game id when played game id in path', () => {
    mockUsePlatformStoreRedirectProfileQuery.mockReturnValue({
      data: {
        profile: {
          userId: MOCK_USER_ID,
          playedGames: [{ id: MOCK_SEARCH_PARAM_GAME_ID, userId: MOCK_USER_ID }],
        },
      },
    });

    mockGetSearchParams.mockReturnValue(MOCK_SEARCH_PARAM_CATEGORY);

    const { result } = renderHook(() => usePlatformStoreRedirect());

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockSetSelectedGame).toHaveBeenCalledWith(MOCK_SEARCH_PARAM_GAME_ID);
    expect(result.current).toBe(MOCK_SEARCH_PARAM_GAME_ID);
  });

  it('navigates to other game if current game is not played', () => {
    const otherGameId = 'other-game-id';
    mockUsePlatformStoreRedirectProfileQuery.mockReturnValue({
      data: {
        profile: {
          userId: MOCK_USER_ID,
          playedGames: [{ id: otherGameId, userId: MOCK_USER_ID }],
        },
      },
    });

    mockGetSearchParams.mockReturnValue(MOCK_SEARCH_PARAM_CATEGORY);

    const { result } = renderHook(() => usePlatformStoreRedirect());

    expect(mockNavigate).toHaveBeenCalledWith(
      '/store?category=other-game-id-creators#mock-hash',
      { replace: true },
    );
    expect(mockSetSelectedGame).toHaveBeenCalledWith(otherGameId);
    expect(result.current).toBe(otherGameId);
  });

  it('navigates to the ui selected game when no game in path', () => {
    mockUsePlatformStoreRedirectProfileQuery.mockReturnValue({
      data: {
        profile: {
          userId: MOCK_USER_ID,
          playedGames: [{ id: MOCK_SELECTED_GAME_ID, userId: MOCK_USER_ID }],
        },
      },
    });

    mockGetSearchParams.mockReturnValue(null);

    const { result } = renderHook(() => usePlatformStoreRedirect());

    expect(mockNavigate).toHaveBeenCalledWith(
      '/store?category=mock-selected-game-id-creators#mock-hash',
      { replace: true },
    );
    expect(result.current).toBe(MOCK_SELECTED_GAME_ID);
  });
});

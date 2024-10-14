import { renderHook } from '@testing-library/react';

import { useChannelStoreRedirect } from '../useChannelStoreRedirect.hook';

const MOCK_CHANNEL_NAME = 'mock-channel-name';
const MOCK_CHANNEL_ID = 'mock-channel-id';
const MOCK_SEARCH_PARAM_GAME_ID = 'mock-search-param-game-id';
const MOCK_SEARCH_PARAM_CATEGORY = `${MOCK_SEARCH_PARAM_GAME_ID}-creators`;

const mockChannel = {
  id: MOCK_CHANNEL_ID,
  name: MOCK_CHANNEL_NAME,
  monetizationSettings: { enabled: true },
};

const mockUseChannelStoreRedirectChannelQuery = jest.fn();
jest.mock('@gen', () => ({
  ...jest.requireActual('@gen'),
  useChannelStoreRedirectChannelQuery: (args: unknown) =>
    mockUseChannelStoreRedirectChannelQuery(args),
}));

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(() => mockNavigate),
  useLocation: jest.fn(() => ({ hash: '' })),
  matchRoutes: jest.fn(() => []),
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

describe('useChannelStoreRedirect hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does nothing when loading data', () => {
    mockUseChannelStoreRedirectChannelQuery.mockReturnValue({ loading: true });

    const { result } = renderHook(() =>
      useChannelStoreRedirect({ channel: mockChannel }),
    );

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current).toBeNull();
  });

  it('does nothing when channel does not exists', () => {
    mockUseChannelStoreRedirectChannelQuery.mockReturnValue({
      data: { channel: undefined },
    });

    const { result } = renderHook(() =>
      useChannelStoreRedirect({ channel: mockChannel }),
    );

    expect(result.current).toBeNull();
  });

  describe('when no game id in path', () => {
    it('do nothing', () => {
      mockUseChannelStoreRedirectChannelQuery.mockReturnValue({
        data: { channel: { streamedGames: [] } },
      });

      const { result } = renderHook(() =>
        useChannelStoreRedirect({ channel: mockChannel }),
      );

      expect(result.current).toBeNull();
    });

    it('redirects to selected game id when it is a streamed game', () => {
      mockUseChannelStoreRedirectChannelQuery.mockReturnValue({
        data: {
          channel: {
            streamedGames: [
              {
                id: MOCK_SELECTED_GAME_ID,
                noicePredictionsEnabled: true,
              },
            ],
          },
        },
      });

      const { result } = renderHook(() =>
        useChannelStoreRedirect({ channel: mockChannel }),
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        {
          hash: '',
          pathname: '/mock-channel-name',
          search: '?category=mock-selected-game-id-creators',
        },
        { replace: true },
      );

      expect(result.current).toBe(MOCK_SELECTED_GAME_ID);
    });

    it('redirects to first streamed game when selected game id is not streamed', () => {
      mockUseChannelStoreRedirectChannelQuery.mockReturnValue({
        data: {
          channel: {
            streamedGames: [
              {
                id: 'other-game-id',
                noicePredictionsEnabled: true,
              },
            ],
          },
        },
      });

      const { result } = renderHook(() =>
        useChannelStoreRedirect({ channel: mockChannel }),
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        {
          hash: '',
          pathname: '/mock-channel-name',
          search: '?category=other-game-id-creators',
        },
        { replace: true },
      );

      expect(result.current).toEqual('other-game-id');
    });
  });

  describe('when game id is in path', () => {
    beforeEach(() => {
      mockGetSearchParams.mockReturnValue(MOCK_SEARCH_PARAM_CATEGORY);
    });

    it('stays in the page and sets game id to be selected game when game is played', () => {
      mockUseChannelStoreRedirectChannelQuery.mockReturnValue({
        data: {
          channel: {
            id: MOCK_CHANNEL_ID,
            monetizationSettings: { enabled: true },
            streamedGames: [
              {
                id: MOCK_SEARCH_PARAM_GAME_ID,
                noicePredictionsEnabled: true,
              },
            ],
            name: MOCK_CHANNEL_NAME,
          },
        },
      });

      const { result } = renderHook(() =>
        useChannelStoreRedirect({ channel: mockChannel }),
      );

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockSetSelectedGame).toHaveBeenCalledWith(MOCK_SEARCH_PARAM_GAME_ID);
      expect(result.current).toBe(MOCK_SEARCH_PARAM_GAME_ID);
    });

    it('redirects to channel store front page when game is not played', () => {
      mockUseChannelStoreRedirectChannelQuery.mockReturnValue({
        data: {
          channel: {
            id: MOCK_CHANNEL_ID,
            monetizationSettings: { enabled: true },
            streamedGames: [],
            name: MOCK_CHANNEL_NAME,
          },
        },
      });

      const { result } = renderHook(() =>
        useChannelStoreRedirect({ channel: mockChannel }),
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        { hash: '', pathname: '/mock-channel-name', search: '' },
        {
          replace: true,
        },
      );
      expect(result.current).toBeNull();
    });

    it('redirects to channel page when played game has not predictions enabled', () => {
      mockUseChannelStoreRedirectChannelQuery.mockReturnValue({
        data: {
          channel: {
            id: MOCK_CHANNEL_ID,
            monetizationSettings: { enabled: true },
            name: MOCK_CHANNEL_NAME,
            streamedGames: [
              {
                id: MOCK_SEARCH_PARAM_GAME_ID,
                noicePredictionsEnabled: false,
              },
            ],
          },
        },
      });

      const { result } = renderHook(() =>
        useChannelStoreRedirect({ channel: mockChannel }),
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        { hash: '', pathname: '/mock-channel-name', search: '' },
        {
          replace: true,
        },
      );
      expect(result.current).toBeNull();
    });

    it('redirects to other game when path game is not played', () => {
      const otherGameId = 'other-game-id';
      mockUseChannelStoreRedirectChannelQuery.mockReturnValue({
        data: {
          channel: {
            id: MOCK_CHANNEL_ID,
            monetizationSettings: { enabled: true },
            streamedGames: [
              {
                id: otherGameId,
                noicePredictionsEnabled: true,
              },
            ],
            name: MOCK_CHANNEL_NAME,
          },
        },
      });

      const { result } = renderHook(() =>
        useChannelStoreRedirect({ channel: mockChannel }),
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        {
          hash: '',
          pathname: '/mock-channel-name',
          search: '?category=other-game-id-creators',
        },
        { replace: true },
      );
      expect(mockSetSelectedGame).toHaveBeenCalledWith(otherGameId);
      expect(result.current).toBe(otherGameId);
    });
  });
});

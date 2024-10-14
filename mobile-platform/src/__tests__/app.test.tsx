import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react-native';

import { App } from '../App';

it('Noice mobile renders correctly', async () => {
  const { toJSON } = render(
    <MockedProvider>
      <App />
    </MockedProvider>,
  );

  await waitFor(() => {
    expect(toJSON()).toMatchSnapshot();
  });
});

import React from 'react';
import renderer from 'react-test-renderer';
import Home from './Home';
import Auth from '../../services/Auth';
import { render } from '@testing-library/react';

jest.mock('../Drafts/Drafts', () =>
  jest.fn(() => (
    <div>
      Things To Do
    </div>
  )));

jest.mock('../../services/Auth', () => ({
  signOut: jest.fn()
}));

describe('Home', () => {

  test('snapshot renders correctly', () => {
    const component = renderer.create(<Home />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should call sign out function on sign out icon click', async () => {

    const mockSignOut = jest.fn();
    Auth.signOut.mockImplementation(mockSignOut);

    const { getByLabelText } = render(<Home />);

    const signOut = getByLabelText('sign out');

    signOut.click();

    expect(mockSignOut).toBeCalled();

  });

});
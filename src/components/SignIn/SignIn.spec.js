import React from 'react';
import renderer from 'react-test-renderer';
import SignIn from './SignIn';
import { render, fireEvent, act, waitForElement } from '@testing-library/react';
import Auth from '../../services/Auth';
import I18n from "@aws-amplify/core/lib/I18n";
import * as AuthState from '../../constants/authStates';

jest.mock('../../services/Auth', () => ({
  signIn: jest.fn()
}));

// jest.mock('@material-ui/core/TextField', () =>
//   jest.fn(({ value, label, helperText, onChange, onBlur, onFocus }) => (
//     <div>
//     <label>
//       {label}
//       <input onChange={onChange} onBlur={onBlur} onFocus={onFocus} value={value} />
//     </label>
//     <div>{helperText}</div>
//     </div>))
// );

describe('SignIn', () => {
  test('snapshot renders correctly', () => {

    const component = renderer.create(<SignIn authState={AuthState.SIGN_IN} />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('not rendered when authState is not signIn', () => {

    const { queryAllByText } = render(<SignIn authState="other state" />);

    expect(queryAllByText(I18n.get('Sign in')).length).toEqual(0);
  });

  it('rendered when authState is signIn', () => {

    const { queryAllByText } = render(<SignIn authState={AuthState.SIGN_IN} />);

    expect(queryAllByText(I18n.get('Sign in')).length).toBeGreaterThan(0);
  });

  it('submit button disabled when fields empty', () => {

    const { getByLabelText, getByTestId } = render(<SignIn authState={AuthState.SIGN_IN} />);
    const submit = getByTestId('submit');

    expect(submit).toBeDisabled();
  });

  it('submit button enabled when fields with valid values', () => {

    const { getByLabelText, getByTestId } = render(<SignIn authState={AuthState.SIGN_IN} />);
    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);
    const submit = getByTestId('submit');

    fireEvent.change(email, { target: { value: 'email@example.com' } });
    fireEvent.change(password, { target: { value: 'secret' } });

    expect(submit).not.toBeDisabled();
  });

  it('submit button disabled when invalid email', () => {

    const { getByLabelText, getByTestId } = render(<SignIn authState={AuthState.SIGN_IN} />);

    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);
    const submit = getByTestId('submit');

    fireEvent.change(email, { target: { value: 'not-an-email' } });
    fireEvent.change(password, { target: { value: '' } });

    expect(submit).toBeDisabled();
  });

  it('display error messages when invalid inputs', () => {

    const { getByLabelText, queryByText } = render(<SignIn authState={AuthState.SIGN_IN} />);

    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);

    expect(queryByText(I18n.get('Invalid e-mail format'))).not.toBeInTheDocument();
    expect(queryByText(I18n.get('The field is required'))).not.toBeInTheDocument();

    fireEvent.focus(email, {});
    fireEvent.change(email, { target: { value: 'not-an-email' } });
    fireEvent.blur(email, {});

    fireEvent.focus(password, {});
    fireEvent.change(password, { target: { value: '' } });
    fireEvent.blur(password, {});

    expect(queryByText(I18n.get('Invalid e-mail format'))).toBeInTheDocument();
    expect(queryByText(I18n.get('The field is required'))).toBeInTheDocument();
  });

  it('do not display error messages when typing', () => {

    const { getByLabelText, queryByText } = render(<SignIn authState={AuthState.SIGN_IN} />);

    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);

    fireEvent.change(email, { target: { value: 'not-an-email' } });
    fireEvent.change(password, { target: { value: '' } });

    expect(queryByText(I18n.get('Invalid e-mail format'))).not.toBeInTheDocument();
    expect(queryByText(I18n.get('The field is required'))).not.toBeInTheDocument();

  });

  it('submit button disabled when password is empty', () => {

    const { getByLabelText, getByTestId } = render(<SignIn authState={AuthState.SIGN_IN} />);

    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);
    const submit = getByTestId('submit');

    fireEvent.change(email, { target: { value: 'email@example.com' } });
    fireEvent.change(password, { target: { value: '' } });

    expect(submit.hasAttribute('disabled')).toBeTruthy();
  });

  it('error message when sign in failed', async () => {

    const emailValue = 'email@example.com';
    const passwordValue = 'secret';

    Auth.signIn.mockImplementation(
      () => {
        throw Error('Invalid username or password');
      });

    const { queryByText, getByLabelText, getByTestId} = render(<SignIn authState={AuthState.SIGN_IN} />);
    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);
    const submit = getByTestId('submit');

    fireEvent.change(email, { target: { value: emailValue } });
    fireEvent.change(password, { target: { value: passwordValue } });

    expect(queryByText(I18n.get('Sign in failed')), 'no error message yet').not.toBeInTheDocument();

    await act(async () => {
      submit.click();
    });

    expect(queryByText(I18n.get('Sign in failed'))).toBeInTheDocument();
  });

  it('should change state to "signedIn" on submit', async () => {

    const emailValue = 'email@example.com';
    const passwordValue = 'secret';
    const mockOnStateChange = jest.fn((state, _) => {
      expect(state).toEqual(AuthState.SIGNED_IN);
    });

    Auth.signIn.mockImplementation(
      (email, password) => {
        expect(email).toEqual(emailValue);
        expect(password).toEqual(passwordValue);
        return { state: 'signedIn' };
      });

    const { getByLabelText, getByTestId } = render(<SignIn authState={AuthState.SIGN_IN} onStateChange={mockOnStateChange} />);

    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);
    const submit = getByTestId('submit');

    fireEvent.change(email, { target: { value: emailValue } });
    fireEvent.change(password, { target: { value: passwordValue } });

    await act(async () => {
      submit.click();
    });

    expect(mockOnStateChange.mock.calls.length).toBe(1);

  });

  it('should display progress and disable submit button while submitting', async () => {

    const emailValue = 'email@example.com';
    const passwordValue = 'secret';
    const mockOnStateChange = jest.fn((state, _) => { });

    Auth.signIn.mockImplementation(
      async () => {
        return { state: AuthState.SIGNED_IN };
      });

    const { getByLabelText, getByRole, queryByRole, getByTestId } = render(<SignIn authState={AuthState.SIGN_IN} onStateChange={mockOnStateChange} />);

    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);
    const submit = getByTestId('submit');

    fireEvent.change(email, { target: { value: emailValue } });
    fireEvent.change(password, { target: { value: passwordValue } });

    expect(submit).not.toBeDisabled();
    expect(queryByRole(`progressbar`)).not.toBeInTheDocument();

    fireEvent.click(submit);

    await act(async () => {
      expect(submit).toBeDisabled();
      await waitForElement(() => getByRole(`progressbar`));
    });

    expect(submit).not.toBeDisabled();
    expect(queryByRole(`progressbar`)).not.toBeInTheDocument();

  });

});
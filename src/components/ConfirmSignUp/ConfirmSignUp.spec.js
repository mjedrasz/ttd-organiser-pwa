import React from 'react';
import renderer from 'react-test-renderer';
import ConfirmSignUp from './ConfirmSignUp';
import { render, fireEvent, act, waitForElement } from '@testing-library/react';
import Auth from '../../services/Auth';
import I18n from "@aws-amplify/core/lib/I18n";
import * as AuthState from '../../constants/authStates';

jest.mock('../../services/Auth', () => ({
  confirmSignUp: jest.fn(),
  resendCode: jest.fn()
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

describe('ConfirmSignUp', () => {
  test('snapshot renders correctly', () => {

    const component = renderer.create(<ConfirmSignUp authState={AuthState.CONFIRM_SIGN_UP}  authData="email@example.com" />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('not rendered when authState is not signUp', () => {

    const { queryAllByText } = render(<ConfirmSignUp authState="other state" />);

    expect(queryAllByText(I18n.get('Confirm Signup')).length).toEqual(0);
  });

  it('rendered when authState is signUp', () => {

    const { queryAllByText } = render(<ConfirmSignUp authState={AuthState.CONFIRM_SIGN_UP}  authData="email@example.com" />);

    expect(queryAllByText(I18n.get('Confirm Signup')).length).toBeGreaterThan(0);
  });

  it('submit button disabled when fields empty', () => {

    const { getByText } = render(<ConfirmSignUp authState={AuthState.CONFIRM_SIGN_UP}  authData="email@example.com" />);
    const submit = getByText(I18n.get('Confirm'));

    expect(submit).toBeDisabled();
  });

  it('e-mail input disabled and with authData', () => {
    const emailValue = 'email@example.com';

    const { getByLabelText } = render(<ConfirmSignUp authState={AuthState.CONFIRM_SIGN_UP}  authData={emailValue} />);
    const email = getByLabelText(`${I18n.get('Email Address')} *`);

    expect(email).toBeDisabled();
    expect(email.value).toEqual(emailValue);
  });

  it('submit button enabled when fields with valid values', () => {

    const { getByLabelText, getByText } = render(<ConfirmSignUp authState={AuthState.CONFIRM_SIGN_UP}  authData="email@example.com" />);

    const code = getByLabelText(`${I18n.get('Confirmation Code')} *`);
    const submit = getByText(I18n.get('Confirm'));

    fireEvent.change(code, { target: { value: '123456' } });

    expect(submit).not.toBeDisabled();
  });

  it('submit button disabled when code is empty', () => {

    const { getByLabelText, getByText } = render(<ConfirmSignUp authState={AuthState.CONFIRM_SIGN_UP}  authData="email@example.com" />);

    const code = getByLabelText(`${I18n.get('Confirmation Code')} *`);
    const submit = getByText(I18n.get('Confirm'));

    fireEvent.change(code, { target: { value: '' } });

    expect(submit).toBeDisabled();
  });

  it('display error messages when code is empty and on blur', () => {

    const { getByLabelText, queryByText } = render(<ConfirmSignUp authState={AuthState.CONFIRM_SIGN_UP}  authData="email@example.com" />);

    const code = getByLabelText(`${I18n.get('Confirmation Code')} *`);

    expect(queryByText(I18n.get('The field is required'))).not.toBeInTheDocument();

    fireEvent.focus(code, {});
    fireEvent.change(code, { target: { value: '' } });
    fireEvent.blur(code, {});

    expect(queryByText(I18n.get('The field is required'))).toBeInTheDocument();

  });

  it('do not display error messages when typing', () => {

    const { getByLabelText, queryByText } = render(<ConfirmSignUp authState={AuthState.CONFIRM_SIGN_UP}  authData="email@example.com" />);

    const code = getByLabelText(`${I18n.get('Confirmation Code')} *`);

    expect(queryByText(I18n.get('The field is required'))).not.toBeInTheDocument();

    fireEvent.focus(code, {});
    fireEvent.change(code, { target: { value: '' } });

    expect(queryByText(I18n.get('The field is required'))).not.toBeInTheDocument();
  });

  it('error message when confirm sign up failed', async () => {

    Auth.confirmSignUp.mockImplementation(
      () => {
        throw Error('Unable to confirm user');
      });

    const { queryByText, getByLabelText, getByText} = render(<ConfirmSignUp authState={AuthState.CONFIRM_SIGN_UP}  authData="email@example.com" />);

    const code = getByLabelText(`${I18n.get('Confirmation Code')} *`);
    const submit = getByText(I18n.get('Confirm'));

    fireEvent.change(code, { target: { value: '123456' } });

    expect(queryByText(I18n.get('Confirm Sign up failed')), 'no error message yet').not.toBeInTheDocument();

    await act(async () => {
      submit.click();
    });

    expect(queryByText(I18n.get('Confirm Sign up failed'))).toBeInTheDocument();
  });

  it('error message when resending code failed', async () => {

    Auth.resendCode.mockImplementation(
      () => {
        throw Error('Unable to resend code');
      });

    const { getByText, queryByText } = render(<ConfirmSignUp authState={AuthState.CONFIRM_SIGN_UP}  authData="email@example.com" />);

    const resendCodeLink = getByText(`${I18n.get('Lost your code? Resend Code')}`);

    expect(queryByText(I18n.get('Resending code failed')), 'no error message yet').not.toBeInTheDocument();
  
    await act(async () => {
      resendCodeLink.click();
    });

    expect(queryByText(I18n.get('Resending code failed'))).toBeInTheDocument();
  });

  it('should change state to "signIn" on submit', async () => {

    const codeValue = '123456';
    const emailValue = 'email@example.com';

    const mockOnStateChange = jest.fn((state, _) => {
      expect(state).toEqual(AuthState.SIGN_IN);
    });

    Auth.confirmSignUp.mockImplementation(
      (username, code) => {
        expect(username).toEqual(emailValue);
        expect(code).toEqual(codeValue);
      });

    const { getByLabelText, getByText } = render(<ConfirmSignUp
      authState={AuthState.CONFIRM_SIGN_UP}
      authData={emailValue} 
      onStateChange={mockOnStateChange} />);

    const code = getByLabelText(`${I18n.get('Confirmation Code')} *`);
    const submit = getByText(I18n.get('Confirm'));

    fireEvent.change(code, { target: { value: codeValue } });

    await act(async () => {
      submit.click();
    });

    expect(mockOnStateChange.mock.calls.length).toBe(1);

  });

  it('should display progress and disable submit button while submitting', async () => {

    const mockOnStateChange = jest.fn((state, _) => { });

    Auth.confirmSignUp.mockImplementation(
      async () => {});

    const { getByLabelText, getByRole, queryByRole, getByText} = render(<ConfirmSignUp authState={AuthState.CONFIRM_SIGN_UP}  authData="email@example.com" onStateChange={mockOnStateChange} />);

    const code = getByLabelText(`${I18n.get('Confirmation Code')} *`);
    const submit = getByText(I18n.get('Confirm'));

    fireEvent.change(code, { target: { value: '123456' } });

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

  it('should display progress when resending code', async () => {

    const mockOnStateChange = jest.fn((state, _) => { });

    Auth.resendCode.mockImplementation(
      async () => {});

    const { getByRole, queryByRole, getByText} = render(<ConfirmSignUp authState={AuthState.CONFIRM_SIGN_UP}  authData="email@example.com" onStateChange={mockOnStateChange} />);

    const resendCodeLink = getByText(`${I18n.get('Lost your code? Resend Code')}`);

    expect(queryByRole(`progressbar`)).not.toBeInTheDocument();

    fireEvent.click(resendCodeLink);

    await act(async () => {
      await waitForElement(() => getByRole(`progressbar`));
    });

    expect(queryByRole(`progressbar`)).not.toBeInTheDocument();

  });

});
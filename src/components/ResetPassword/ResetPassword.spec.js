import React from 'react';
import renderer from 'react-test-renderer';
import ResetPassword from './ResetPassword';
import { render, fireEvent, act, waitForElement } from '@testing-library/react';
import Auth from '../../services/Auth';
import I18n from "@aws-amplify/core/lib/I18n";
import * as AuthState from '../../constants/authStates';

jest.mock('../../services/Auth', () => ({
  resetPassword: jest.fn(),
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

describe('ResetPassword', () => {
  test('snapshot renders correctly', () => {

    const component = renderer.create(<ResetPassword authState={AuthState.RESET_PASSWORD} authData="email@example.com" />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('not rendered when authState is not signUp', () => {

    const { queryAllByText } = render(<ResetPassword authState="other state" />);

    expect(queryAllByText(I18n.get('Reset password')).length).toEqual(0);
  });

  it('rendered when authState is signUp', () => {

    const { queryAllByText } = render(<ResetPassword authState={AuthState.RESET_PASSWORD} authData="email@example.com" />);

    expect(queryAllByText(I18n.get('Reset password')).length).toBeGreaterThan(0);
  });

  it('submit button disabled when fields empty', () => {

    const { getByText } = render(<ResetPassword authState={AuthState.RESET_PASSWORD} authData="email@example.com" />);
    const submit = getByText(I18n.get('Verify'));

    expect(submit).toBeDisabled();
  });

  it('submit button enabled when fields with valid values', () => {

    const { getByLabelText, getByText } = render(<ResetPassword authState={AuthState.RESET_PASSWORD} authData="email@example.com" />);

    const code = getByLabelText(`${I18n.get('Confirmation Code')} *`);
    const password = getByLabelText(`${I18n.get('New password')} *`);
    const submit = getByText(I18n.get('Verify'));

    fireEvent.change(code, { target: { value: '123456' } });
    fireEvent.change(password, { target: { value: 'secret123' } });

    expect(submit).not.toBeDisabled();
  });

  it('submit button disabled when code is empty', () => {

    const { getByLabelText, getByText } = render(<ResetPassword authState={AuthState.RESET_PASSWORD} authData="email@example.com" />);

    const code = getByLabelText(`${I18n.get('Confirmation Code')} *`);
    const submit = getByText(I18n.get('Verify'));

    fireEvent.change(code, { target: { value: '' } });

    expect(submit).toBeDisabled();
  });

  it('submit button disabled when password is empty', () => {

    const { getByLabelText, getByText } = render(<ResetPassword authState={AuthState.RESET_PASSWORD} authData="email@example.com" />);

    const password = getByLabelText(`${I18n.get('New password')} *`);
    const submit = getByText(I18n.get('Verify'));

    fireEvent.change(password, { target: { value: '' } });

    expect(submit).toBeDisabled();
  });

  it('display error messages when code is empty and on blur', () => {

    const { getByLabelText, queryByText } = render(<ResetPassword authState={AuthState.RESET_PASSWORD} authData="email@example.com" />);

    const code = getByLabelText(`${I18n.get('Confirmation Code')} *`);

    expect(queryByText(I18n.get('The field is required'))).not.toBeInTheDocument();

    fireEvent.focus(code, {});
    fireEvent.change(code, { target: { value: '' } });
    fireEvent.blur(code, {});

    expect(queryByText(I18n.get('The field is required'))).toBeInTheDocument();
  });

  it('display error messages when password is empty and on blur', () => {

    const { getByLabelText, queryByText } = render(<ResetPassword authState={AuthState.RESET_PASSWORD} authData="email@example.com" />);

    const password = getByLabelText(`${I18n.get('New password')} *`);

    expect(queryByText(I18n.get('The field is required'))).not.toBeInTheDocument();

    fireEvent.focus(password, {});
    fireEvent.change(password, { target: { value: '' } });
    fireEvent.blur(password, {});

    expect(queryByText(I18n.get('The field is required'))).toBeInTheDocument();
  });

  it('do not display error messages when typing', () => {

    const { getByLabelText, queryByText } = render(<ResetPassword authState={AuthState.RESET_PASSWORD} authData="email@example.com" />);

    const code = getByLabelText(`${I18n.get('Confirmation Code')} *`);
    const password = getByLabelText(`${I18n.get('New password')} *`);

    expect(queryByText(I18n.get('The field is required'))).not.toBeInTheDocument();

    fireEvent.focus(code, {});
    fireEvent.change(code, { target: { value: '' } });
    fireEvent.focus(password, {});
    fireEvent.change(password, { target: { value: '' } });

    expect(queryByText(I18n.get('The field is required'))).not.toBeInTheDocument();
  });

  it('error message when confirm sign up failed', async () => {

    Auth.resetPassword.mockImplementation(
      () => {
        throw Error('Unable to reset password');
      });

    const { queryByText, getByLabelText, getByText} = render(<ResetPassword authState={AuthState.RESET_PASSWORD} authData="email@example.com" />);

    const code = getByLabelText(`${I18n.get('Confirmation Code')} *`);
    const password = getByLabelText(`${I18n.get('New password')} *`);
    const submit = getByText(I18n.get('Verify'));

    fireEvent.change(code, { target: { value: '123456' } });
    fireEvent.change(password, { target: { value: 'secret123' } });

    expect(queryByText(I18n.get('Reset password failed')), 'no error message yet').not.toBeInTheDocument();

    await act(async () => {
      submit.click();
    });

    expect(queryByText(I18n.get('Reset password failed'))).toBeInTheDocument();
  });

  it('error message when resending code failed', async () => {

    Auth.resendCode.mockImplementation(
      () => {
        throw Error('Unable to resend code');
      });

    const { getByText, queryByText } = render(<ResetPassword authState={AuthState.RESET_PASSWORD} authData="email@example.com" />);

    const resendCodeLink = getByText(`${I18n.get('Lost your code? Resend Code')}`);

    expect(queryByText(I18n.get('Resend code failed')), 'no error message yet').not.toBeInTheDocument();
  
    await act(async () => {
      resendCodeLink.click();
    });

    expect(queryByText(I18n.get('Resend code failed'))).toBeInTheDocument();
  });

  it('should change state to "signIn" on submit', async () => {

    const codeValue = '123456';
    const emailValue = 'email@example.com';
    const passwordValue = 'secret123';

    const mockOnStateChange = jest.fn((state, _) => {
      expect(state).toEqual('signIn');
    });

    Auth.resetPassword.mockImplementation(
      (username, code, password) => {
        expect(username).toEqual(emailValue);
        expect(password).toEqual(passwordValue);
        expect(code).toEqual(codeValue);
      });

    const { getByLabelText, getByText } = render(<ResetPassword
      authState={AuthState.RESET_PASSWORD}
      authData={emailValue} 
      onStateChange={mockOnStateChange} />);

    const code = getByLabelText(`${I18n.get('Confirmation Code')} *`);
    const password = getByLabelText(`${I18n.get('New password')} *`);
    const submit = getByText(I18n.get('Verify'));

    fireEvent.change(code, { target: { value: codeValue } });
    fireEvent.change(password, { target: { value: passwordValue } });

    await act(async () => {
      submit.click();
    });

    expect(mockOnStateChange.mock.calls.length).toBe(1);

  });

  it('should display progress and disable submit button while submitting', async () => {

    const mockOnStateChange = jest.fn((state, _) => { });

    Auth.resetPassword.mockImplementation(
      async () => {});

    const { getByLabelText, getByRole, queryByRole, getByText} = render(<ResetPassword authState={AuthState.RESET_PASSWORD} authData="email@example.com" onStateChange={mockOnStateChange} />);

    const code = getByLabelText(`${I18n.get('Confirmation Code')} *`);
    const password = getByLabelText(`${I18n.get('New password')} *`);
    const submit = getByText(I18n.get('Verify'));

    fireEvent.change(code, { target: { value: '123456' } });
    fireEvent.change(password, { target: { value: 'secret123' } });

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

    const { getByRole, queryByRole, getByText} = render(<ResetPassword authState={AuthState.RESET_PASSWORD} authData="email@example.com" onStateChange={mockOnStateChange} />);

    const resendCodeLink = getByText(`${I18n.get('Lost your code? Resend Code')}`);

    expect(queryByRole(`progressbar`)).not.toBeInTheDocument();

    fireEvent.click(resendCodeLink);

    await act(async () => {
      await waitForElement(() => getByRole(`progressbar`));
    });

    expect(queryByRole(`progressbar`)).not.toBeInTheDocument();

  });

});
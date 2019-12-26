import React from 'react';
import renderer from 'react-test-renderer';
import SignUp from './SignUp';
import { render, fireEvent, act, waitForElement } from '@testing-library/react';
import Auth from '../../services/Auth';
import I18n from "@aws-amplify/core/lib/I18n";
import * as AuthState from '../../constants/authStates';

jest.mock('../../services/Auth', () => ({
  signUp: jest.fn()
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

describe('SignUp', () => {
  test('snapshot renders correctly', () => {

    const component = renderer.create(<SignUp authState={AuthState.SIGN_UP} />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('not rendered when authState is not signUp', () => {

    const { queryAllByText } = render(<SignUp authState="other state" />);

    expect(queryAllByText(I18n.get('Sign up')).length).toEqual(0);
  });

  it('rendered when authState is signUp', () => {

    const { queryAllByText } = render(<SignUp authState={AuthState.SIGN_UP} />);

    expect(queryAllByText(I18n.get('Sign up')).length).toBeGreaterThan(0);
  });

  it('submit button disabled when fields empty', () => {

    const { getByTestId } = render(<SignUp authState={AuthState.SIGN_UP} />);
    const submit = getByTestId('submit');

    expect(submit).toBeDisabled();
  });

  it('submit button enabled when fields with valid values', () => {

    const { getByLabelText, getByTestId } = render(<SignUp authState={AuthState.SIGN_UP} />);

    const name = getByLabelText(`${I18n.get('Name')} *`);
    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);
    const submit = getByTestId('submit');

    fireEvent.change(name, { target: { value: 'my name' } });
    fireEvent.change(email, { target: { value: 'email@example.com' } });
    fireEvent.change(password, { target: { value: 'verysecret' } });

    expect(submit).not.toBeDisabled();
  });

  it('submit button disabled when invalid email', () => {

    const { getByLabelText, getByTestId } = render(<SignUp authState={AuthState.SIGN_UP} />);

    const name = getByLabelText(`${I18n.get('Name')} *`);
    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);
    const submit = getByTestId('submit');

    fireEvent.change(name, { target: { value: 'my name' } });
    fireEvent.change(email, { target: { value: 'not-an-email' } });
    fireEvent.change(password, { target: { value: 'secret123' } });

    expect(submit).toBeDisabled();
  });

  it('submit button disabled when password is empty', () => {

    const { getByLabelText, getByTestId } = render(<SignUp authState={AuthState.SIGN_UP} />);

    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);
    const submit = getByTestId('submit');

    fireEvent.change(email, { target: { value: 'email@example.com' } });
    fireEvent.change(password, { target: { value: '' } });

    expect(submit).toBeDisabled();
  });

  it('submit button disabled when name is empty', () => {

    const { getByLabelText, getByTestId } = render(<SignUp authState={AuthState.SIGN_UP} />);

    const name = getByLabelText(`${I18n.get('Name')} *`);
    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);
    const submit = getByTestId('submit');

    fireEvent.change(name, { target: { value: '' } });
    fireEvent.change(email, { target: { value: 'email@example.com' } });
    fireEvent.change(password, { target: { value: 'verysecret' } });

    expect(submit).toBeDisabled();
  });

  it('display error messages when invalid inputs', () => {

    const { getByLabelText, queryByText } = render(<SignUp authState={AuthState.SIGN_UP} />);

    const name = getByLabelText(`${I18n.get('Name')} *`);
    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);

    expect(queryByText(I18n.get('Invalid e-mail format'))).not.toBeInTheDocument();
    expect(queryByText(I18n.get('The field is required'))).not.toBeInTheDocument();
    expect(queryByText(I18n.get('The passwords must be at least 8 characters long'))).not.toBeInTheDocument();

    fireEvent.focus(name, {});
    fireEvent.change(name, { target: { value: '' } });
    fireEvent.blur(name, {});

    fireEvent.focus(email, {});
    fireEvent.change(email, { target: { value: 'not-an-email' } });
    fireEvent.blur(email, {});

    fireEvent.focus(password, {});
    fireEvent.change(password, { target: { value: 'short' } });
    fireEvent.blur(password, {});

    expect(queryByText(I18n.get('Invalid e-mail format'))).toBeInTheDocument();
    expect(queryByText(I18n.get('The field is required'))).toBeInTheDocument();
    expect(queryByText(I18n.get('The passwords must be at least 8 characters long'))).toBeInTheDocument();

  });

  it('do not display error messages when typing', () => {

    const { getByLabelText, queryByText } = render(<SignUp authState={AuthState.SIGN_UP} />);

    const name = getByLabelText(`${I18n.get('Name')} *`);
    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);

    fireEvent.change(name, { target: { value: '' } });
    fireEvent.change(email, { target: { value: 'not-an-email' } });
    fireEvent.change(password, { target: { value: '' } });

    expect(queryByText(I18n.get('Invalid e-mail format'))).not.toBeInTheDocument();
    expect(queryByText(I18n.get('The field is required'))).not.toBeInTheDocument();

  });

  it('error message when sign up failed', async () => {

    const nameValue = 'my name';
    const emailValue = 'email@example.com';
    const passwordValue = 'secret1234';

    Auth.signUp.mockImplementation(
      () => {
        throw Error('User already exits');
      });

    const { queryByText, getByLabelText, getByTestId} = render(<SignUp authState={AuthState.SIGN_UP} />);

    const name = getByLabelText(`${I18n.get('Name')} *`);
    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);
    const submit = getByTestId('submit');

    fireEvent.change(name, { target: { value: nameValue } });
    fireEvent.change(email, { target: { value: emailValue } });
    fireEvent.change(password, { target: { value: passwordValue } });

    expect(queryByText(I18n.get('Sign up failed')), 'no error message yet').not.toBeInTheDocument();

    await act(async () => {
      submit.click();
    });

    expect(queryByText(I18n.get('Sign up failed'))).toBeInTheDocument();
  });

  it('should change state to "confirmSignUp" on submit', async () => {

    const nameValue = 'my name';
    const emailValue = 'email@example.com';
    const passwordValue = 'secret1234';

    const mockOnStateChange = jest.fn((state, _) => {
      expect(state).toEqual(AuthState.CONFIRM_SIGN_UP);
    });

    Auth.signUp.mockImplementation(
      (email, password, { name }) => {
        expect(name).toEqual(nameValue);
        expect(email).toEqual(emailValue);
        expect(password).toEqual(passwordValue);
      });

    const { getByLabelText, getByTestId } = render(<SignUp authState={AuthState.SIGN_UP} onStateChange={mockOnStateChange} />);

    const name = getByLabelText(`${I18n.get('Name')} *`);
    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);
    const submit = getByTestId('submit');

    fireEvent.change(name, { target: { value: nameValue } });
    fireEvent.change(email, { target: { value: emailValue } });
    fireEvent.change(password, { target: { value: passwordValue } });

    await act(async () => {
      submit.click();
    });

    expect(mockOnStateChange.mock.calls.length).toBe(1);

  });

  it('should display progress and disable submit button while submitting', async () => {

    const mockOnStateChange = jest.fn((state, _) => { });

    Auth.signUp.mockImplementation(
      async () => {});

    const { getByLabelText, getByRole, queryByRole, getByTestId } = render(<SignUp authState={AuthState.SIGN_UP} onStateChange={mockOnStateChange} />);

    const name = getByLabelText(`${I18n.get('Name')} *`);
    const email = getByLabelText(`${I18n.get('Email Address')} *`);
    const password = getByLabelText(`${I18n.get('Password')} *`);
    const submit = getByTestId('submit');

    fireEvent.change(name, { target: { value: 'my name' } });
    fireEvent.change(email, { target: { value: 'email@example.com' } });
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

});
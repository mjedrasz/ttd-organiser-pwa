import React from 'react';
import renderer from 'react-test-renderer';
import ForgotPassword from './ForgotPassword';
import { render, fireEvent, act, waitForElement } from '@testing-library/react';
import Auth from '../../services/Auth';
import I18n from "@aws-amplify/core/lib/I18n";
import * as AuthState from '../../constants/authStates';

jest.mock('../../services/Auth', () => ({
    forgotPassword: jest.fn()
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

describe('ForgotPassword', () => {
    test('snapshot renders correctly', () => {

        const component = renderer.create(<ForgotPassword authState={AuthState.FORGOT_PASSWORD} />);

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('not rendered when authState is not forgotPassword', () => {

        const { queryAllByText } = render(<ForgotPassword authState="other state" />);

        expect(queryAllByText(I18n.get('Reset password')).length).toEqual(0);
    });

    it('rendered when authState is forgotPassword', () => {

        const { queryAllByText } = render(<ForgotPassword authState={AuthState.FORGOT_PASSWORD} />);

        expect(queryAllByText(I18n.get('Reset password')).length).toBeGreaterThan(0);
    });

    it('submit button disabled when fields empty', () => {

        const { getByText } = render(<ForgotPassword authState={AuthState.FORGOT_PASSWORD} />);
        const submit = getByText(I18n.get('Submit'));

        expect(submit).toBeDisabled();
    });

    it('submit button enabled when fields with valid values', () => {

        const { getByLabelText, getByText } = render(<ForgotPassword authState={AuthState.FORGOT_PASSWORD} />);

        const email = getByLabelText(`${I18n.get('Email Address')} *`);
        const submit = getByText(I18n.get('Submit'));

        fireEvent.change(email, { target: { value: 'email@example.com' } });

        expect(submit).not.toBeDisabled();
    });

    it('submit button disabled when invalid email', () => {

        const { getByLabelText, getByText } = render(<ForgotPassword authState={AuthState.FORGOT_PASSWORD} />);

        const email = getByLabelText(`${I18n.get('Email Address')} *`);
        const submit = getByText(I18n.get('Submit'));

        fireEvent.change(email, { target: { value: 'not-an-email' } });

        expect(submit).toBeDisabled();
    });

    it('display error messages when invalid inputs', () => {

        const { getByLabelText, queryByText } = render(<ForgotPassword authState={AuthState.FORGOT_PASSWORD} />);

        const email = getByLabelText(`${I18n.get('Email Address')} *`);

        expect(queryByText(I18n.get('Invalid e-mail format'))).not.toBeInTheDocument();

        fireEvent.focus(email, {});
        fireEvent.change(email, { target: { value: 'not-an-email' } });
        fireEvent.blur(email, {});

        expect(queryByText(I18n.get('Invalid e-mail format'))).toBeInTheDocument();
    });

    it('do not display error messages when typing', () => {

        const { getByLabelText, queryByText } = render(<ForgotPassword authState={AuthState.FORGOT_PASSWORD} />);

        const email = getByLabelText(`${I18n.get('Email Address')} *`);

        fireEvent.change(email, { target: { value: 'not-an-email-yet' } });

        expect(queryByText(I18n.get('Invalid e-mail format'))).not.toBeInTheDocument();

    });

    it('submit button disabled when email is empty', () => {

        const { getByLabelText, getByText } = render(<ForgotPassword authState={AuthState.FORGOT_PASSWORD} />);

        const email = getByLabelText(`${I18n.get('Email Address')} *`);
        const submit = getByText(I18n.get('Submit'));

        fireEvent.change(email, { target: { value: '' } });

        expect(submit).toBeDisabled();
    });

    it('error message when forgot password failed', async () => {

        Auth.forgotPassword.mockImplementation(
            () => {
                throw Error('Forgot password failed');
            });

        const { queryByText, getByLabelText, getByText } = render(<ForgotPassword authState={AuthState.FORGOT_PASSWORD} />);
        const email = getByLabelText(`${I18n.get('Email Address')} *`);
        const submit = getByText(I18n.get('Submit'));

        fireEvent.change(email, { target: { value: 'email@example.com' } });

        expect(queryByText(I18n.get('Forgot password failed')), 'no error message yet').not.toBeInTheDocument();

        await act(async () => {
            submit.click();
        });

        expect(queryByText(I18n.get('Forgot password failed'))).toBeInTheDocument();
    });

    it('should change state to "resetPassword" on submit', async () => {

        const emailValue = 'email@example.com';

        const mockOnStateChange = jest.fn((state, _) => {
            expect(state).toEqual(AuthState.RESET_PASSWORD);
        });

        Auth.forgotPassword.mockImplementation(
            (email) => {
                expect(email).toEqual(emailValue);
            });

        const { getByLabelText, getByText } = render(<ForgotPassword authState={AuthState.FORGOT_PASSWORD} onStateChange={mockOnStateChange} />);

        const email = getByLabelText(`${I18n.get('Email Address')} *`);
        const submit = getByText(I18n.get('Submit'));

        fireEvent.change(email, { target: { value: emailValue } });

        await act(async () => {
            submit.click();
        });

        expect(mockOnStateChange.mock.calls.length).toBe(1);

    });

    it('should display progress and disable submit button while submitting', async () => {

        const mockOnStateChange = jest.fn((state, _) => { });

        Auth.forgotPassword.mockImplementation(
            async () => {
            });

        const { getByLabelText, getByRole, queryByRole, getByText } = render(<ForgotPassword authState={AuthState.FORGOT_PASSWORD} onStateChange={mockOnStateChange} />);

        const email = getByLabelText(`${I18n.get('Email Address')} *`);
        const submit = getByText(I18n.get('Submit'));

        fireEvent.change(email, { target: { value: 'email@example.com' } });

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
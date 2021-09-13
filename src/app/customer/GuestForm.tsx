import { withFormik, FieldProps, FormikProps } from 'formik';
import React, { memo, useCallback, FunctionComponent, ReactNode } from 'react';
import { object, string } from 'yup';

import { withLanguage, TranslatedHtml, TranslatedString, WithLanguageProps } from '../locale';
import { getPrivacyPolicyValidationSchema, PrivacyPolicyField } from '../privacyPolicy';
import { Button, ButtonVariant } from '../ui/button';
import { BasicFormField, Fieldset, Form, Legend  } from '../ui/form';

import EmailField from './EmailField';
import SubscribeField from './SubscribeField';

export interface GuestFormProps {
    canSubscribe: boolean;
    checkoutButtons?: ReactNode;
    continueAsGuestButtonLabelId: string;
    requiresMarketingConsent: boolean;
    defaultShouldSubscribe: boolean;
    email?: string;
    isLoading: boolean;
    privacyPolicyUrl?: string;
    onChangeEmail(email: string): void;
    onContinueAsGuest(data: GuestFormValues): void;
    onShowLogin(): void;
}

export interface GuestFormValues {
    email: string;
    shouldSubscribe: boolean;
}

const GuestForm: FunctionComponent<GuestFormProps & WithLanguageProps & FormikProps<GuestFormValues>> = ({
    canSubscribe,
    checkoutButtons,
    continueAsGuestButtonLabelId,
    isLoading,
    onChangeEmail,
    // onShowLogin,
    privacyPolicyUrl,
    requiresMarketingConsent,
}) => {
    const renderField = useCallback((fieldProps: FieldProps<boolean>) => (
        <SubscribeField
            { ...fieldProps }
            requiresMarketingConsent={ requiresMarketingConsent }
        />
    ), [
        requiresMarketingConsent,
    ]);

    return (
        <Form
            className="checkout-form"
            id="checkout-customer-guest"
            testId="checkout-customer-guest"
        >
            <Fieldset
                legend={
                    <Legend hidden>
                        <TranslatedString id="customer.guest_customer_text" />
                    </Legend>
                }
            >
                <p>
                    <TranslatedHtml id="customer.checkout_as_guest_text" />
                </p>

                <div className="customerEmail-container">
                    <div className="customerEmail-body">
                        <EmailField onChange={ onChangeEmail } />

                        { (canSubscribe || requiresMarketingConsent) && <BasicFormField
                            name="shouldSubscribe"
                            render={ renderField }
                        /> }

                        { privacyPolicyUrl && <PrivacyPolicyField
                            url={ privacyPolicyUrl }
                        /> }
                    </div>

                    <div className="form-actions customerEmail-action">
                        <Button
                            className="customerEmail-button"
                            id="checkout-customer-continue"
                            isLoading={ isLoading }
                            testId="customer-continue-as-guest-button"
                            type="submit"
                            variant={ ButtonVariant.Primary }
                        >
                            <TranslatedString id={ continueAsGuestButtonLabelId } />
                        </Button>
                    </div>
                </div>

                {
                    !isLoading && <p>
                        <TranslatedString id="customer.login_text" />
                        { ' ' }
                        <a
                            data-test="customer-continue-button"
                            href="https://b2crepacstbd.b2clogin.com/b2crepacstbd.onmicrosoft.com/b2c_1a_signup_signin/oauth2/v2.0/authorize?client_id=d0d575cc-1414-487a-8cb0-a36d3b9dbe54&redirect_uri=https%3A%2F%2Fcfa-bc-mvp.herokuapp.com%2Flogin-with-ext-jwt&response_mode=form_post&response_type=id_token&scope=openid&state=%2Fcheckout"
                            id="checkout-customer-login"
                            // onClick={ onShowLogin }
                        >
                            <TranslatedString id="customer.login_action" />
                        </a>
                    </p>
                }

                { checkoutButtons }
            </Fieldset>
        </Form>
    );
};

export default withLanguage(withFormik<GuestFormProps & WithLanguageProps, GuestFormValues>({
    mapPropsToValues: ({
        email = '',
        defaultShouldSubscribe = false,
        requiresMarketingConsent,
    }) => ({
        email,
        shouldSubscribe: requiresMarketingConsent ? false : defaultShouldSubscribe,
        privacyPolicy: false,
    }),
    handleSubmit: (values, { props: { onContinueAsGuest } }) => {
        onContinueAsGuest(values);
    },
    validationSchema: ({ language, privacyPolicyUrl }: GuestFormProps & WithLanguageProps) => {
        const email = string()
            .email(language.translate('customer.email_invalid_error'))
            .max(256)
            .required(language.translate('customer.email_required_error'));

        const baseSchema = object({ email });

        if (privacyPolicyUrl) {
            return baseSchema.concat(getPrivacyPolicyValidationSchema({
                isRequired: !!privacyPolicyUrl,
                language,
            }));
        }

        return baseSchema;
    },
})(memo(GuestForm)));

import classNames from 'classnames';
import { noop } from 'lodash';
import React, { memo, FunctionComponent, ReactNode } from 'react';

import { preventDefault } from '../common/dom';
import { TranslatedString } from '../locale';
import { Button, ButtonSize, ButtonVariant } from '../ui/button';
import { IconCheck } from '../ui/icon';

import CheckoutStepType from './CheckoutStepType';

export interface CheckoutStepHeaderProps {
    heading: ReactNode;
    isActive?: boolean;
    isClosed?: boolean;
    isComplete?: boolean;
    isEditable?: boolean;
    suggestion?: ReactNode;
    summary?: ReactNode;
    type: CheckoutStepType;
    onEdit?(type: CheckoutStepType): void;
}

const CheckoutStepHeader: FunctionComponent<CheckoutStepHeaderProps> = ({
    heading,
    isActive,
    isClosed,
    isComplete,
    isEditable,
    onEdit,
    suggestion,
    summary,
    type,
}) => {
    return (
        <a
            className={ classNames(
                'stepHeader',
                { 'is-readonly': !isEditable }
            ) }
            onClick={ preventDefault(isEditable && onEdit ? () => onEdit(type) : noop) }
        >
            <div className="stepHeader-row">
                <div className="stepHeader-figure stepHeader-column">
                    <IconCheck
                        additionalClassName={ classNames(
                            'stepHeader-counter',
                            'optimizedCheckout-step',
                            { 'stepHeader-counter--complete': isComplete }
                        ) }
                    />

                    <h2 className="stepHeader-title optimizedCheckout-headingPrimary">
                        { heading }
                    </h2>
                </div>

                <div
                    className="stepHeader-body stepHeader-column optimizedCheckout-contentPrimary"
                    data-test="step-info"
                >
                    { !isActive && isComplete && summary }
                </div>

                { isEditable && !isActive && <div className="stepHeader-actions stepHeader-column">
                    <Button
                        size={ ButtonSize.Tiny }
                        testId="step-edit-button"
                        variant={ ButtonVariant.Secondary }
                    >
                        <TranslatedString id="common.edit_action" />
                    </Button>
                </div> }
            </div>

            { suggestion && isClosed && !isActive && <div className="stepHeader-row stepHeader-suggestion" data-test="step-suggestion">
                { suggestion }
            </div> }
        </a>
    );
};

export default memo(CheckoutStepHeader);

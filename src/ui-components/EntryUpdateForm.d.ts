/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type EntryUpdateFormInputValues = {
    code?: string;
    destination?: string;
};
export declare type EntryUpdateFormValidationValues = {
    code?: ValidationFunction<string>;
    destination?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type EntryUpdateFormOverridesProps = {
    EntryUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    code?: PrimitiveOverrideProps<TextFieldProps>;
    destination?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type EntryUpdateFormProps = React.PropsWithChildren<{
    overrides?: EntryUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    entry?: any;
    onSubmit?: (fields: EntryUpdateFormInputValues) => EntryUpdateFormInputValues;
    onSuccess?: (fields: EntryUpdateFormInputValues) => void;
    onError?: (fields: EntryUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: EntryUpdateFormInputValues) => EntryUpdateFormInputValues;
    onValidate?: EntryUpdateFormValidationValues;
} & React.CSSProperties>;
export default function EntryUpdateForm(props: EntryUpdateFormProps): React.ReactElement;

import { type InputHTMLAttributes, useRef } from "react";
import { NumericFormat } from "react-number-format";
import { cn } from "@/lib/utils/cn";
import { useInputProps } from "../base-field/utils";
import { Field } from "../field";
import { inputBoxClassNames } from "../field/consts";
import type { NumberInputProps } from "./types";

export const NumberInput = (props: NumberInputProps) => {
	const {
		id,
		errors,
		label,
		inputProps,
		description,
		isRequired,
		value,
		onChange,
		onBlur,
		placeholder,
		rootClassName,
		thousandSeparator,
		decimalSeparator,
		allowNegative,
		min = -Infinity,
		max = Infinity,
		fixedDecimalScale = false,
		decimalScale = 0,
		suffix,
		prefix,
		isLoading,
	} = useInputProps(props);

	const ref = useRef<HTMLInputElement>(null);

	const handleChange = (values: {
		value: string;
		floatValue: number | undefined;
	}) => {
		const newValue =
			values.floatValue === undefined ? undefined : values.floatValue;

		onChange?.(newValue);
	};

	const handleBlur = () => {
		if (!ref.current) {
			return;
		}

		if (value === undefined) {
			return;
		}

		if (value < min) {
			onChange?.(min);
			ref.current.value = String(min);
		} else if (value > max) {
			onChange?.(max);
			ref.current.value = String(max);
		}

		onBlur?.();
	};

	return (
		<Field.Root className={rootClassName}>
			<Field.Label htmlFor={id} label={label} isRequired={isRequired} />

			<Field.LoadingContainer isLoading={isLoading}>
				<NumericFormat
					decimalSeparator={decimalSeparator}
					thousandSeparator={thousandSeparator}
					decimalScale={decimalScale}
					fixedDecimalScale={fixedDecimalScale}
					allowNegative={allowNegative || min < 0}
					valueIsNumericString
					max={max}
					min={min}
					suffix={suffix}
					prefix={prefix}
					className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none relative"
					getInputRef={ref}
					value={value}
					customInput={CustomInput}
					onValueChange={handleChange}
					onBlur={handleBlur}
					placeholder={placeholder}
					{...inputProps}
				/>
			</Field.LoadingContainer>

			<Field.Description description={description} />

			<Field.Error errors={errors} />
		</Field.Root>
	);
};

const CustomInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
	<input {...props} className={cn(inputBoxClassNames, props.className)} />
);

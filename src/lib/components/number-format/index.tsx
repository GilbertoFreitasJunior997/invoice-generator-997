import { useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import { Input } from "../input";
import type { NumberFormatProps } from "./types";

export const NumberFormat = ({
	stepper,
	thousandSeparator,
	placeholder,
	defaultValue,
	min = -Infinity,
	max = Infinity,
	onValueChange,
	fixedDecimalScale = false,
	decimalScale = 0,
	suffix,
	prefix,
	value: controlledValue,
	...props
}: NumberFormatProps) => {
	const [value, setValue] = useState<number | undefined>(
		controlledValue ?? defaultValue,
	);
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (controlledValue === undefined) {
			return;
		}

		setValue(controlledValue);
	}, [controlledValue]);

	const handleChange = (values: {
		value: string;
		floatValue: number | undefined;
	}) => {
		const newValue =
			values.floatValue === undefined ? undefined : values.floatValue;

		setValue(newValue);

		onValueChange?.(newValue);
	};

	const handleBlur = () => {
		if (!ref.current) {
			return;
		}

		if (value === undefined) {
			return;
		}

		if (value < min) {
			setValue(min);
			ref.current.value = String(min);
		} else if (value > max) {
			setValue(max);
			ref.current.value = String(max);
		}
	};

	return (
		<NumericFormat
			value={value}
			onValueChange={handleChange}
			thousandSeparator={thousandSeparator}
			decimalScale={decimalScale}
			fixedDecimalScale={fixedDecimalScale}
			allowNegative={min < 0}
			valueIsNumericString
			onBlur={handleBlur}
			max={max}
			min={min}
			suffix={suffix}
			prefix={prefix}
			customInput={Input}
			placeholder={placeholder}
			className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none relative"
			getInputRef={ref}
			{...props}
		/>
	);
};

import React, {
	forwardRef,
	type PropsWithChildren,
	useEffect,
	useState,
} from 'react';
import {type Except} from 'type-fest';
import {type Styles} from '../styles.js';
import {type DOMElement} from '../dom.js';

export type Props = Except<Styles, 'textWrap'> & {
	readonly transitionSize?: boolean;
};

/**
 * `<Box>` is an essential Ink component to build your layout. It's like `<div style="display: flex">` in the browser.
 */
const Box = forwardRef<DOMElement, PropsWithChildren<Props>>(
	({children, transitionSize, ...style}, ref) => {
		const [currentWidth, setCurrentWidth] = useState(
			typeof style.width === 'number' ? style.width : undefined,
		);
		const [currentHeight, setCurrentHeight] = useState(
			typeof style.height === 'number' ? style.height : undefined,
		);

		useEffect(() => {
			if (!transitionSize) {
				return;
			}

			const targetWidth =
				typeof style.width === 'number' ? style.width : undefined;
			const targetHeight =
				typeof style.height === 'number' ? style.height : undefined;

			const interval = setInterval(() => {
				setCurrentWidth(current => {
					if (targetWidth === undefined || current === undefined) {
						return targetWidth;
					}

					if (current < targetWidth) return current + 1;
					if (current > targetWidth) return current - 1;
					return current;
				});

				setCurrentHeight(current => {
					if (targetHeight === undefined || current === undefined) {
						return targetHeight;
					}

					if (current < targetHeight) return current + 1;
					if (current > targetHeight) return current - 1;
					return current;
				});
			}, 100);

			return () => {
				clearInterval(interval);
			};
		}, [transitionSize, style.width, style.height]);

		const finalStyle = transitionSize
			? {...style, width: currentWidth, height: currentHeight}
			: style;

		return (
			<ink-box
				ref={ref}
				style={{
					flexWrap: 'nowrap',
					flexDirection: 'row',
					flexGrow: 0,
					flexShrink: 1,
					...finalStyle,
					overflowX: finalStyle.overflowX ?? finalStyle.overflow ?? 'visible',
					overflowY: finalStyle.overflowY ?? finalStyle.overflow ?? 'visible',
				}}
			>
				{children}
			</ink-box>
		);
	},
);

Box.displayName = 'Box';

export default Box;

import { useState, useEffect, useMemo, useRef, useCallback } from "react";

type KeysPressed = {
	[key: string]: boolean;
};

export function useShortcut(targetKeys: string[]): boolean {
	const targetKeyMap = useMemo(() => {
		return targetKeys.reduce((pv, cv) => {
			cv = cv.length > 1 ? cv : cv.toLowerCase();
			return { ...pv, [cv]: true };
		}, {});
	}, [targetKeys]);

	const keysPressed = useRef<KeysPressed>({});
	const [tick, setTick] = useState(false);

	const isActive = useCallback((result: KeysPressed) => {
		for (const key of Object.keys(targetKeyMap)) {
			if (!(key in result)) {
				return false;
			}
		}

		return true;
	}, [targetKeyMap]);

	useEffect(() => {
		const downHandler = (e: KeyboardEvent): void => {
			const { key } = e;
			if (key in targetKeyMap) {
				const result = { ...keysPressed.current };

				if (!(key in result)) {
					result[key] = true;
				}

				if (isActive(result)) {
					e.preventDefault()
					e.stopImmediatePropagation();

					setTick(true);
				}

				keysPressed.current = result;
			}
		};

		const upHandler = ({ key }: KeyboardEvent): void => {
			if (key in targetKeyMap) {
				const result = { ...keysPressed.current };

				if (key in result) {
					delete result[key];
				}

				if (!isActive(result)) {
					setTick(false);
				}

				keysPressed.current = result;
			}
		};

		window.addEventListener("keydown", downHandler);
		window.addEventListener("keyup", upHandler);

		return () => {
			window.removeEventListener("keydown", downHandler);
			window.removeEventListener("keyup", upHandler);
		};
	}, [targetKeyMap, isActive]);

	

	return tick;
}

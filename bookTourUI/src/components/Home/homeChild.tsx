import { useImperativeHandle, useEffect, useReducer, useState, forwardRef, useTransition, useDeferredValue, useLayoutEffect } from "react";
import { useFetch } from "../Body/customHook";

export type counterResetRef = {
    resetCounter: () => void;
    resetReducerCounter: () => void;
};

const HomeChild = forwardRef<counterResetRef, object>(function HomeChild(_props, ref) {
    const { data, fetchData } = useFetch();
    const [counter, setCounter] = useState(0);
    const [inputValue, setInputValue] = useState("");
    // useDeferredValue to defer the input value for low priority updates
    const deferredInputValue = useDeferredValue(inputValue);
    // State for low priority updates
    const [lowPriorityCounterText, setLowPriorityCounterText] = useState<string[]>([]);
    // useTransition hook to manage low priority updates
    const [pending, startTransition] = useTransition();

    // Reducer setup
    const initialState = { count: 0 };
    const reducer = (state: typeof initialState, action: { type: string }) => {
        switch (action.type) {
            case 'increment':
                return { count: state.count + 1 };
            case 'decrement':
                return { count: state.count - 1 };
            case 'reset':
                return { count: 0 };
            default:
                return state;
        }
    };
    const [state, dispatch] = useReducer(reducer, initialState);

    // Fetch data only when the component mounts, because fetchData is memoized with useCallback
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const resetCounter = () => setCounter(0);
    const resetReducerCounter = () => dispatch({ type: 'reset' });

    // Expose the reset functions to the parent component through the ref
    useImperativeHandle(ref, () => ({
        resetCounter,
        resetReducerCounter
    }), []);

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        // Use startTransition to mark the following state update as low priority
        startTransition(() => {
            const text = [];
            for (let i = 0; i < 20000; i++) {
                // Simulate a heavy computation to demonstrate low priority updates
                text.push(event.target.value);
            }
            setLowPriorityCounterText(text);
        });
    };
    useLayoutEffect(() => {
        // This effect runs synchronously after all DOM mutations, 
        // this is useful for measuring layout or performing side effects that need to happen before the browser paints the screen
        // this is identical to useEffect but it runs synchronously after all DOM mutations, which can be useful for certain types 
        // of side effects that need to happen before the browser paints the screen.
        // It will block code execution here until the entire code of this effect is complete
        console.log("Layout effect triggered");
    }, []);

    return (
        <>
            <button onClick={() => setCounter(counter + 1)}>Count: {counter}</button><br />
            <p>Reducer Counter Value: {state.count}</p>
            <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
            <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button><br />
            <input type="text" placeholder="Type something..." value={inputValue} onChange={onInputChange} /><br />
            {/* Show loading state while the low priority update is pending */}
            {deferredInputValue && <p>Deferred Input Value: {deferredInputValue}</p>}
            {pending ? <span>Loading...</span> :
                lowPriorityCounterText.map((text, index) => (
                    <div key={index}><span>{text}</span><br /></div>
                ))}
            {data && (
                <div>
                    <h2>Fetched Data:</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </>
    );
});

export default HomeChild;

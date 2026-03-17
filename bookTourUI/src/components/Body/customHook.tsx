import { useState, useCallback } from 'react';

export const useFetch = () => {
    const [data, setData] = useState(null);

    const fetchData = useCallback(async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        return result;
    }, []);

    const getCalculatedData = () => {
        return 1 + 1;
    };

    return { data, fetchData, getCalculatedData };
};

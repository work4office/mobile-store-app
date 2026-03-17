import { useEffect, useState } from "react";
import { useFetch } from "./customHook";
interface BodyProps {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
const Body = () => {
  const { fetchData } = useFetch();
  const [allData, setAllData] = useState<BodyProps[]>([]);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const numberOfPages = Math.ceil(allData.length / dataPerPage);
  const lastIndex = currentPage * dataPerPage;
  const firstIndex = lastIndex - dataPerPage;
  const paginatedData = allData.slice(firstIndex, lastIndex);
  useEffect(() => {
    const fetchDataAsync = async () => {
      const result = await fetchData();
      setAllData(result);
    };
    fetchDataAsync();
  }, [fetchData]);
  // const calculatedData = getCalculatedData();
  return (
    <div>
      {/* <h1>Body</h1>
      <p>Calculated Data: {calculatedData}</p> */}
      <p>Fetched Data:</p>
      <ul style={{ textAlign: 'left' }}>
        {paginatedData && paginatedData.map((item: BodyProps) => {
          return (<li key={item.id}>
            {item.id}: <strong>{item.title}</strong>
          </li>);
        })}
      </ul>
      <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>
      {Array(numberOfPages).map(data => {
        return <span> {data} </span>
      })}
      <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, numberOfPages))} disabled={currentPage === numberOfPages}>Next</button>
    </div>
  );
};

export default Body;
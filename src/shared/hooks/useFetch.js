import { useState, useEffect } from "react";

const useFetch = ({ url }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(url);
      const json = await response.json();
      setData(json);
      setLoading(false);
    }
    fetchData();
    console.log(data);
  }, [url]);

  return [data, loading];
};

export default useFetch;

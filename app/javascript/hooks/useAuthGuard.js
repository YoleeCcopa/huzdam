import { useEffect } from 'react';
import { getAuthHeaders, validateToken } from '../utils/auth';

export default function useAuthGuard(redirectTo = '/login') {
  useEffect(() => {
    const checkAuth = async () => {
      const valid = await validateToken();
      if (!valid) {
        window.location.href = redirectTo;
      }
    };

    checkAuth();
  }, [redirectTo]);
}

/*
const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading };
};

const AreaDisplay = ({ url }) => {
  const { data, loading } = useFetchData(url);

  return (
    <div>
      {loading ? (
        <p>Loading areas...</p>
      ) : (
        <div>
          <h2>Your Areas</h2>
          <ul>
            {data.map((area) => (
              <li key={area.id}>{area.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

*/
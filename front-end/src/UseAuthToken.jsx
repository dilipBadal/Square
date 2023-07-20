import jwtDecode from 'jwt-decode';

const useAuthToken = () => {
  const token = localStorage.getItem('token');

  const isTokenExpired = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds

      return decodedToken.exp < currentTime;
    }
    return true;
  };

  return { token, isTokenExpired };
};

export default useAuthToken;

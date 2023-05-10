import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton, LogoutButton } from '../components';

export const Auth = () => {
  const { isLoading, isAuthenticated, user } = useAuth0();

  // const [accessToken, setAccessToken] = useState();

  // useEffect(() => {
  //   isAuthenticated && getAccessTokenSilently().then((token) => setAccessToken(token));
  // }, [isAuthenticated]);

  return (
    <div className="d-flex align-items-center me-2">
      {isLoading && <div className="text-lg font-bold">Loading...</div>}
      {isAuthenticated && user !== undefined ? (
        <div className="d-flex text-lg text-white font-bold me-4">
          Bonjour <div className="mx-2 text-warning">{user.name}</div> !
        </div>
      ) : null}
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
    </div>
  );
};

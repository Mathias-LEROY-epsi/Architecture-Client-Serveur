import { useAuth0 } from '@auth0/auth0-react';

import '../../index.css';

export const Authentification = () => {
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  return (
    <>
      <div className="mt-10 flex flex-col items-center justify-center gap-6">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Veuillez vous connecter
          </h3>
        </div>
        <div className="flex flex-col">
          <>
            {isLoading && <div className="text-lg font-bold">Loading...</div>}
            {isAuthenticated && user ? (
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              >
                Se déconnecter
              </button>
            ) : (
              <button
                className='focus-visible:outline-indigo-600" rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                onClick={() => loginWithRedirect()}
              >
                Se connecter
              </button>
            )}
          </>
        </div>
      </div>
    </>
  );
};

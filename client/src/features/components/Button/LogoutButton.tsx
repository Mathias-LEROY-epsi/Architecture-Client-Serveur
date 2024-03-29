import React from 'react';
import Button from 'react-bootstrap/Button';
import { useAuth0 } from '@auth0/auth0-react';

export const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      className="px-4"
      variant="danger"
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Déconnexion
    </Button>
  );
};

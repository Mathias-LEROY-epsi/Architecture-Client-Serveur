import { Card } from '../components';
import { Container, Row } from 'react-bootstrap';
import { OrderProps, BeerProps } from '../types';
import { useAuth0 } from '@auth0/auth0-react';

import { useQuery } from '@tanstack/react-query';
import { getAllOrders } from '../api/getRequests';

export const Cart = () => {
  const { isAuthenticated, user } = useAuth0();

  const queryGetAllOrders = useQuery({
    queryKey: ['beers'],
    keepPreviousData: true,
    queryFn: getAllOrders,
    cacheTime: 60 * 1000
  });

  // function isOrderedByUser() {
  //   if (user !== undefined && user.name === queryGetAllOrders.data.orders.customerName) {
  //     return true;
  //   }
  //   return false;
  // }

  if (queryGetAllOrders.status === 'loading') {
    return (
      <Container className="d-flex align-items-center justify-content-center mt-4">
        <Row className="d-flex align-items-center justify-content-center">
          <h3>Chargement...</h3>
        </Row>
      </Container>
    );
  }

  if (queryGetAllOrders.status === 'error') {
    return (
      <Container className="d-flex align-items-center justify-content-center mt-4">
        <Row className="d-flex align-items-center justify-content-center">
          <h3>Un problème technique est survenu.</h3>
          <h5>Désolé, nous n'avons pas pu charger les bières.</h5>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="relative px-2">
        {isAuthenticated && user !== undefined ? (
          <>
            <h3>Voici vos commandes</h3>
            <div className="d-md-flex m-4 gap-4 align-items-center justify-content-evenly flex-wrap">
              {queryGetAllOrders.data.orders?.map((order: OrderProps) => (
                <div key={order.id}>
                  {order?.beers?.map((beer: BeerProps) => (
                    <Card
                      key={beer.id}
                      type="order"
                      date={order.date?.split(' ', 1)[0]}
                      name={beer.name}
                      style={beer.style}
                      pictureSrc={'/img/beers/' + beer.style.toLowerCase() + '.png'}
                    />
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          <h3>Votre panier est vide</h3>
        )}
      </div>
    </Container>
  );
};

import { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge, Button, Col, Container, Form, Row, Modal } from 'react-bootstrap';
import { BeerFullProps } from '../../types';
import { useAuth0 } from '@auth0/auth0-react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postABeer, postAnOrder } from '../../api/postRequests';
import { deleteABeer } from '../../api/deleteRequests';
import { getAllBeers, getABeerById } from '../../api/getRequests';

export const Search = () => {
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const [style, setStyle] = useState('');

  const [dataById, setDataById] = useState<BeerFullProps>();

  const [brewery, setBrewery] = useState(1);
  const [breweryName, setBreweryName] = useState('');
  const [breweryLocation, setBreweryLocation] = useState('');

  const beersType = [
    { name: 'Blonde', key: 1, value: 'Blonde' },
    { name: 'Brune', key: 2, value: 'Brune' },
    { name: 'Rousse', key: 3, value: 'Rousse' },
    { name: 'Black', key: 4, value: 'Black' }
  ];

  const breweriesName = [
    { name: 'Brasserie 1', key: 1, value: 1 },
    { name: 'Brasserie 2', key: 2, value: 2 },
    { name: 'Brasserie 3', key: 3, value: 3 },
    { name: 'Brasserie 4', key: 4, value: 4 }
  ];

  const { isAuthenticated, user } = useAuth0();

  const queryClient = useQueryClient();

  const queryGetAllBeers = useQuery({
    queryKey: ['beers', { page }],
    keepPreviousData: true,
    queryFn: () => getAllBeers(page),
    onSuccess: (data) => {
      queryClient.setQueryData(['beers', data.id], data);
      queryClient.invalidateQueries(['beers'], { exact: true });
    },
    retry: 5,
    cacheTime: 60 * 1000
  });

  const navigateToAPage = (amount: number) => {
    return setPage(page + amount);
  };

  // Create

  const queryPostABeer = useMutation({
    mutationFn: postABeer,
    onSuccess: (data) => {
      queryClient.setQueryData(['beers', data.id], data);
      queryClient.invalidateQueries(['beers'], { exact: true });
      queryGetAllBeers.refetch();
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const queryPostAnOrder = useMutation({
    mutationFn: postAnOrder,
    onSuccess: (data) => {
      console.log(data);
      queryClient.setQueryData(['orders', data.name], data);
      queryClient.invalidateQueries(['orders'], { exact: true });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  // Delete

  const queryDeleteABeer = useMutation((id: number) => deleteABeer(id), {
    onSuccess: (data) => {
      queryClient.setQueryData(['beers', data.id], data);
      queryClient.invalidateQueries(['beers'], { exact: true });
      queryGetAllBeers.refetch();
    },
    onError: (error) => {
      console.log(error);
    }
  });

  // MODAL : TODO : REFACTOR en les mettant dans des composants
  // Add Modal

  const [showAddModal, setShowAddModal] = useState(false);

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleCloseAndSaveAddModal = () => {
    setShowAddModal(false);
    queryPostABeer.mutate({
      name: `${name}`,
      style: `${style}`,
      brewery: {
        id: brewery,
        name: `${breweryName}`,
        location: `${breweryLocation}`
      }
    });
  };
  const handleShowAddModal = () => setShowAddModal(true);

  // Delete Modal

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleCloseAndSaveDeleteModal = (id: number) => {
    setShowDeleteModal(false);
    return queryDeleteABeer.mutate(id);
  };
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  // Edit Modal

  const [showEditModal, setShowEditModal] = useState(false);

  const handleCloseEditModal = () => setShowEditModal(false);
  const handleCloseAndSaveEditModal = () => {
    setShowEditModal(false);
    queryPostABeer.mutate({
      name: `${name}`,
      style: `${style}`,
      brewery: {
        id: brewery,
        name: `${breweryName}`,
        location: `${breweryLocation}`
      }
    });
  };

  const handleShowEditModal = (id: number) => {
    getABeerById(id).then((data) => setDataById(data));
    setShowEditModal(true);
  };

  if (queryGetAllBeers.status === 'loading') {
    return (
      <Container className="d-flex align-items-center justify-content-center mt-4">
        <Row className="d-flex align-items-center justify-content-center">
          <h3>Chargement...</h3>
        </Row>
      </Container>
    );
  }

  if (queryGetAllBeers.status === 'error') {
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
      <Form>
        <Row className="d-flex align-items-center">
          <Col xs={6} lg={3} className="d-flex align-items-center justify-content-center">
            <div className="relative">
              <Button className="me-4" variant="dark" onClick={handleShowAddModal}>
                Ajouter une bière
              </Button>

              <Modal show={showAddModal} onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Ajouter une bière</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInputName">
                      <Form.Label>Nom</Form.Label>
                      <Form.Control
                        placeholder="Bière 3"
                        autoFocus
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInputStyle">
                      <Form.Label>Style</Form.Label>
                      <Form.Select
                        aria-label="selection d'un style de bière"
                        autoFocus
                        onChange={(e) => setStyle(e.target.value)}>
                        <option>Choisir le style de la bière</option>
                        {beersType.map((item) => (
                          <option key={item.key} value={item.value}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInputBreweries">
                      <Form.Label>Brasserie</Form.Label>
                      <Form.Select
                        aria-label="selection d'une brasserie"
                        autoFocus
                        onChange={(e) => {
                          setBrewery(parseInt(e.target.value));
                          setBreweryName(e.target.name);
                        }}>
                        <option>Choisir la brasserie</option>
                        {breweriesName.map((item) => (
                          <option key={item.key} value={item.value}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInputLocation">
                      <Form.Label>Localisation</Form.Label>
                      <Form.Control
                        placeholder="Nantes"
                        autoFocus
                        onChange={(e) => setBreweryLocation(e.target.value)}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="success" onClick={handleCloseAndSaveAddModal}>
                    Enregistrer
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </Col>
          <Col xs={6} className="d-flex align-items-center">
            <Button
              className="mx-2"
              variant="secondary"
              onClick={() => {
                page === 2 && navigateToAPage(-1);
              }}>
              Page précédente
            </Button>
            <Badge className="bg-secondary py-2">{page}/2</Badge>
            <Button
              className="mx-2"
              variant="secondary"
              onClick={() => {
                page === 1 && navigateToAPage(1);
              }}>
              Page Suivante
            </Button>
          </Col>
        </Row>
      </Form>

      <div className="relative px-2">
        {isAuthenticated && user !== undefined ? (
          <div className="d-md-flex m-4 gap-4 align-items-center justify-content-evenly flex-wrap">
            {queryGetAllBeers.data.beers?.map((beer: BeerFullProps) => (
              <Card
                key={beer.id}
                type="beer"
                pictureSrc={'/img/beers/' + beer.style.toLowerCase() + '.png'}
                name={beer.name}
                style={beer.style}
                breweryName={beer.brewery.name}
                breweryLocation={beer.brewery.location}
                children={
                  <Row>
                    <Col className="d-flex align-items-center justify-content-center">
                      <Button
                        id={beer.id.toString()}
                        className="my-2"
                        variant="secondary"
                        onClick={(e) => {
                          beer.id && handleShowEditModal(parseInt(e.currentTarget.id));
                        }}>
                        Modifier
                      </Button>

                      <Modal show={showEditModal} onHide={handleCloseEditModal}>
                        <Modal.Header closeButton>
                          <Modal.Title>Modifier une bière</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputName">
                              <Form.Label>Nom</Form.Label>
                              <Form.Control
                                placeholder={'Le nom est ' + dataById?.name}
                                autoFocus
                                onChange={(e) => setName(e.target.value)}
                              />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInputStyle">
                              <Form.Label>Style</Form.Label>
                              <Form.Select
                                aria-label="selection d'un style de bière"
                                autoFocus
                                onChange={(e) => setStyle(e.target.value)}>
                                <option>{'Le style de la bière est ' + dataById?.style}</option>
                                {beersType.map((item) => (
                                  <option key={item.key} value={item.value}>
                                    {item.name}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group
                              className="mb-3"
                              controlId="exampleForm.ControlInputBreweries">
                              <Form.Label>Brasserie</Form.Label>
                              <Form.Select
                                aria-label="selection d'une brasserie"
                                autoFocus
                                onChange={(e) => {
                                  setBrewery(parseInt(e.target.value));
                                  setBreweryName(e.target.name);
                                }}>
                                <option>{'La brasserie est ' + dataById?.brewery.name}</option>
                                {breweriesName.map((item) => (
                                  <option key={item.key} value={item.value}>
                                    {item.name}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group
                              className="mb-3"
                              controlId="exampleForm.ControlInputLocation">
                              <Form.Label>Localisation</Form.Label>
                              <Form.Control
                                placeholder={'La localisation est ' + dataById?.brewery.location}
                                autoFocus
                                onChange={(e) => setBreweryLocation(e.target.value)}
                              />
                            </Form.Group>
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="success" onClick={handleCloseAndSaveEditModal}>
                            Sauvegardder les changements
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </Col>
                    <Col className="d-flex align-items-center justify-content-center">
                      <Button
                        className="my-2"
                        variant="danger"
                        onClick={() => {
                          beer.id && handleShowDeleteModal();
                        }}>
                        Supprimer
                      </Button>
                      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                        <Modal.Header closeButton>
                          <Modal.Title>Supprimer une bière</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <h4>Êtes-vous sûr de vouloir supprimer cette bière ?</h4>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="success"
                            onClick={() => {
                              beer.id && handleCloseAndSaveDeleteModal(beer.id);
                            }}>
                            Confirmer la suppression
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </Col>
                    <Col className="d-flex align-items-center justify-content-center">
                      <Button
                        className="my-2"
                        variant="dark"
                        onClick={() => {
                          beer.id &&
                            queryPostAnOrder.mutate({
                              customerName: user.name,
                              beers: [{ id: beer.id, name: beer.name, style: beer.style }]
                            });
                        }}>
                        Acheter
                      </Button>
                    </Col>
                  </Row>
                }
              />
            ))}
          </div>
        ) : (
          <p>Vous devez être connecté !</p>
        )}
      </div>
    </Container>
  );
};

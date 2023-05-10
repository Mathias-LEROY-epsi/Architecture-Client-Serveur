import { Container, Image } from 'react-bootstrap';

export const Home = () => {
  return (
    <Container className="mt-4">
      <div className="relative text-center px-2 mx-auto py-8">
        <h1>Bienvenue sur Ubeer</h1>
        <p className="mt-6">Ubeer est une plateforme de livraison de bières à domicile.</p>
        <Image
          className="bg-area z-3 m-4"
          src={'/img/ubeer-mascot.png'}
          height={300}
          width={300}
          alt="mascotte de la page d'accueil"
        />
      </div>
    </Container>
  );
};

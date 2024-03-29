import { PropsWithChildren } from 'react';
import { Card as CardBootstrap } from 'react-bootstrap';
import { CardProps } from '../types';

export const Card = ({
  pictureSrc,
  name,
  style,
  type,
  breweryName,
  breweryLocation,
  date,
  children
}: PropsWithChildren<CardProps>) => {
  return (
    <CardBootstrap
      border="dark"
      style={{ background: '#cccccc', width: '280px', display: 'flex', justifyContent: 'center' }}>
      <CardBootstrap.Img
        src={pictureSrc}
        style={{
          height: '100px',
          width: 'auto',
          minHeight: '100px',
          minWidth: '30px',
          display: 'flex',
          alignSelf: 'center',
          marginBlock: '20px'
        }}
      />
      {type === 'order' ? (
        <>
          <CardBootstrap.Body className="d-flex flex-column align-items-center">
            <CardBootstrap.Text>
              <strong>Date:</strong> {date}
            </CardBootstrap.Text>
            <CardBootstrap.Text>
              <strong>Nom:</strong> {name}
            </CardBootstrap.Text>
            <CardBootstrap.Text>
              <strong>Style:</strong> {style}
            </CardBootstrap.Text>

            {children}
          </CardBootstrap.Body>
        </>
      ) : null}

      {type === 'beer' ? (
        <CardBootstrap.Body className="d-flex flex-column align-items-center">
          <CardBootstrap.Text>
            <strong>Nom:</strong> {name}
          </CardBootstrap.Text>
          <CardBootstrap.Text>
            <strong>Style:</strong> {style}
          </CardBootstrap.Text>
          <CardBootstrap.Text>
            <strong>Brasserie:</strong> {breweryName}
          </CardBootstrap.Text>
          <CardBootstrap.Text>
            <strong>Localisation:</strong> {breweryLocation}
          </CardBootstrap.Text>

          {children}
        </CardBootstrap.Body>
      ) : null}

      {type === 'brewery' ? (
        <CardBootstrap.Body className="d-flex flex-column align-items-center">
          <CardBootstrap.Text>
            <strong>Nom:</strong> {name}
          </CardBootstrap.Text>
          <CardBootstrap.Text>
            <strong>Style:</strong> {style}
          </CardBootstrap.Text>

          {children}
        </CardBootstrap.Body>
      ) : null}
    </CardBootstrap>
  );
};

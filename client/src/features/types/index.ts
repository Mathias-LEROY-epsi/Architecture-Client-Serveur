export type BeerFullProps = {
  id: number;
  name: string;
  style: string;
  brewery: {
    id?: number;
    name: string;
    location: string;
  };
};

export type BeerWithoutIdProps = Omit<BeerFullProps, 'id'>;

export type BeerProps = {
  id?: number;
  name: string;
  style: string;
};

export type BreweryProps = {
  id?: number;
  name: string;
  location: string;
  beers: BeerProps[];
};

export type OrderProps = {
  id?: number;
  customerName?: string;
  date?: string;
  beers: BeerProps[];
};

export type ButtonProps = {
  className?: string;
  variant:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'link';
  href?: string;
  color?: string;
  pageId?: number;
};

export type CardProps = {
  pictureSrc?: string;
  name?: string;
  style?: string;
  breweryName?: string;
  breweryLocation?: string;
  type?: 'beer' | 'order' | 'brewery';
  date?: string;
  customerName?: string;
  beer?: BeerProps;
};

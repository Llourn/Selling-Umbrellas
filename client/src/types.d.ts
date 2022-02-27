export type Customer = {
  id: number;
  name: string;
  personOfContact: string;
  phoneNumber: string;
  location: string;
  lat: number;
  lon: number;
  numberOfEmployees: number;
};

export type Location = {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}


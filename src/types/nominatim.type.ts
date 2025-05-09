export type NominatimResponse = {
    address: {
      house_number?: string;
      road?: string;
      suburb?: string;
      [key: string]: any;
    };
  };
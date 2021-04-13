export interface AccountVisits {
  findAccountByID: {
    name: string;
    visits: {
      data: {
        _id: string;
        ip: string;
      }[];
      after: string | null;
    };
  };
}

export interface GeoCoords {
  geoCoords: {
    _id: string;
  } | null;
}

export interface UpdateVisit {
  updateVisit: {
    _id: string;
  };
}

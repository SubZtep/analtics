interface GQLError {
  error?: {
    message: string
  }
}

export interface AccountVisits extends GQLError {
  findAccountByID: {
    name: string
    visits: {
      data: {
        _id: string
        ip: string
      }[]
      after: string | null
    }
  }
}

export interface CreateGeo extends GQLError {
  createGeo: {
    _id: string
  }
}

export interface GeoCoords extends GQLError {
  geoCoords: {
    _id: string
  } | null
}

export interface UpdateVisit extends GQLError {
  updateVisit: {
    _id: string
  }
}

export interface CreateAccount extends GQLError {
  createAccount: {
    _id: string
  }
}

export interface CreateVisit extends GQLError {
  createVisit: {
    _id: string
  }
}

export interface CreateEvent extends GQLError {
  createEvent: {
    _id: string
  }
}

export interface CreateFeature extends GQLError {
  createFeature: {
    _id: string
  }
}

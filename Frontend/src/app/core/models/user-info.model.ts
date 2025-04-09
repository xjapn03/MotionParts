export interface UserInfo {
  id?: number;
  userId: number;
  type: string;
  documentType: string;
  documentNumber: string;
  documentExp?: string; // Formato ISO: 'yyyy-MM-dd'
  expCountry?: string;
  expRegion?: string;
  expCity?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  secondLastName?: string;
  otherNames?: string;
  legalName?: string;
  email: string;
  country: string;
  region?: string;
  city?: string;
  address?: string;
  addressDetail?: string;
  postalCode?: string;
  phone?: string;
  phone2?: string;
  createdAt?: string;
  updatedAt?: string;
}

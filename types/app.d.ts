type userType = "mechanic" | "vehicle-owner" | "fllet-manager" | "";
export interface Login {
  email: string;
  password: string;
}

export interface MechanicProfileFormType {
  businessName: string;
  businessAddress: string;
  yearsOfExperience: string;
  availabilityFrom: string;
  availabilityTo: string;
  state: string;
  lga: string;
}

export interface FleetProfileFormType {
  businessName: string;
  businessAddress: string;
  state: string;
  fleetSize: string;
}

export type VehicleDetailsFormType = {
  vehicleName: string;
  makeModel: string;
  year: string;
  licensePlateNumber: string;
  vehicleInspectionNumber: string;
  mileage: string;
  vehicleType: string;
  fuelType: string;
};

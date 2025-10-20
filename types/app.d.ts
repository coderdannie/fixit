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
}

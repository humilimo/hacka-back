export class ComplaintDto {
  userPhoneNumber: string;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: Date;
  solvedAt: Date;
  solved: boolean;
}
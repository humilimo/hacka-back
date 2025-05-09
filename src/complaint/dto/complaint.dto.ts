export class ComplaintDto {
  userPhoneNumber: string;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: Date;
  approvedAt: Date;
  approved: boolean;
}
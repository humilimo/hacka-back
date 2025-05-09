export class ComplaintDto {
  userPhoneNumber: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  solvedAt: Date;
  solved: boolean;
}
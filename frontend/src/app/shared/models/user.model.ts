export interface User {
  email: string;
  roles: string[];

  title?: string;
  lastname?: string;
  firstname?: string;
  birthday?: string;
  phonenumber?: string;

  validated?: boolean;
  reminderemail?: boolean;
  birthdayemail?: boolean;
  newsletter?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

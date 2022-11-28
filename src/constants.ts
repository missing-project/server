interface EndPointInterface {
  index: string;
  user: string;
  missingPerson: string;
  bookmark: string;
  guest: string;
}

export const endPoint: EndPointInterface = {
  index: '/',
  user: '/user',
 missingPerson: '/mp',
  bookmark: '/bookmark',
  guest: '/guest',
};

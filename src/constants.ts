interface EndPointInterface {
  index: string;
  user: string;
  missingPerson: string;
}

export const endPoint: EndPointInterface = {
  index: '/',
  user: '/user',
  missingPerson: '/mp',
};

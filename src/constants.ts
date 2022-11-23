interface EndPointInterface {
  index: string;
  user: string;
  missingPerson: string;
  bookmark: string;
}

export const endPoint: EndPointInterface = {
  index: '/',
  user: '/user',
  missingPerson: '/mp',
  bookmark: '/bookmark',
};

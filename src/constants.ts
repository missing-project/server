interface EndPointInterface {
  index: string;
  user: string;
  db: string;
}

export const endPoint: EndPointInterface = {
  index: '/',
  user: '/user',
  db: '/db',
};

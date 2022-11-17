import axios from 'axios';

type Case = {
  nm: string;
  age: string;
};

type GetCaseResponse = {
  data: Case[];
};

async function getUsers() {
  try {
    const { data, status } = await axios.get<GetCaseResponse>(
      'https://www.safe182.go.kr/api/lcm/findChildList.do?esntlId=10000500&authKey=7414e21853de46f7&rowSize=1',
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    console.log(JSON.stringify(data, null, 4));

    console.log('response status is: ', status);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}

getUsers();
